import { Resolver, Query, Ctx, Arg, Int, Mutation } from 'type-graphql'
import { Post } from '../entities/Post'
import { MyContext } from '../types'

@Resolver()
export class PostResolver {
    //the way you tell graphql what type of array you want to return is by writing what it is in the brackets - like posts below.
    //here you need to set the graphql typescript type, and the typescript type....there's a little bit of duplication, but it is what it is.
    @Query(() => [Post])
    posts(@Ctx() { em }: MyContext): Promise<Post[]> {
        return em.find(Post, {});
    }

    @Query(() => Post, { nullable: true }) //in typegraph you can't do the vertical pipe for the null, you can do an object with with the nullable property.
    post(
        @Arg('id', () => Int) id: number, //this is the typescript tipe
        @Ctx() { em }: MyContext): Promise<Post | null> {
        return em.findOne(Post, { id });
    }

    @Mutation(() => Post)
    async createPost(
        @Arg('title', () => String) title: string, //this is the typescript tipe
        @Ctx() { em }: MyContext): Promise<Post> {
        const post = em.create(Post, { title });
        em.persistAndFlush(post)
        return post;
    }

    @Mutation(() => Post, { nullable: true })
    async updatePost(
        @Arg('id', () => Int) id: number,
        @Arg('title', () => String, {nullable: true}) title: string, //this is the typescript tipe
        @Ctx() { em }: MyContext): Promise<Post | null> {
        const post = await em.findOne(Post, { id });
        if (!post) {
            return null
        }
        if (typeof title !== 'undefined') {
            post.title = title;
            await em.persistAndFlush(post)
        }
        return post;
    }

    @Mutation(() => Boolean) //this typescript type needs to match the what's in the Promise type.
    async deletePost(
        @Arg('id', () => Int) id: number,
        @Ctx() { em }: MyContext): Promise<boolean> {
        await em.nativeDelete(Post, { id })
        return true
    }
}