import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const role = request.headers['x-user-role'];
    
    if (!role || role !== 'admin') {
      throw new ForbiddenException('No tienes permisos para realizar esta acción');
    }
    return true;
  }
}