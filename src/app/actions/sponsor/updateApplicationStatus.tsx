"use server"

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ApplicationStatus } from "@prisma/client";
import { headers } from "next/headers";

export async function updateApplicationStatus(applicationId: string, status: ApplicationStatus) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    
    if (!session?.user) {
        return {
            error: "Unauthorized",
        }
    }

    // Validate status
    if (!['ACCEPTED', 'REJECTED', 'PENDING'].includes(status)) {
        return {
            error: "Invalid status",
        }
    }

    try {
        // Get the application
        const application = await prisma.sponsorApplication.findUnique({
            where: { id: applicationId },
            include: {
                listing: {
                    select: {
                        createdBy: true
                    }
                }
            }
        });

        if (!application) {
            return {
                error: "Application not found",
            }
        }

        // Verify the user is the owner of the listing
        if (application.listing.createdBy !== session.user.id) {
            return {
                error: "Unauthorized",
            }
        }

        // Update the application status
        const updatedApplication = await prisma.sponsorApplication.update({
            where: { id: applicationId },
            data: {
                status
            }
        });

        return {
            application: updatedApplication,
        }
    } catch (error: Error | any) {
        console.error("Error updating application status:", error);
        return {
            error: error.message || "Failed to update application status",
        }
    }
}