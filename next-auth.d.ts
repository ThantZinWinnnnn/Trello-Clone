import { DefaultSession,DefaultUser } from "next-auth";

declare module "next-auth" {
    interface Session{
        user:{
            id?: string | null | undefined;
            name?: string | null | undefined;
            email?: string | null | undefined;
            emailVerified?:  Date | null | undefined;
            image?: string | null | undefined;
        } & DefaultSession["user"]
    }
    interface User extends DefaultUser{
        id?: string | null | undefined;
        emailVerified?: string | null | undefined;
    }
}