import { z } from "zod";

export const sponsorListingSchema = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters" }),
    companyName: z.string().min(2, { message: "Company name is required" }),
    description: z.string().min(10, { message: "Description must be at least 10 characters" }).max(500, { message: "Description must be less than 500 characters" }),
    logo: z.any().optional(),
    type: z.string().min(1, { message: "Type is required" }),
    budget: z.number().min(1, { message: "Budget must be at least 1" }),
    targetAudienceSize: z.number().min(1, { message: "Target audience size must be at least 1" }),
    industry: z.string().min(1, { message: "Industry is required" }),
});

export type SponsorListingFormInputs = z.infer<typeof sponsorListingSchema>;