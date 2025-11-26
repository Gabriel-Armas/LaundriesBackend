import { Account } from "../../../domain/Account";

export interface IAccountRepository {
  findByEmail(email: string): Promise<Account | null>;
  create(account: Account): Promise<Account>;
}
