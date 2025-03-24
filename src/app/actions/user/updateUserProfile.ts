"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";

interface UpdateUserProfileData {
  name: string;
  industry: string;
  totalAudience?: number;
  socialLinks: string[];
}

export async function updateUserProfile(data: UpdateUserProfileData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: data.name,
        industry: data.industry,
        totalAudience: data.totalAudience || 0,
        socialLinks: data.socialLinks || [],
      },
    });

    return {
      success: true,
      user: updatedUser,
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return {
      error: "Failed to update profile",
    };
  }
}