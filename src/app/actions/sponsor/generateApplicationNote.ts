'use server';

import { prisma } from '@/lib/db';
import { generateText } from '@/lib/openrouter';
import { getCurrentUser } from '../user/getCurrentUser';

interface GenerateNoteParams {
  listingId: string;
}

export async function generateApplicationNote({ listingId }: GenerateNoteParams): Promise<{ content: string } | { error: string }> {
  try {
    // Get the current user
    const user = await getCurrentUser();
    if (!user || 'error' in user) {
      return { error: 'User not authenticated' };
    }
    
    // Get the sponsor listing
    const listing = await prisma.sponsorListing.findUnique({
      where: { id: listingId },
    });
    
    if (!listing) {
      return { error: 'Sponsor listing not found' };
    }
    
    // Construct a prompt for the AI
    const prompt = `
      Create a personalized sponsorship application note for the following scenario:
      
      Creator Information:
      - Name: ${user.name}
      - Industry: ${user.industry || 'Creator'}
      - Total Audience Size: ${user.totalAudience}
      - Social Platforms: ${user.socialLinks ? user.socialLinks.join(', ') : 'Not specified'}
      
      Sponsorship Information:
      - Company: ${listing.companyName}
      - Title: ${listing.title}
      - Industry: ${listing.industry}
      - Type: ${listing.type}
      - Budget: $${listing.budget}
      - Target Audience Size: ${listing.targetAudienceSize}
      - Description: ${listing.description || 'Not provided'}
      
      Write a professional, personalized application note from the creator to the sponsor. 
      The note should explain why the creator would be a good fit for this sponsorship opportunity, 
      highlighting relevant experience, audience demographics, and potential value to the sponsor. 
      Don't add any salutation or endings regards in the note.
      Keep it concise (1-2 paragraphs) and professional.
    `;
    
    // Generate the application note using OpenRouter
    const generatedNote = await generateText(prompt);
    
    return { content: generatedNote };
  } catch (error) {
    console.error('Error generating application note:', error);
    return { error: 'Failed to generate application note' };
  }
}