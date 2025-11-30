import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
    ForbiddenException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { JwtPayload } from './jwt-payload.type';
  
  @Injectable()
  export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}
  
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
  
      const authHeader = request.headers['authorization'] as string | undefined;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Missing or invalid Authorization header');
      }
  
      const token = authHeader.substring(7);
  
      try {
        const payload = this.jwtService.verify<JwtPayload>(token);
  
        if (payload.role === 'DELETED') {
          throw new ForbiddenException('User is deleted');
        }
  
        request.user = payload;
        return true;
      } catch (err) {
        if (err instanceof ForbiddenException) throw err;
        throw new UnauthorizedException('Invalid or expired token');
      }
    }
  }