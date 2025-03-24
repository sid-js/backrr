"use server"

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";

export async function getSponsorListings() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    
    if (!session) {
        return {
            error: "Unauthorized",
        }
    }
    
    try {
        const listings = await prisma.sponsorListing.findMany({
            where: {
                createdBy: session.user.id as string,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        
        return {
            listings,
        }
    } catch (error: Error | any) {
        console.error("Error fetching sponsor listings:", error);
        return {
            error: error.message || "Failed to fetch listings",
        }
    }
}