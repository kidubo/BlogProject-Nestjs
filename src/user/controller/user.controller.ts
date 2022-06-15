/* eslint-disable @typescript-eslint/ban-types */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { catchError, map, Observable, of } from 'rxjs';
import { User, UserRole } from '../models/user.interface';
import { hasRoles } from 'src/auth/decorator/role.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path = require('path');
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const storage = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  create(@Body() user: User): Observable<User | Object> {
    return this.userService.create(user).pipe(
      map((user: User) => user),
      catchError((err) => of({ error: err.message })),
    );
  }

  @Post('login')
  login(@Body() user: User): Observable<Object> {
    return this.userService.login(user).pipe(
      map((jwt: string) => {
        return { access_token: jwt };
      }),
    );
  }

  @Get(':id')
  findOne(@Param() Param): Observable<User> {
    return this.userService.findOne(Param.id);
  }

  @Get()
  index(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('username') username: string,
  ): Observable<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;
    // console.log(username);

    if (username === null || username === undefined) {
      return this.userService.paginate({
        page: Number(page),
        limit: Number(limit),
        route: 'http://localhost:3000/users',
      });
    } else {
      return this.userService.paginateFilterByUsername(
        {
          page: Number(page),
          limit: Number(limit),
          route: 'http://localhost:3000/users',
        },
        { username },
      );
    }
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string): Observable<User> {
    return this.userService.deleteOne(Number(id));
  }

  @Put(':id')
  updateOne(@Body() body: User, @Param('id') id: string): Observable<any> {
    return this.userService.updateOne(Number(id), body);
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/role')
  updaterole(@Body() body: User, @Param('id') id: string): Observable<any> {
    return this.userService.updateOne(Number(id), body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(@UploadedFile() file, @Request() req): Observable<Object> {
    // console.log(file);
    const user: User = req.user.user;
    // console.log(user);

    return this.userService
      .updateOne(user.id, { profileImage: file.filename })
      .pipe(map((user: User) => ({ profileImage: user.profileImage })));
  }

  @Get('profile-image/:imagename')
  findProfileImage(
    @Param('imagename') imagename,
    @Res() res,
  ): Observable<Object> {
    return of(
      res.sendFile(join(process.cwd(), 'uploads/profileimage/' + imagename)),
    );
  }
}
