// Original file: protos/chat.proto

import type { User as _proto_User, User__Output as _proto_User__Output } from '../proto/User';

export interface Connect {
  'user'?: (_proto_User | null);
  'active'?: (boolean);
}

export interface Connect__Output {
  'user'?: (_proto_User__Output);
  'active'?: (boolean);
}
