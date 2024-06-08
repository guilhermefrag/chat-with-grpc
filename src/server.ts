import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import { ProtoGrpcType } from '../protos/chat'
import { User } from '../protos/proto/User'

// Importa o módulo grpc para comunicação gRPC e protoLoader para carregar arquivos protobuf.
// ProtoGrpcType é o tipo gerado pelo arquivo de definição protobuf (chat.proto).
// User é uma mensagem definida no arquivo de definição protobuf.

const PROTO_PATH = './protos/chat.proto'

// Define o caminho do arquivo de definição protobuf.

const packageDefinition = protoLoader.loadSync(PROTO_PATH)
const grpcObject = (grpc.loadPackageDefinition(packageDefinition) as unknown) as ProtoGrpcType

// Carrega o arquivo de definição protobuf e cria um objeto gRPC com base nele.

const broadcastPackage = grpcObject.proto

// Atribui o objeto de definição protobuf à variável broadcastPackage.

let users: { [key: string]: grpc.ServerWritableStream<any, any> } = {}

// Declara um objeto vazio chamado 'users' para armazenar as conexões dos usuários.

function createStream(call: grpc.ServerWritableStream<any, any>) {
  const user: User = call.request.user
  users[user.id] = call
  console.log(`${user.name} connected`)

  call.on('cancelled', () => {
    delete users[user.id]
    console.log(`${user.name} disconnected`)
  })
}

// Define uma função chamada 'createStream' que é invocada quando um novo usuário se conecta.
// Armazena a conexão do usuário no objeto 'users' e registra um evento de 'cancelled' para lidar com desconexões.

function broadcastMessage(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
  const message = call.request

  for (const userId in users) {
    users[userId].write(message)
  }
  
  callback(null, {})
}

// Define uma função chamada 'broadcastMessage' que é invocada para transmitir uma mensagem a todos os usuários.
// Itera sobre todas as conexões de usuários armazenadas em 'users' e envia a mensagem para cada uma delas.

function startServer() {
  const server = new grpc.Server()
  server.addService(broadcastPackage.Broadcast.service, {
    CreateStream: createStream,
    BroadcastMessage: broadcastMessage
  })

  // Cria um servidor gRPC.
  // Adiciona serviços ao servidor, especificando as funções a serem chamadas quando os métodos de serviço forem invocados.

  const PORT = '8082'
  server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(`Server running at http://0.0.0.0:${port}`)
    server.start()
  })

  // Liga o servidor a uma porta específica e inicia o servidor.
}

startServer()
