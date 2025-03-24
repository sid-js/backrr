import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { ApplicationStatus } from '@prisma/client';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { status } = await request.json();
    
    // Validate status
    if (!['ACCEPTED', 'REJECTED', 'PENDING'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Get the application
    const application = await prisma.sponsorApplication.findUnique({
      where: { id },
      include: {
        listing: {
          select: {
            createdBy: true
          }
        }
      }
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Verify the user is the owner of the listing
    if (application.listing.createdBy !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update the application status
    const updatedApplication = await prisma.sponsorApplication.update({
      where: { id },
      data: {
        status: status as ApplicationStatus
      }
    });

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error('Error updating application status:', error);
    return NextResponse.json({ error: 'Failed to update application status' }, { status: 500 });
  }
}