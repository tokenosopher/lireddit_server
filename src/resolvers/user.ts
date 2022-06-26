import {Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver} from 'type-graphql'
import argon2 from 'argon2'
import {MyContext} from 'src/types'
import {User} from '../entities/User'
import {COOKIE_NAME} from '../constants'
import { UsernamePasswordInput } from './usernamePasswordInput'
import { validateRegister } from '../util/validateRegister'


@ObjectType()
class FieldError {
    @Field()
    field: string

    @Field()
    message: string
}


//object types you can return, whereas input types like the ones above you use as arguments.
@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]

    @Field(() => User, {nullable: true})
    user?: User
}

@Resolver()
export class UserResolver {
    @Query(()=> User, {nullable: true})
    async me(@Ctx() {req, em}: MyContext) {
        const session = req.session
        if (!session.userId) {
            return null
        }

        const user = await em.findOne(User, session.userId)
        return user;
    }




    //the way you tell graphql what type of array you want to return is by writing what it is in the brackets - like posts below.
    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {em, req}: MyContext
    ): Promise<UserResponse> {

        const response = validateRegister(options)
        if (response) {
            return response;
        }
        

        const hashedPassword = await argon2.hash(options.password)
        const user = em.create(User, {username: options.username, email: options.email, password: hashedPassword})
        try {
            await em.persistAndFlush(user)
        } catch (err) {
            if (err.code === '23505') {
                return {
                    errors: [{
                        field: 'username',
                        message: 'username already taken'
                    }]
                }
            }
        }

        //store user id session
        //this is going to set the cookie on the user
        //and keep them login
        //login successful
        req.session!.userId = user.id

        return { user};
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('usernameOrEmail') usernameOrEmail: string,
        @Arg('password') password: string,
        @Ctx() {em, req}: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, usernameOrEmail.includes('@')
            ? {email: usernameOrEmail}
            : {username: usernameOrEmail})
        if (!user) {
            return {
                errors: [{
                    field: 'username',
                    message: 'that username does not exist'
                }
            ]
            }
        }
        const valid = await argon2.verify(user.password, password)
        if (!valid) {
            return {
                errors: [{
                    field: 'password',
                    message: 'incorrect password'
                }]
            }
        }

        //login successful
        req.session!.userId = user.id

        return {user};
    }

    //
    @Mutation(() => Boolean)
    logout(@Ctx() {req, res}: MyContext) {
        return new Promise ((resolve) => {
            req.session.destroy(err => {
                //this clears the cookie
                res.clearCookie(COOKIE_NAME)
                if (err) {
                    console.log(err)
                    resolve(false)
                    return
                }
                resolve(true)
            })
        })
    }
}