/* eslint-disable @typescript-eslint/no-var-requires */
import { switchMap } from 'rxjs/operators';
import { Injectable } from '@nestjs/common';
import { Observable, of, from } from 'rxjs';
import { User } from 'src/user/models/user.interface';
import { Blog } from 'src/blog/dtos/blog-interface';
import { BlogEntity } from './entities/blog-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/models/user.entity';
import { Repository } from 'typeorm';
const slugify = require('slugify');

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>, // private userService: UserService,
  ) {}

  create(user: User, blog: Blog): Observable<Blog> {
    blog.author = user;
    console.log(blog);
    return this.generateSlug(blog.title).pipe(
      switchMap((slug: string) => {
        blog.slug = slug;
        return from(this.blogRepository.save(blog));
      }),
    );
  }

  findAll(): Observable<Blog[]> {
    return from(this.blogRepository.find({ relations: ['author'] }));
  }

  findByUser(userId: number): Observable<Blog[]> {
    return from(
      this.blogRepository.find({
        where: {
          author: userId,
        },
        relations: ['author'],
      }),
    );
  }

  findOne(id: number): Observable<Blog> {
    return from(this.blogRepository.findOne(id, { relations: ['author'] }));
  }

  generateSlug(title: string): Observable<string> {
    return of(slugify(title));
  }
}
