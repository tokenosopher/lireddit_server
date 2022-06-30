import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "../types";

@Resolver()
export class PostResolver {
  //the way you tell graphql what type of array you want to return is by writing what it is in the brackets - like posts below.
  //here you need to set the graphql typescript type, and the typescript type....there's a little bit of duplication, but it is what it is.
  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return Post.find();
  }

  @Query(() => Post, { nullable: true }) //in typegraph you can't do the vertical pipe for the null, you can do an object with with the nullable property.
  post(@Arg("id") id: number): Promise<Post | null> {
    return Post.findOne({ where: { id } });
  }

  @Mutation(() => Post)
  async createPost(@Arg("title", () => String) title: string): Promise<Post> {
    //runs 2 sql queries, one to get the user, and one to create the post
    return Post.create({ title }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("title", () => String, { nullable: true }) title: string
  ): Promise<Post | null> {
    const post = await Post.findOne({ where: { id } });
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      await Post.update({ id }, { title });
    }
    return post;
  }

  @Mutation(() => Boolean) //this typescript type needs to match the what's in the Promise type.
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { }: MyContext
  ): Promise<boolean> {
    await Post.delete({ id });
    return true;
  }
}
