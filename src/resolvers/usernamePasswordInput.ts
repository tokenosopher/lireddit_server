

//a different way of getting the arguments:

import {Field, InputType } from "type-graphql"

//the good thing about this is that you can reuse it across the different mutations, like how we did it here with register and login - we used the same input type.
@InputType()
export class UsernamePasswordInput {
    @Field()
    username: string
    @Field()
    email: string
    @Field()
    password: string
}