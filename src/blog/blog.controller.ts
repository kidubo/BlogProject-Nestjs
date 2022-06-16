import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Blog } from './dtos/blog-interface';
import { Observable } from 'rxjs';
import { BlogService } from './blog.service';
import { JwtAuthGuard } from '../auth/guards/jwt-guard';

@Controller('blogs')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() blog: Blog, @Request() req): Observable<Blog> {
    const user = req.user.user;
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
}
