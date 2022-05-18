import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { Observable } from 'rxjs';
import { User } from '../models/user.interface';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() user: User): Observable<User> {
    return this.userService.create(user);
  }

  @Get(':id')
  findOne(@Param() Param): Observable<User> {
    return this.userService.findOne(Param.id);
  }

  @Get()
  findAll(): Observable<User[]> {
    return this.userService.findAll();
  }

  @Delete()
  deleteOne(@Param('id') id: string): Observable<User> {
    return this.userService.deleteOne(Number(id));
  }

  @Put(':id')
  updateOne(@Body() body: User, @Param('id') id: string): Observable<any> {
    return this.userService.updateOne(Number(id), body);
  }
}
