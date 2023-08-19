import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma";

export const OPTIONS:NextAuthOptions ={
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks:{
    async session({token,session}){ 
      console.log("token",token,"session",session)
      const user = await prisma.user.findUnique({ 
        where:{
          email:token?.email!
        }
      });
      session.user = user!;
      console.log("updatedSession",session)
      return session;
    }
  },
  pages:{
    signIn:"/login",
    newUser:"/first-signup"
  },
  session:{  
    strategy:"jwt"
  },
  secret:process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(OPTIONS);
export { handler as GET, handler as POST }