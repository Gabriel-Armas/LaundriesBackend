import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AuthPort, AuthRole, AuthUser } from '../../core/employees/domain/auth.port';

@Injectable()
export class AuthHttpAdapter implements AuthPort {
  constructor(private readonly http: HttpService) {}

  private baseUrl = process.env.AUTH_API_URL || 'http://host.docker.internal:4000';

  async createUser(input: {
    email: string;
    password: string;
    role: AuthRole;
  }): Promise<AuthUser> {
    const { data } = await this.http.axiosRef.post(`${this.baseUrl}/users`, input);
    return data;
  }

  async updateUser(input: {
    id: string;
    email?: string;
    password?: string;
    role?: AuthRole;
  }): Promise<AuthUser> {
    const { data } = await this.http.axiosRef.put(`${this.baseUrl}/users/${input.id}`, input);
    return data;
  }

  async getUserById(id: string): Promise<AuthUser | null> {
    const { data } = await this.http.axiosRef.get(`${this.baseUrl}/users/${id}`);
    return data ?? null;
  }
}