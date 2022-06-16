import { UserEntity } from 'src/user/models/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  ManyToOne,
} from 'typeorm';

@Entity()
export class BlogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column()
  description: string;

  @Column()
  body: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;

  @BeforeInsert()
  updateTimestamp() {
    this.updated = new Date();
  }

  @Column({ default: 0 })
  like: string;

  @Column()
  headerImage: string;

  @Column()
  publishedDate: Date;

  @Column()
  isPublished: boolean;

  @ManyToOne((type) => UserEntity, (user) => user.blogs)
  author: UserEntity;
}
