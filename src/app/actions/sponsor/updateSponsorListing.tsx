"use server"

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SponsorListingFormInputs, sponsorListingSchema } from "@/lib/schema/create-sponsor-schema";
import { headers } from "next/headers";

export async function updateSponsorListing(id: string, data: SponsorListingFormInputs) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    
    if (!session?.user) {
        return {
            error: "Unauthorized",
        }
    }

    // Validate the data
    const parsedData = await sponsorListingSchema.safeParseAsync(data);
    if (!parsedData.success) {
        return {
            error: parsedData.error,
        }
    }

    try {
        // Verify the user is the owner of the listing
        const listing = await prisma.sponsorListing.findUnique({
            where: { id },
            select: { createdBy: true }
        });

        if (!listing) {
            return {
                error: "Listing not found",
            }
        }

        if (listing.createdBy !== session.user.id) {
            return {
                error: "Unauthorized",
            }
        }

        // Update the listing
        const updatedListing = await prisma.sponsorListing.update({
            where: { id },
            data: parsedData.data
        });

        return {
            listing: updatedListing,
        }
    } catch (error: Error | any) {
        console.error("Error updating listing:", error);
        return {
            error: error.message || "Failed to update listing",
        }
    }
}