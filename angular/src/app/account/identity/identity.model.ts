import { common } from '../../shared/proto/ic-service';
import Account = common.Account;

export interface Identity {
  account: Account;
  scopes: string[];
  sandbox: boolean;
}
