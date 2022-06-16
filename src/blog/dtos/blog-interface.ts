import { User } from 'src/user/models/user.interface';

export interface Blog {
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  body?: string;
  created?: Date;
  updated?: Date;
  like?: string;
  headerImage?: string;
  publishedDate?: Date;
  isPublished?: Date;
  author?: User;
}
