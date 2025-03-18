import { betterAuth } from "better-auth";
import { prisma } from "@/lib/db";
import { prismaAdapter } from "better-auth/adapters/prisma";
 
export const authConfig = {
    database: prismaAdapter(prisma, {
        provider: "postgresql", 
    }),
    emailAndPassword: {  
        enabled: true
    },
};
export const auth = betterAuth(authConfig);