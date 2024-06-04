// Original file: protos/chat.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { Connect as _proto_Connect, Connect__Output as _proto_Connect__Output } from '../proto/Connect';
import type { Empty as _proto_Empty, Empty__Output as _proto_Empty__Output } from '../proto/Empty';
import type { Message as _proto_Message, Message__Output as _proto_Message__Output } from '../proto/Message';

export interface BroadcastClient extends grpc.Client {
  BroadcastMessage(argument: _proto_Message, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_proto_Empty__Output>): grpc.ClientUnaryCall;
  BroadcastMessage(argument: _proto_Message, metadata: grpc.Metadata, callback: grpc.requestCallback<_proto_Empty__Output>): grpc.ClientUnaryCall;
  BroadcastMessage(argument: _proto_Message, options: grpc.CallOptions, callback: grpc.requestCallback<_proto_Empty__Output>): grpc.ClientUnaryCall;
  BroadcastMessage(argument: _proto_Message, callback: grpc.requestCallback<_proto_Empty__Output>): grpc.ClientUnaryCall;
  broadcastMessage(argument: _proto_Message, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_proto_Empty__Output>): grpc.ClientUnaryCall;
  broadcastMessage(argument: _proto_Message, metadata: grpc.Metadata, callback: grpc.requestCallback<_proto_Empty__Output>): grpc.ClientUnaryCall;
  broadcastMessage(argument: _proto_Message, options: grpc.CallOptions, callback: grpc.requestCallback<_proto_Empty__Output>): grpc.ClientUnaryCall;
  broadcastMessage(argument: _proto_Message, callback: grpc.requestCallback<_proto_Empty__Output>): grpc.ClientUnaryCall;
  
  CreateStream(argument: _proto_Connect, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_proto_Message__Output>;
  CreateStream(argument: _proto_Connect, options?: grpc.CallOptions): grpc.ClientReadableStream<_proto_Message__Output>;
  createStream(argument: _proto_Connect, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_proto_Message__Output>;
  createStream(argument: _proto_Connect, options?: grpc.CallOptions): grpc.ClientReadableStream<_proto_Message__Output>;
  
}

export interface BroadcastHandlers extends grpc.UntypedServiceImplementation {
  BroadcastMessage: grpc.handleUnaryCall<_proto_Message__Output, _proto_Empty>;
  
  CreateStream: grpc.handleServerStreamingCall<_proto_Connect__Output, _proto_Message>;
  
}

export interface BroadcastDefinition extends grpc.ServiceDefinition {
  BroadcastMessage: MethodDefinition<_proto_Message, _proto_Empty, _proto_Message__Output, _proto_Empty__Output>
  CreateStream: MethodDefinition<_proto_Connect, _proto_Message, _proto_Connect__Output, _proto_Message__Output>
}
