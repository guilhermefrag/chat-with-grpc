// websocket-server.ts
import WebSocket from 'ws'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import { ProtoGrpcType } from '../protos/chat'
import { Message } from '../protos/proto/Message'
import { Connect } from '../protos/proto/Connect'
import { User } from '../protos/proto/User'


const PROTO_PATH = './protos/chat.proto'
const packageDefinition = protoLoader.loadSync(PROTO_PATH)
const grpcObject = (grpc.loadPackageDefinition(packageDefinition) as unknown) as ProtoGrpcType
const broadcastPackage = grpcObject.proto

const grpcClient = new broadcastPackage.Broadcast('localhost:8082', grpc.credentials.createInsecure())

const wss = new WebSocket.Server({ port: 8083 })

wss.on('connection', (ws) => {
  console.log('Client connected')

  ws.on('message', (data) => {
    const parsedData = JSON.parse(data.toString())
    if (parsedData.type === 'connect') {
      const user: User = { id: Date.now(), name: parsedData.name }
      const connect: Connect = { user, active: true }
      const stream = grpcClient.CreateStream(connect)

      stream.on('data', (message: Message) => {
        ws.send(JSON.stringify({ type: 'message', message }))
      })

      ws.on('close', () => {
        console.log('Client disconnected')
      })
    } else if (parsedData.type === 'message') {
      const message: Message = { id: parsedData.id, content: parsedData.content, timestamp: new Date().toISOString() }
      grpcClient.BroadcastMessage(message, (err: grpc.ServiceError | null) => {
        if (err) {
          console.error(err)
        }
      })
    }
  })
})

console.log('WebSocket server running at ws://localhost:8083')
