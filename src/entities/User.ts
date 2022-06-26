import { Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import {Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
    [OptionalProps]?: 'updatedAt' | 'createdAt';

    @Field(() => Int)
    @PrimaryKey()
    id!: number;

    @Field(() => String)
    @Property({type: "date"})
    createdAt = new Date();

    @Field(() => String)
    @Property({ type: "date", onUpdate: () => new Date() })
    updatedAt = new Date();

    @Field()
    @Property({type: "text", unique: true}) //a unique property.
    username!: string;

    @Field()
    @Property({type: "text", unique: true}) //a unique property.
    email!: string;

    //by removing the field property, it will not be query-able.
    @Property({type: "text"}) //a unique property.
    password!: string;
}