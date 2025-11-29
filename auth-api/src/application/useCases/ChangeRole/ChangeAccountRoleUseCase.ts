import { IAccountRepository } from "../../ports/repositories/IAccountRepository";
import { ChangeAccountRoleRequest } from "./ChangeAccountRoleRequest";
import { ChangeAccountRoleResponse } from "./ChangeAccountRoleResponse";

const ALLOWED_ROLES = ["EMPLOYEE", "DELETED", "MANAGER", "ADMIN"];

export class ChangeAccountRoleUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(
    request: ChangeAccountRoleRequest
  ): Promise<ChangeAccountRoleResponse> {
    const { accountId, newRole, actorRole } = request;

    if (!accountId || !newRole || !actorRole) {
      throw new Error("INVALID_INPUT");
    }

    if (!ALLOWED_ROLES.includes(actorRole)) {
      throw new Error("FORBIDDEN_ACTOR_ROLE");
    }

    if (newRole !== "DELETED") {
      throw new Error("FORBIDDEN_ROLE_CHANGE");
    }

    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      throw new Error("ACCOUNT_NOT_FOUND");
    }

    if (account.role === "DELETED") {
      throw new Error("ACCOUNT_ALREADY_DELETED");
    }

    if (actorRole === "MANAGER") {
      if (account.role !== "EMPLOYEE") {
        throw new Error("FORBIDDEN_TARGET_ROLE");
      }
    } else if (actorRole === "ADMIN") {
    } else {
      throw new Error("FORBIDDEN_ACTOR_ROLE");
    }

    const updated = await this.accountRepository.updateRole(accountId, newRole);

    return {
      id: updated.id,
      email: updated.email,
      role: updated.role,
    };
  }
}
