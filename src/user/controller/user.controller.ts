/* eslint-disable @typescript-eslint/ban-types */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { catchError, map, Observable, of } from 'rxjs';
import { User, UserRole } from '../models/user.interface';
import { hasRoles } from 'src/auth/decorator/role.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';

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
  findAll(): Observable<User[]> {
    return this.userService.findAll();
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
}
