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

// Converte a definição carregada em um objeto utilizável pelo gRPC
const grpcObject = (grpc.loadPackageDefinition(packageDefinition) as unknown) as ProtoGrpcType

// Acessa o pacote definido no arquivo proto
const broadcastPackage = grpcObject.proto

// Cria um cliente gRPC para o serviço Broadcast
const grpcClient = new broadcastPackage.Broadcast('localhost:8082', grpc.credentials.createInsecure())

// Cria um servidor WebSocket escutando na porta 8083
const wss = new WebSocket.Server({ port: 8083 })

// Evento de conexão de cliente WebSocket
wss.on('connection', (ws) => {
  console.log('Client connected')

  // Evento de recebimento de mensagem do cliente WebSocket
  ws.on('message', (data) => {
    // Converte a mensagem recebida de string para objeto JSON
    const parsedData = JSON.parse(data.toString())

    // Verifica o tipo da mensagem recebida
    if (parsedData.type === 'connect') {
      // Se a mensagem for do tipo 'connect', cria um novo usuário
      const user: User = { id: Date.now(), name: parsedData.name }
      const connect: Connect = { user, active: true }

      // Cria um stream gRPC para o usuário conectado
      const stream = grpcClient.CreateStream(connect)

      // Evento de recebimento de dados do stream gRPC
      stream.on('data', (message: Message) => {
        // Envia a mensagem recebida pelo stream de volta ao cliente WebSocket
        ws.send(JSON.stringify({ type: 'message', message }))
      })

      // Evento de desconexão do cliente WebSocket
      ws.on('close', () => {
        console.log('Client disconnected')
      })
    } else if (parsedData.type === 'message') {
      // Se a mensagem for do tipo 'message', cria uma nova mensagem
      const message: Message = { id: parsedData.id, content: parsedData.content, timestamp: new Date().toISOString() }

      // Envia a mensagem ao servidor gRPC para ser transmitida
      grpcClient.BroadcastMessage(message, (err: grpc.ServiceError | null) => {
        if (err) {
          console.error(err)
        }
      })
    }
  })
})

console.log('WebSocket server running at ws://localhost:8083')
