import { getSponsorFromId } from '@/app/actions/sponsor/getSponsorFromId'
import { prettyNumber } from '@based/pretty-number'
import { Avatar } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons'
import { Card, CardBody, CardHeader, CardSubtitle, CardTitle } from '@progress/kendo-react-layout'
import { Chip } from '@progress/kendo-react-buttons'
import { ArrowLeft, Calendar, Globe, Tag, Users } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function SponsorDetailPage({ params }: {
    params: {
        id: string
    }
}) {
    const { id } = await params
    const sponsor = await getSponsorFromId(id)

    if ('error' in sponsor) {
        console.error('Error fetching sponsor:', sponsor.error)
        redirect('/dashboard/sponsors')
    }

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '20px', width: 'fit-content' }}>
                <Link href="/dashboard/sponsors">
                    <Button style={{ display: 'flex', alignItems: 'center', gap: '8px' }} themeColor="base">
                        Back to Sponsors
                    </Button>
                </Link>
            </div>

            <Card style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                <CardHeader className="k-hbox">
                    <Avatar type="image" size="large" rounded={'full'}>
                        <img
                            alt={`${sponsor.companyName} logo`}
                            src={sponsor.logo ?? '/logo-placeholder.jpg'}
                        />
                    </Avatar>
                    <div>
                        <CardTitle style={{ fontSize: '24px' }}>{sponsor.title}</CardTitle>
                        <CardSubtitle style={{ marginTop: '0px' }}>
                            <p style={{ fontSize: '16px', color: '#666' }}>{sponsor.companyName}</p>
                        </CardSubtitle>
                    </div>
                </CardHeader>

                <CardBody style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>About this Sponsorship</h3>
                            <p style={{ lineHeight: '1.6', color: '#333' }}>{sponsor.description}</p>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>Sponsorship Details</h3>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '12px'
                            }}>
                                <div style={{
                                    padding: '12px',
                                    backgroundColor: '#f9f9f9',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Tag size={16} />
                                        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Type</span>
                                    </div>
                                    <p style={{ fontSize: '14px', margin: '0' }}>{sponsor.type}</p>
                                </div>

                                <div style={{
                                    padding: '12px',
                                    backgroundColor: '#f9f9f9',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Globe size={16} />
                                        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Industry</span>
                                    </div>
                                    <p style={{ fontSize: '14px', margin: '0' }}>{sponsor.industry}</p>
                                </div>

                                <div style={{
                                    padding: '12px',
                                    backgroundColor: '#f9f9f9',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Users size={16} />
                                        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>Target Audience</span>
                                    </div>
                                    <p style={{ fontSize: '14px', margin: '0' }}>{prettyNumber(sponsor.targetAudienceSize, 'number-short').toUpperCase()} users</p>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            padding: '24px',
                            backgroundColor: '#f0f9ff',
                            borderRadius: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '16px',
                            textAlign: 'center'
                        }}>
                            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Sponsorship Budget</h3>
                            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#0077cc' }}>
                                {prettyNumber(sponsor.budget, 'number-dollar').toUpperCase()}
                            </div>
                            <Link href={`/dashboard/sponsors/${id}/apply`} style={{ width: '100%', maxWidth: '300px' }}>
                                <Button style={{ width: '100%' }} themeColor="primary" size="large">
                                    Apply for Sponsorship
                                </Button>
                            </Link>
                        </div>

                        <div style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>
                            <p>Sponsorship created on {new Date(sponsor.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}