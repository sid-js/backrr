"use server"

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";

export async function getSponsorApplications(listingId: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    
    if (!session?.user) {
        return {
            error: "Unauthorized",
        }
    }

    try {
        // Verify the user is the owner of the listing
        const listing = await prisma.sponsorListing.findUnique({
            where: { id: listingId },
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

        // Fetch applications with user data
        const applications = await prisma.sponsorApplication.findMany({
            where: { listingId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        totalAudience: true,
                        socialLinks: true,
                        industry: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return {
            applications,
        }
    } catch (error: Error | any) {
        console.error("Error fetching applications:", error);
        return {
            error: error.message || "Failed to fetch applications",
        }
    }
}