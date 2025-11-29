import { Role } from "../../../interfaces/http/express/middelware/authMiddleware";

export interface ChangeAccountRoleRequest {
  accountId: string;
  newRole: "DELETED";
  actorRole: Role;
}
