import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Post } from "./Post";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @Column({ unique: true }) //a unique property.
  username!: string;

  @Field()
  @Column({ unique: true }) //a unique property.
  email!: string;

  //by removing the field property, it will not be query-able.
  @Column({ unique: true }) //a unique property.
  password!: string;

  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[];
}
