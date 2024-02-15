import {
  Injectable,
  ExecutionContext,
  CanActivate,
  NotFoundException,
} from '@nestjs/common';
import { ROLES_KEY } from '../../decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization;
    const user =
      await this.userService.getFromAuthorizationHeader(authorizationHeader);
    if (user) {
      return requiredRoles.some((role) => user.roles?.includes(role));
    } else throw new NotFoundException();
  }
}
