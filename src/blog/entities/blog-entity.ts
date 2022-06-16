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

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  body: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  created: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updated: Date;

  @BeforeInsert()
  updateTimestamp() {
    this.updated = new Date();
  }

  @Column({ default: 0, nullable: true })
  like: string;

  @Column({ nullable: true })
  headerImage: string;

  @Column({ nullable: true })
  publishedDate: Date;

  @Column({ nullable: true })
  isPublished: boolean;

  @ManyToOne((type) => UserEntity, (user) => user.blogs)
  author: UserEntity;
}
