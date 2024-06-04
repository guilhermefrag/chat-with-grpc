import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { BroadcastClient as _proto_BroadcastClient, BroadcastDefinition as _proto_BroadcastDefinition } from './proto/Broadcast';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  proto: {
    Broadcast: SubtypeConstructor<typeof grpc.Client, _proto_BroadcastClient> & { service: _proto_BroadcastDefinition }
    Connect: MessageTypeDefinition
    Empty: MessageTypeDefinition
    Message: MessageTypeDefinition
    User: MessageTypeDefinition
  }
}

