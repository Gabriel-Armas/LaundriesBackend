import { IAccountRepository } from "../../ports/repositories/IAccountRepository";
import { GetAccountRoleByIdRequest } from "./GetAccountRoleByIdRequest";
import { GetAccountRoleByIdResponse } from "./GetAccountRoleByIdResponse";

export class GetAccountRoleByIdUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(
    request: GetAccountRoleByIdRequest
  ): Promise<GetAccountRoleByIdResponse> {
    const { accountId } = request;

    if (!accountId) {
      throw new Error("INVALID_INPUT");
    }

    const account = await this.accountRepository.findById(accountId);

    if (!account) {
      throw new Error("ACCOUNT_NOT_FOUND");
    }

    if (account.role === "DELETED") {
      throw new Error("ACCOUNT_DELETED");
    }

    return {
      id: account.id,
      role: account.role,
    };
  }
}
