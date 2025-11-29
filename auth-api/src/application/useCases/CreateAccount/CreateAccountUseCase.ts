import { IAccountRepository } from "../../ports/repositories/IAccountRepository";
import { ICryptographyService } from "../../ports/services/ICryptographyService";
import { Account } from "../../../domain/Account";
import { CreateAccountRequest } from "./CreateAccountRequest";
import { CreateAccountResponse } from "./CreateAccountResponse";

export class CreateAccountUseCase {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly cryptographyService: ICryptographyService
  ) {}

  async execute(request: CreateAccountRequest): Promise<CreateAccountResponse> {
    const { email, password, role, actorRole } = request;

    if (!email || !password || !role || !actorRole) {
      throw new Error("INVALID_INPUT");
    }

    if (role === "ADMIN") {
      throw new Error("FORBIDDEN_CREATE_ADMIN");
    }
    if (role === "EMPLOYEE" && actorRole !== "MANAGER") {
      throw new Error("REQUIRES_MANAGER_TO_CREATE_EMPLOYEE");
    }

    if (role === "MANAGER" && actorRole !== "ADMIN") {
      throw new Error("REQUIRES_ADMIN_TO_CREATE_MANAGER");
    }

    const existing = await this.accountRepository.findByEmail(email);
    if (existing) {
      throw new Error("EMAIL_ALREADY_IN_USE");
    }

    const passwordHash = await this.cryptographyService.hashPassword(password);

    const account = Account.createNew(email, passwordHash, role);

    const created = await this.accountRepository.create(account);

    return {
      id: created.id,
      email: created.email,
      role: created.role,
      createdAt: created.createdAt,
    };
  }
}
