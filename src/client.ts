import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import readline from 'readline'
import { ProtoGrpcType } from '../protos/chat'
import { Message } from '../protos/proto/Message'
import { Connect } from '../protos/proto/Connect'
import { User } from '../protos/proto/User'

const PROTO_PATH = './protos/chat.proto'

const packageDefinition = protoLoader.loadSync(PROTO_PATH)
const grpcObject = (grpc.loadPackageDefinition(packageDefinition) as unknown) as ProtoGrpcType
const broadcastPackage = grpcObject.proto

const client = new broadcastPackage.Broadcast('localhost:8082', grpc.credentials.createInsecure())

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

let user: User

rl.question('Enter your username: ', (username) => {
  user = { id: Date.now(), name: username }
  start()
})

function start() {
  const connect: Connect = { user, active: true }
  const stream = client.CreateStream(connect)

  stream.on('data', (message: Message) => {
    console.log(`${message.timestamp} - ${message.id}: ${message.content}`)
  })

  rl.on('line', (input: string) => {
    const message: Message = { id: user.id, content: input, timestamp: new Date().toISOString() }
    client.BroadcastMessage(message, (err: grpc.ServiceError | null) => {
      if (err) {
        console.error(err)
      }
    })
  })

  stream.on('end', () => {
    console.log('Connection ended.')
  })
}
