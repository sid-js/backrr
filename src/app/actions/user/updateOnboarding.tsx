"use server"

import { OnboardingFormInputs } from "@/app/onboarding/page";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";

export async function updateOnboarding(data: OnboardingFormInputs) {
    const role = data.sponsorshipRole;
    const industry = data.industry;
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
            const updatedUser = await prisma.user.update({
                where: {
                    id: session?.user.id,
                },
                data: {
                    industry: industry,
                    role: role,
                }
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