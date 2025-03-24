"use server"

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";

export async function getDashboardData() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  if (!session?.user) {
    return {
      error: "Unauthorized",
    }
  }

  try {
    // Get user's listings
    const listings = await prisma.sponsorListing.findMany({
      where: {
        createdBy: session.user.id as string,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3, // Get only the 3 most recent listings
    });

    // Get recent sponsors for the dashboard
    const recentSponsors = await prisma.sponsorListing.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    });

    // Get applications statistics
    const userApplications = await prisma.sponsorApplication.findMany({
      where: {
        userId: session.user.id as string,
      },
    });

    // Get applications for user's listings
    const listingIds = listings.map(listing => listing.id);
    const listingApplications = await prisma.sponsorApplication.findMany({
      where: {
        listingId: {
          in: listingIds,
        },
      },
    });

    // Calculate analytics
    const totalListings = listings.length;
    const totalApplications = listingApplications.length;
    const pendingApplications = listingApplications.filter(app => app.status === 'PENDING').length;
    const acceptedApplications = listingApplications.filter(app => app.status === 'ACCEPTED').length;

    return {
      listings,
      recentSponsors,
      analytics: {
        totalListings,
        totalApplications,
        pendingApplications,
        acceptedApplications,
      },
    }
  } catch (error: Error | any) {
    console.error("Error fetching dashboard data:", error);
    return {
      error: error.message || "Failed to fetch dashboard data",
    }
  }
}