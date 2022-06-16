/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../../user/service/user.service';
import { map, Observable } from 'rxjs';
import { User } from 'src/user/models/user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    // console.log(request);
    const user: User = request.user;
    // console.log(user);
    return this.userService.findOne(user.id).pipe(
      map((user: User) => {
        const hasRole = () => roles.indexOf(user.role) > -1;
        let hasPermission: boolean = false;
        // console.log(hasRole);
        if (hasRole()) {
          console.log('has role true');
          hasPermission = true;
        }

        return user && hasPermission;
      }),
    );
  }
}
