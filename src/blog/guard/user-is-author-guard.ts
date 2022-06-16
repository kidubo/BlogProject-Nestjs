/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { User } from 'src/user/models/user.interface';
import { UserService } from 'src/user/service/user.service';
import { BlogService } from '../blog.service';
import { Blog } from '../dtos/blog-interface';

@Injectable()
export class UserIsAuthorGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private blogService: BlogService,
  ) {}

  canActivate(context: ExecutionContext): Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const params = request.params;
    // console.log(params + ' request param');
    const blogId = Number(params.id);
    // console.log(blogId + ' blog id');
    const user: User = request.user;
    // console.log(user);

    return this.userService.findOne(user.id).pipe(
      switchMap((user: User) =>
        this.blogService.findOne(blogId).pipe(
          map((blog: Blog) => {
            let hasPermission = false;
            if (user.id === blog.author.id) {
              hasPermission = true;
            }
            return user && hasPermission;
          }),
        ),
      ),
    );
  }
}
