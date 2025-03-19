import { getSponsors } from "@/app/actions/sponsor/getSponsors";
import SponsorListingCard from "@/components/SponsorListingCard";
import { Button, GridLayout } from "@progress/kendo-react-all";
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
                <Button themeColor="primary">
                    Become a Sponsor
                </Button>
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