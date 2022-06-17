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
import { Blog } from './dtos/blog-interface';
import { diskStorage } from 'multer';
import { Observable, of } from 'rxjs';
import { BlogService } from './blog.service';
import { JwtAuthGuard } from '../auth/guards/jwt-guard';
import { UserIsAuthorGuard } from './guard/user-is-author-guard';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { FileInterceptor } from '@nestjs/platform-express';
import { Image } from './dtos/image-dto';
import { join } from 'path';

export const BLOG_URL = 'http://localhost:3000/blog';

export const storage = {
  storage: diskStorage({
    destination: './uploads/blog-images',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('blogs')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() blog: Blog, @Request() req): Observable<Blog> {
    const user = req.user;
    return this.blogService.create(user, blog);
  }

  //   @Get()
  //   findBlog(@Query('userId') userId: number): Observable<Blog[]> {
  //     if (userId == null) {
  //       return this.blogService.findAll();
  //     } else {
  //       return this.blogService.findByUser(userId);
  //     }
  //   }

  @Get('')
  index(@Query('page') page = 1, @Query('limit') limit = 20) {
    limit = limit > 100 ? 100 : limit;

    return this.blogService.paginateAll({
      limit: Number(limit),
      page: Number(page),
      route: BLOG_URL,
    });
  }

  @Get('user/:user')
  indexByUser(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Param('user') userId: number,
  ) {
    limit = limit > 100 ? 100 : limit;

    return this.blogService.paginateByUser(
      {
        limit: Number(limit),
        page: Number(page),
        route: BLOG_URL,
      },
      userId,
    );
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

  @UseGuards(JwtAuthGuard)
  @Post('image/upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(@UploadedFile() file): Observable<Image> {
    return of(file);
  }

  @Get('blog-image/:imagename')
  findImage(@Param('imagename') imagename, @Res() res): Observable<Image> {
    return of(
      res.sendFile(join(process.cwd(), 'uploads/blog-images/' + imagename)),
    );
  }
}
