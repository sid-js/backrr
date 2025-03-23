
import { getSponsorFromId } from '@/app/actions/sponsor/getSponsorFromId'
import SponsorApplicationForm from '@/components/SponsorApplicationForm'
import React from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/app/actions/user/getCurrentUser'

export default async function SponsorApplicationPage({ params }: {
    params: {
        id: string
    }
}) {
    const { id } = await params
    const sponsor = await getSponsorFromId(id)
    const user = await getCurrentUser()
    if (!user.user || user.error) {
        return redirect('/login') 
    }

    if ('error' in sponsor) {
        console.error('Error fetching sponsor:', sponsor.error)
        return redirect('/dashboard/sponsors')
    }
    
    return (
        <div style={{ padding: '20px' }}>
            <SponsorApplicationForm
                listingId={id}
                user={user.user}
            />
        </div>
    )
}
