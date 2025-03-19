"use server"

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SponsorListingFormInputs, sponsorListingSchema } from "@/lib/schema/create-sponsor-schema";
import { headers } from "next/headers";


export async function createSponsorListing(data: SponsorListingFormInputs) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session) {
        return {
            error: "Unauthorized",
        }
    }
    const parsedData = await sponsorListingSchema.safeParseAsync(data);
    if (!parsedData.success) {
        return {
            error: parsedData.error,
        }
    }

    try {
        const newListing = await prisma.sponsorListing.create({
            data: {
                ...parsedData.data,
                createdBy: session.user.id as string,
            }
        })
        return {
            data: newListing,
        }
    }
    catch (error) {
        console.log(error)
        return {
            error: "Something went wrong",
        }
    }

}