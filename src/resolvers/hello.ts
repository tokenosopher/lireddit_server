import { Resolver, Query } from 'type-graphql'

@Resolver()
export class HelloResolver {
    //the way you tell graphql what type of array you want to return is by writing what it is in the brackets - like posts below.
    @Query(() => String)
    hello() {
        return "yo"
    }
}