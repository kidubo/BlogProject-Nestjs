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
  UseGuards,
} from '@nestjs/common';
import { Blog } from './dtos/blog-interface';
import { Observable } from 'rxjs';
import { BlogService } from './blog.service';
import { JwtAuthGuard } from '../auth/guards/jwt-guard';
import { UserIsAuthorGuard } from './guard/user-is-author-guard';

@Controller('blogs')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() blog: Blog, @Request() req): Observable<Blog> {
    const user = req.user;
    return this.blogService.create(user, blog);
  }

  @Get()
  findBlog(@Query('userId') userId: number): Observable<Blog[]> {
    if (userId == null) {
      return this.blogService.findAll();
    } else {
      return this.blogService.findByUser(userId);
    }
  }

  @Get('/:id')
  findOne(@Param('id') id: number): Observable<Blog> {
    return this.blogService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
  @Put('/:id')
  updated(@Param('id') id: string, @Body() blog: Blog): Observable<Blog> {
    return this.blogService.updateOne(Number(id), blog);
  }

  @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
  @Delete('/:id')
  delete(@Param('id') id: string): Observable<any> {
    return this.blogService.deleteOne(Number(id));
  }
}
