import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPort, AuthUser } from '../../core/employees/domain/auth.port';

@Injectable()
export class AuthHttpAdapter implements AuthPort {
  constructor(private readonly jwtService: JwtService) {}

  async verifyToken(token: string): Promise<AuthUser> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });

      return {
        id: payload.sub,
        role: payload.role,
        email: payload.email,
      };
    } catch (err) {
      throw new Error('Token inválido');
    }
  }

  createUser(): Promise<any> {
    throw new Error('createUser no está implementado en employees-api');
  }

  updateUser(): Promise<any> {
    throw new Error('updateUser no está implementado en employees-api');
  }

  getUserById(): Promise<any> {
    throw new Error('getUserById no está implementado en employees-api');
  }
}