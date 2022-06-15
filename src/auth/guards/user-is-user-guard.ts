import {
  Injectable,
  CanActivate,
  Inject,
  forwardRef,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { User } from 'src/user/models/user.interface';
import { UserService } from 'src/user/service/user.service';

@Injectable()
export class UserIsUserGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const param = request.params;
    // console.log(param);
    const user: User = request.user.user;
    // console.log(user.id);

    return this.userService.findOne(user.id).pipe(
      map((user: User) => {
        let hasPermission = false;

        if (user.id === Number(param.id)) {
          hasPermission = true;
        }

        return user && hasPermission;
      }),
    );
  }
}
