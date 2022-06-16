import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from 'src/blog/entities/blog-entity';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from '../auth/auth.module';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntity]), AuthModule, UserModule],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
