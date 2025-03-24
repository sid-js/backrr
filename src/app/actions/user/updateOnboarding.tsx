"use server"

import { OnboardingFormInputs } from "@/app/onboarding/page";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";

export async function updateOnboarding(data: OnboardingFormInputs) {
    const role = data.sponsorshipRole;
    const industry = data.industry;
    const totalAudience = data.totalAudience || 0;
    const socialLinks = data.socialLinks || [];
    
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session) {
        return {
            error: "Unauthorized",
        }
    }
    if (!role || !industry) {
        return {
            error: "Missing fields",
        }
    } else {
        try {
            const updateData: any = {
                industry: industry,
                role: role,
            };
            
            // Only update audience details if user is a creator
            if (role === 'CREATOR') {
                updateData.totalAudience = totalAudience;
                updateData.socialLinks = socialLinks;
            }
            
            const updatedUser = await prisma.user.update({
                where: {
                    id: session?.user.id,
                },
                data: updateData
            })
            return {
                updatedUser: updatedUser,
            }
        } catch (error) {
            return {
                error: error,
            }
        }
    }
}