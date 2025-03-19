import { prisma } from "@/lib/db"

export async function getSponsors() {
    try {
        const sponsors = await prisma.sponsorListing.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return {
            sponsors,
        }
    } catch (error: Error | any) {
        return {
            error: error.message,
        }
    }
}