import { getSponsors } from "@/app/actions/sponsor/getSponsors";
import SponsorListingCard from "@/components/SponsorListingCard";
import { Button } from '@progress/kendo-react-buttons';
import { GridLayout } from '@progress/kendo-react-layout';
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SponsorsPage() {
    const { sponsors, error } = await getSponsors();
    if (error) {
        return notFound();
    }
    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <h1>Discover Sponsors</h1>
                <Link href="/sponsors/create-listing">
                    <Button themeColor="primary">
                        Become a Sponsor
                    </Button>
                </Link>
            </div>
            {sponsors && sponsors.length > 0 && (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                        gap: '24px',
                    }}
                >
                    {
                        sponsors.map((sponsor) => (
                            <SponsorListingCard
                                key={sponsor.id}
                                sponsorListing={sponsor}
                            />
                        ))
                    }
                </div>
            )}
        </div>
    );
}