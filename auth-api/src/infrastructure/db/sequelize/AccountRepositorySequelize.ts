import { IAccountRepository } from "../../../application/ports/repositories/IAccountRepository";
import { Account, AccountProps } from "../../../domain/Account";
import { AccountModel } from "./AccountModel";

export class AccountRepositorySequelize implements IAccountRepository {
  async findByEmail(email: string): Promise<Account | null> {
    const accountRow = await AccountModel.findOne({ where: { email } });

    if (!accountRow) {
      return null;
    }

    const props: AccountProps = {
      id: accountRow.id,
      email: accountRow.email,
      password: accountRow.password,
      role: accountRow.role,
      createdAt: accountRow.createdAt,
      updatedAt: accountRow.updatedAt,
    };

    return Account.fromPersistence(props);
  }

  async findById(id: string): Promise<Account | null> {
    const accountRow = await AccountModel.findByPk(id);

    if (!accountRow) {
      return null;
    }

    const props: AccountProps = {
      id: accountRow.id,
      email: accountRow.email,
      password: accountRow.password,
      role: accountRow.role,
      createdAt: accountRow.createdAt,
      updatedAt: accountRow.updatedAt,
    };

    return Account.fromPersistence(props);
  }

  async create(account: Account): Promise<Account> {
    const created = await AccountModel.create({
      email: account.email,
      password: account.password,
      role: account.role,
    });

    const props: AccountProps = {
      id: created.id,
      email: created.email,
      password: created.password,
      role: created.role,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };

    return Account.fromPersistence(props);
  }

  async updateRole(id: string, newRole: string): Promise<Account> {
    const accountRow = await AccountModel.findByPk(id);

    if (!accountRow) {
      throw new Error("ACCOUNT_NOT_FOUND");
    }

    accountRow.role = newRole;
    await accountRow.save();

    const props: AccountProps = {
      id: accountRow.id,
      email: accountRow.email,
      password: accountRow.password,
      role: accountRow.role,
      createdAt: accountRow.createdAt,
      updatedAt: accountRow.updatedAt,
    };

    return Account.fromPersistence(props);
  }
}
