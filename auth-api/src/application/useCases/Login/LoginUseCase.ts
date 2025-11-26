import { IAccountRepository } from "../../ports/repositories/IAccountRepository";
import { ICryptographyService } from "../../ports/services/ICryptographyService";
import { ITokenService } from "../../ports/services/ITokenService";
import { LoginRequest } from "./LoginRequest";
import { LoginResponse } from "./LoginResponse";

export class LoginUseCase {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly cryptographyService: ICryptographyService,
    private readonly tokenService: ITokenService
  ) {}

  async execute(request: LoginRequest): Promise<LoginResponse> {
    const { email, password } = request;

    if (!email || !password) {
      throw new Error("INVALID_INPUT");
    }

    const account = await this.accountRepository.findByEmail(email);
    if (!account) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const isValid = await this.cryptographyService.comparePassword(
      password,
      account.password
    );

    if (!isValid) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const payload = {
      userId: account.id,
      email: account.email,
      role: account.role,
    };

    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    return {
      id: account.id,
      email: account.email,
      role: account.role,
      accessToken,
      refreshToken,
    };
  }
}
