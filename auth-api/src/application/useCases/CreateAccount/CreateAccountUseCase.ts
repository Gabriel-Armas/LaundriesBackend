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
    const { email, password, role } = request;

    if (!email || !password) {
      throw new Error("INVALID_INPUT");
    }

    const existing = await this.accountRepository.findByEmail(email);
    if (existing) {
      throw new Error("EMAIL_ALREADY_IN_USE");
    }

    const passwordHash = await this.cryptographyService.hashPassword(password);

    const account = Account.createNew(email, passwordHash, role ?? "EMPLOY");

    const created = await this.accountRepository.create(account);

    return {
      id: created.id,
      email: created.email,
      role: created.role,
      createdAt: created.createdAt,
    };
  }
}
