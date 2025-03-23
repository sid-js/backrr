import { prisma } from "@/lib/db";

export async function getSponsorFromId(id: string) {
    if (!id) {
        return {
            error: "No id provided"
        }
    }
    try {
        const sponsor = await prisma.sponsorListing.findUniqueOrThrow({
            where: {
                id: id
            }
        })
        return sponsor
    } catch (error) {
        return {
            error: error
        }
    }
}