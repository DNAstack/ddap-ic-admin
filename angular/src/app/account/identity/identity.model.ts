import { ic } from "../../shared/proto/ic-service";
import Account = ic.v1.Account;

export interface Identity {
  account: Account,
  scopes: string[];
  sandbox: boolean;
}
