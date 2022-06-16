import { Blog } from 'src/blog/dtos/blog-interface';

export interface User {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  profileImage?: string;
  blogs?: Blog[];
}

export enum UserRole {
  ADMIN = 'admin',
  CHIEF_EDITOR = 'chief_editor',
  EDITOR = 'editor',
  USER = 'user',
}
