import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import { ProtoGrpcType } from '../protos/chat'
import { User } from '../protos/proto/User'


const PROTO_PATH = './protos/chat.proto'

const packageDefinition = protoLoader.loadSync(PROTO_PATH)
const grpcObject = (grpc.loadPackageDefinition(packageDefinition) as unknown) as ProtoGrpcType

const broadcastPackage = grpcObject.proto

let users: { [key: string]: grpc.ServerWritableStream<any, any> } = {}

function createStream(call: grpc.ServerWritableStream<any, any>) {
  const user: User = call.request.user
  users[user.id] = call
  console.log(`${user.name} connected`)

  call.on('cancelled', () => {
    delete users[user.id]
    console.log(`${user.name} disconnected`)
  })
}

function broadcastMessage(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
  const message = call.request

  for (const userId in users) {
    users[userId].write(message)
  }
  
  callback(null, {})
}

function startServer() {
  const server = new grpc.Server()
  server.addService(broadcastPackage.Broadcast.service, {
    CreateStream: createStream,
    BroadcastMessage: broadcastMessage
  })

  const PORT = '8082'
  server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(`Server running at http://0.0.0.0:${port}`)
    server.start()
  })
}

startServer()
