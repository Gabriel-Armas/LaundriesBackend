import bcrypt from "bcrypt";
import { ICryptographyService } from "../../../application/ports/services/ICryptographyService";

const SALT_ROUNDS = 10;

export class BcryptCryptographyService implements ICryptographyService {
  async hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, SALT_ROUNDS);
  }

  async comparePassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
