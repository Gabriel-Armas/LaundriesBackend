import { IAccountRepository } from "../../ports/repositories/IAccountRepository";
import { ITokenService } from "../../ports/services/ITokenService";
import { RefreshTokenRequest } from "./RefreshTokenRequest";
import { RefreshTokenResponse } from "./RefreshTokenResponse";

export class RefreshTokenUseCase {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly tokenService: ITokenService
  ) {}

  async execute(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const { refreshToken } = request;

    if (!refreshToken) {
      throw new Error("INVALID_INPUT");
    }

    const payload = this.tokenService.verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new Error("INVALID_REFRESH_TOKEN");
    }

    const account = await this.accountRepository.findByEmail(payload.email);
    if (!account) {
      throw new Error("USER_NOT_FOUND");
    }

    const newPayload = {
      userId: account.id,
      email: account.email,
      role: account.role,
    };

    const newAccessToken = this.tokenService.generateAccessToken(newPayload);
    const newRefreshToken = this.tokenService.generateRefreshToken(newPayload);

    return {
      id: account.id,
      email: account.email,
      role: account.role,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
