import { SponsorListing } from "@prisma/client";
import { Avatar, Button, Card, CardActions, CardBody, CardHeader, CardSubtitle, CardTitle, Chip, ChipList } from "@progress/kendo-react-all";
import { prettyNumber } from '@based/pretty-number'
import { Eye } from 'lucide-react';
import Link from "next/link";

export default function SponsorListingCard({
    sponsorListing,
}: {
    sponsorListing: SponsorListing
}) {
    return (
        <Card
            style={{
                width: '100%',
                maxWidth: 400,
                boxShadow: '0 0 4px 0 rgba(0, 0, 0, .1)',
            }}
        >
            <CardHeader className="k-hbox" style={{ background: 'transparent' }}>
                <Avatar type="image" size="medium" rounded={'full'}>
                    <img
                        style={{ width: 45, height: 45 }}
                        alt="KendoReact Card Thumbnail"
                        src={sponsorListing.logo ?? '/logo-placeholder.jpg'}
                    />
                </Avatar>
                <div>
                    <CardTitle>{sponsorListing.title}</CardTitle>
                    <CardSubtitle>
                        <p>{sponsorListing.companyName}</p>
                    </CardSubtitle>
                </div>
            </CardHeader>
            <CardBody>
                <p style={{
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 3,
                }}>{sponsorListing.description}</p>
                <div style={{
                    display: 'flex',
                    justifyContent: 'start',
                    gap: '10px',
                }}>
                    <Chip
                        text={prettyNumber(sponsorListing.budget, 'number-dollar').toUpperCase()}
                        value={sponsorListing.budget}
                        themeColor={"success"}
                    />
                    <Chip
                        text={sponsorListing.industry}
                        value={sponsorListing.industry}

                        themeColor={"base"}
                    />
                    <Chip
                        text={`${prettyNumber(sponsorListing.targetAudienceSize, "number-short").toUpperCase()}`}
                        value={sponsorListing.targetAudienceSize}

                        themeColor={"base"}
                    />
                </div>




            </CardBody>
            <CardActions>
                <Link style={{
                    width: '100%'
                }} href={`sponsors/${sponsorListing.id}/apply`}>
                    <Button style={{
                        width: '100%'
                    }} themeColor={"primary"}>
                        Apply
                    </Button>
                </Link>
                <Link style={{
                    width: "fit-content"
                }} href={`/dashboard/sponsors/${sponsorListing.id}`}>
                    <Button style={{
                        width: '100%'
                    }} themeColor={"base"}>
                        View
                    </Button>
                </Link>
            </CardActions>
        </Card>
    )
}