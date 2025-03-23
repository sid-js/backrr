import { z } from "zod";

export const sponsorApplicationSchema = z.object({
    listingId: z.string().min(1, { message: "Listing ID is required" }),
    note: z.string().min(1, { message: "Application Note is required" })
})

export type SponsorApplicationFormInputs = z.infer<typeof sponsorApplicationSchema>;