import NextAuth, {AuthOptions} from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from "next-auth/providers/google";
import {MongoDBAdapter} from "@auth/mongodb-adapter";
import clientPromise from "@/database/mongo";

export const authOptions = {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!
        })
    ]
};

export const handler = NextAuth(authOptions as AuthOptions);
export { handler as GET, handler as POST }