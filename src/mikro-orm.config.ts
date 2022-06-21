import {Post} from "./entities/Post";
import {__prod__} from "./constants";
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { User } from "./entities/User";


//typescript notes: if you export this as const, the types will be more constrained.
//more advanced method - use the Parameters decorator to specify the type of the init function, so as to make the variables of the export constrained to the init function.
export default {
    migrations: {
        path: path.join(__dirname,"./migrations"),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [Post, User],
        user: "postgres",
    password: "postgres",
    dbName: 'lireddit',
    type: 'postgresql',
    //what this means is that when we are not in production we will have debugging enabled
    debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];