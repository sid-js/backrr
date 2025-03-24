'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TabStrip, TabStripTab } from '@progress/kendo-react-all';
import { Button, Card } from '@progress/kendo-react-all';
import Link from 'next/link';
import ApplicationsTab from './ApplicationsTab';
import EditListingTab from './EditListingTab';


export default function SponsorAdminPage({ params }: {
    params: {
        id: string
    }
}) {
    const { id } = params;
    const [selected, setSelected] = useState<number>(0);
    const router = useRouter();

    const handleTabSelect = (e: any) => {
        setSelected(e.selected);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '20px', width: 'fit-content' }}>
                <Link href={`/dashboard/sponsors/${id}`}>
                    <Button style={{ display: 'flex', alignItems: 'center', gap: '8px' }} themeColor="base">
                        <span>
                            Back to Listing
                        </span>
                    </Button>
                </Link>
            </div>

            <Card style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', padding: '20px' }}>
                <h2 style={{ marginBottom: '20px' }}>Listing Administration</h2>
                
                <TabStrip selected={selected} onSelect={handleTabSelect}>
                    <TabStripTab title="Applications">
                        <ApplicationsTab listingId={id} />
                    </TabStripTab>
                    <TabStripTab title="Edit Listing">
                        <EditListingTab listingId={id} />
                    </TabStripTab>
                </TabStrip>
            </Card>
        </div>
    );
}