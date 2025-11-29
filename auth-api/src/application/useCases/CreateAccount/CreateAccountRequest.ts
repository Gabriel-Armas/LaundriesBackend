import { Role } from "../../../interfaces/http/express/middelware/authMiddleware";

export interface CreateAccountRequest {
  email: string;
  password: string;
  role: Exclude<Role, "DELETED">;
  actorRole: Role;
}
