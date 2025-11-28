import { IAccountRepository } from "../../ports/repositories/IAccountRepository";
import { ChangeAccountRoleRequest } from "./ChangeAccountRoleRequest";
import { ChangeAccountRoleResponse } from "./ChangeAccountRoleResponse";

const ALLOWED_ROLES = ["EMPLOYEE", "DELETED", "MANAGER"];

export class ChangeAccountRoleUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(
    request: ChangeAccountRoleRequest
  ): Promise<ChangeAccountRoleResponse> {
    const { accountId, newRole } = request;

    if (!accountId || !newRole) {
      throw new Error("INVALID_INPUT");
    }

    if (!ALLOWED_ROLES.includes(newRole)) {
      throw new Error("INVALID_ROLE");
    }

    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      throw new Error("ACCOUNT_NOT_FOUND");
    }

    if (account.role === "DELETED") {
      throw new Error("ACCOUNT_DELETED");
    }

    const updated = await this.accountRepository.updateRole(accountId, newRole);

    return {
      id: updated.id,
      email: updated.email,
      role: updated.role,
    };
  }
}
