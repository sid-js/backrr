"use server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SponsorApplicationFormInputs, sponsorApplicationSchema } from "@/lib/schema/sponsor-application-schema";
import { headers } from "next/headers";

export async function createSponsorApplication(data: SponsorApplicationFormInputs) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    const parsedData = await sponsorApplicationSchema.safeParseAsync(data);
    if (parsedData.error) {
        return { error: parsedData.error };
    }

    try {
        const newApplication = await prisma.sponsorApplication.create({
            data: {
                ...parsedData.data,
                userId: session?.user.id as string,
            }
        })
    } catch (error) {
        return { error: error }; 
    }
}