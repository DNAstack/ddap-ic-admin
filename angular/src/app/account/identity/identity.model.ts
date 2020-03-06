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
  connectedAccounts: SimpleAccountInfo[];
}

export interface Visa {
  type: string;
  value: string;
  source: string;
  by: string;
  asserted: number;
  exp: number;
}

export interface SimpleAccountInfo {
  sub: string;
  primary: boolean;
  provider: string;
  email: string;
  photoUrl?: string;
  loginHint: string;
  passport: Visa[];
}
