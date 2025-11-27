export type AuthRole = 'EMPLEADO' | 'GERENTE' | 'ELIMINADO';

export interface AuthUser {
  id: string;    
  email: string;
  role: AuthRole;
}

export interface AuthPort {
  createUser(input: {
    email: string;
    password: string;
    role: AuthRole;
  }): Promise<AuthUser>;

  updateUser(input: {
    id: string;
    email?: string;
    password?: string;
    role?: AuthRole;
  }): Promise<AuthUser>;

  getUserById(id: string): Promise<AuthUser | null>;
}