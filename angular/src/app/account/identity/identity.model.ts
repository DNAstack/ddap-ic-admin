import { scim } from '../../shared/proto/ic-service';
import IUser = scim.v2.IUser;

export interface Identity {
  account: UserInfo;
  scopes: string[];
  sandbox: boolean;
}

export interface UserInfo {
  scim: IUser;
  sub: string;
  connectedAccounts: Account[];
}

export interface Visa {
  type: string;
  value: string;
  source: string;
  by: string;
  asserted: number;
  exp: number;
}

export interface Account {
  sub: string;
  provider: string;
  email: string;
  photoUrl?: string;
  passport: Visa[];
}
