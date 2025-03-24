'use client';

import { Typography } from '@progress/kendo-react-common';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { SponsorListing } from '@prisma/client';
import { deleteSponsorListing } from '@/app/actions/sponsor/deleteSponsorListing';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface MyListingsGridProps {
    listings: SponsorListing[];
    error?: string;
}

function ActionCell(props: any) {
    const { dataItem } = props;
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleEdit = () => {
        router.push(`/dashboard/sponsors/${dataItem.id}/edit`);
    };

    const handleDelete = async () => {
        if (isDeleting) return;
        setIsDeleting(true);
        try {
            await deleteSponsorListing(dataItem.id);
            router.refresh();
        } catch (error) {
            console.error('Failed to delete listing:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <td>
            <Button
                onClick={handleEdit}
                themeColor="info"
                style={{ marginRight: '8px' }}
            >
                Edit
            </Button>
            <Button
                onClick={handleDelete}
                themeColor="error"
                disabled={isDeleting}
            >
                {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
        </td>
    );
}

export default function MyListingsGrid({ listings, error }: MyListingsGridProps) {
    const router = useRouter();
    return (
        <div className="my-listings-container">
            <div className="header">
                <Typography.h3>My Listings</Typography.h3>
                <form action="/dashboard/sponsors/create-listing">
                    <Button type="submit" themeColor="primary">Create New Listing</Button>
                </form>
            </div>

            {error ? (
                <div className="error">{error}</div>
            ) : (
                <Grid
                    onRowClick={
                        (e: any) => {
                            const listing = e.dataItem;
                            router.push(`/dashboard/sponsors/${listing.id}`);
                        }
                    }
                    data={listings}
                    className="hover-grid"
                >
                    <GridColumn field="title" title="Title" />
                    <GridColumn field="companyName" title="Company" />
                    <GridColumn field="type" title="Type" />
                    <GridColumn field="budget" title="Budget" />
                </Grid>
            )}

            <style jsx>{`
                .my-listings-container {
                    padding: 20px;
                }

                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .error {
                    color: #f44336;
                    margin: 16px 0;
                }

                :global(.hover-grid tbody tr) {
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                }

                :global(.hover-grid tbody tr:hover) {
                    background-color: rgba(0, 0, 0, 0.04);
                }
            `}</style>
        </div>
    );
}