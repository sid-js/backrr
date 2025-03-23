"use server"

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";

export async function getCurrentUser() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    
    if (!session) {
        return {
            error: "Unauthorized",
        }
    }
    
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: session.user.id,
            }
        });
        
        return {
            user: user,
        }
    } catch (error) {
        return {
            error: error,
        }
    }
}