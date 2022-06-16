import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from 'src/blog/entities/blog-entity';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntity]), AuthModule, UserModule],
})
export class BlogModule {}
