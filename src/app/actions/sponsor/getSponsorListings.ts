import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function getSponsorListings() {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });
        if (!session?.user) {
            return { error: 'Unauthorized' };
        }

        const listings = await prisma.sponsorListing.findMany({
            where: {
                createdBy: session.user.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return { listings };
    } catch (error) {
        console.error('Error fetching sponsor listings:', error);
        return { error: 'Failed to fetch sponsor listings' };
    }
}