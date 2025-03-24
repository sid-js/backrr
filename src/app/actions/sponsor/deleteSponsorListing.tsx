"use server"

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";

export async function deleteSponsorListing(listingId: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    
    if (!session) {
        return {
            error: "Unauthorized",
        }
    }
    
    try {
        // First verify that the listing belongs to the current user
        const listing = await prisma.sponsorListing.findFirst({
            where: {
                id: listingId,
                createdBy: session.user.id as string,
            },
        });
        
        if (!listing) {
            return {
                error: "Listing not found or you don't have permission to delete it",
            }
        }
        
        // Delete the listing
        await prisma.sponsorListing.delete({
            where: {
                id: listingId,
            },
        });
        
        return {
            success: true,
        }
    } catch (error: Error | any) {
        console.error("Error deleting sponsor listing:", error);
        return {
            error: error.message || "Failed to delete listing",
        }
    }
}