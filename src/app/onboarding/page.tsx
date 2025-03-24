"use client"
import Image from 'next/image'
import styles from './styles.module.css'
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { Button, Input, Stepper, DropDownList, RadioGroup, Label, StepperChangeEvent, NumericTextBox } from '@progress/kendo-react-all'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { getSocialIcon } from '../../components/SocialIcons'
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';
import { Fade } from '@progress/kendo-react-animation';
import { Role } from '@prisma/client'
import { updateOnboarding } from '../actions/user/updateOnboarding'
import { xIcon } from '@progress/kendo-svg-icons'

export interface OnboardingFormInputs {
    industry: string
    sponsorshipRole: Role
    totalAudience?: number
    socialLinks?: string[]
}

const steps = [
    { label: 'Select Role' },
    { label: 'Choose Industry' },
    { label: 'Audience Details' },
];

const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Entertainment',
    'Manufacturing',
    'Retail',
    'Other'
];

const sponsorshipRoles = [
    { label: 'Looking to Sponsor', value: Role.SPONSOR },
    { label: 'Seeking Sponsorship', value: Role.CREATOR },
];

const socialPlatforms = [
    { name: 'twitter', label: 'Twitter/X', prefix: 'https://twitter.com/' },
    { name: 'instagram', label: 'Instagram', prefix: 'https://instagram.com/' },
    { name: 'youtube', label: 'YouTube', prefix: 'https://youtube.com/' },
    { name: 'linkedin', label: 'LinkedIn', prefix: 'https://linkedin.com/in/' },
    { name: 'tiktok', label: 'TikTok', prefix: 'https://tiktok.com/@' },
];

export default function OnboardingPage() {
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false);
    const [step, setStep] = useState<number>(0)
    const [error, setError] = useState<string | null>(null)
    const [socialLinks, setSocialLinks] = useState<string[]>([])
    const [socialPlatform, setSocialPlatform] = useState<string>('twitter')
    const [username, setUsername] = useState<string>('')

    const { control, handleSubmit, watch, setValue } = useForm<OnboardingFormInputs>({
        defaultValues: {
            industry: industries[0],
            sponsorshipRole: sponsorshipRoles[0].value,
            totalAudience: 5000,
            socialLinks: []
        }
    })

    const onSubmit: SubmitHandler<OnboardingFormInputs> = async (data) => {
        if (step < steps.length - 1) {
            // Skip audience details step if user is a sponsor
            if (step === 1 && data.sponsorshipRole === Role.SPONSOR) {
                setStep(step + 2)
            } else {
                setStep(step + 1)
            }
            return
        }
        setLoading(true)
        try {
            const response = await updateOnboarding(data);
            if (response.error) {
                setError(response.error as string)
            } else {
                router.push('/dashboard')
            }
        } catch (error) {
            setError('Something went wrong')
        }
    }
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.logo}>
                    <Image src="/backrr-logo.svg" width={150} height={40} alt="logo" />
                </div>

                <Stepper linear={true} value={step} items={steps} style={{
                    width: '100%',
                }} onChange={(e: StepperChangeEvent) => {
                    setStep(e.value)
                }} />
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    {step === 0 && (
                        <div style={{ marginBottom: '1rem', width: '100%' }}>
                            <h2 style={{
                                textAlign: 'center',
                            }}>What are you looking for?</h2>
                            <RadioGroup
                                data={sponsorshipRoles}
                                layout="vertical"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem',
                                }}

                                value={watch('sponsorshipRole')}
                                onChange={
                                    (e) => {
                                        setValue('sponsorshipRole', e.value)
                                    }
                                }
                            />
                        </div>
                    )}
                    {step === 1 && (
                        <div style={{ marginBottom: '1rem', width: '100%' }}>
                            <h2 style={{
                                textAlign: 'center',
                            }}>Select your Industry</h2>
                            <Controller
                                name="industry"
                                control={control}
                                render={({ field }) => (
                                    <DropDownList
                                        {...field}
                                        data={industries}
                                        style={{ width: '100%' }}
                                    />
                                )}
                            />
                        </div>
                    )}
                    {step === 2 && watch('sponsorshipRole') === Role.CREATOR && (
                        <div style={{ marginBottom: '1rem', width: '100%' }}>
                            <h2 style={{
                                textAlign: 'center',
                            }}>Your Audience Details</h2>

                            <div style={{ marginBottom: '1rem' }}>
                                <Label>Total Audience Reach</Label>
                                <Controller
                                    name="totalAudience"
                                    control={control}
                                    render={({ field }) => (
                                        <NumericTextBox
                                            {...field}
                                            placeholder="Enter your total audience size"
                                            style={{ width: '100%' }}
                                            min={0}
                                            step={1000}
                                            format="n0"
                                        />
                                    )}
                                />
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <Label>Social Media Links</Label>
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <DropDownList
                                        data={socialPlatforms}
                                        textField="label"
                                        dataItemKey="name"
                                        value={socialPlatforms.find(p => p.name === socialPlatform)}
                                        onChange={(e) => setSocialPlatform(e.value.name)}
                                        style={{ width: '40%' }}
                                    />
                                    <Input
                                        value={username}
                                        onChange={(e) => setUsername(e.value)}
                                        placeholder={`Enter your ${socialPlatforms.find(p => p.name === socialPlatform)?.label} username`}
                                        style={{ width: '60%' }}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    themeColor="secondary"
                                    style={{ marginBottom: '1rem' }}
                                    disabled={!username}
                                    onClick={() => {
                                        const platform = socialPlatforms.find(p => p.name === socialPlatform);
                                        if (platform && username) {
                                            const newLink = platform.prefix + username;
                                            const updatedLinks = [...socialLinks, newLink];
                                            setSocialLinks(updatedLinks);
                                            setValue('socialLinks', updatedLinks);
                                            setUsername('');
                                        }
                                    }}
                                >
                                    Add Social Link
                                </Button>

                                {socialLinks.length > 0 && (
                                    <div className={styles.socialLinksContainer}>
                                        {socialLinks.map((link, index) => {
                                            const platform = socialPlatforms.find(p => link.includes(p.prefix));
                                            return (
                                                <div key={index} className={styles.socialLinkItem}>
                                                    {getSocialIcon(link)}
                                                    <span>{link}</span>
                                                    <Button
                                                        svgIcon={xIcon}
                                                        themeColor="error"
                                                        size="small"
                                                        type='button'
                                                        onClick={() => {
                                                            const updatedLinks = socialLinks.filter((_, i) => i !== index);
                                                            setSocialLinks(updatedLinks);
                                                            setValue('socialLinks', updatedLinks);
                                                        }}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <Button
                        themeColor={'primary'}
                        type="submit"
                        style={{ width: '100%' }}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : step === steps.length - 1 ? 'Complete' : 'Next'}
                    </Button>
                </form>
            </div>
            <NotificationGroup
                style={{
                    right: 0,
                    bottom: 0,
                    alignItems: 'flex-start',
                    flexWrap: 'wrap-reverse'
                }}
            >
                <Fade>
                    {error && (
                        <Notification type={{ style: 'error', icon: true }} closable={true}>
                            <span>{error}</span>
                        </Notification>
                    )}
                </Fade>
            </NotificationGroup>
        </div>
    )
}