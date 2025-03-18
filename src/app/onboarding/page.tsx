"use client"
import Image from 'next/image'
import styles from './styles.module.css'
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { Button, Input, Stepper, DropDownList, RadioGroup, Label, StepperChangeEvent } from '@progress/kendo-react-all'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';
import { Fade } from '@progress/kendo-react-animation';
import { Role } from '@prisma/client'
import { updateOnboarding } from '../actions/user/updateOnboarding'

export interface OnboardingFormInputs {
    industry: string
    sponsorshipRole: Role
}

const steps = [
    { label: 'Select Role' },
    { label: 'Choose Industry' },
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

export default function OnboardingPage() {
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false);
    const [step, setStep] = useState<number>(0)
    const [error, setError] = useState<string | null>(null)
    const { control, handleSubmit, watch, setValue } = useForm<OnboardingFormInputs>({
        defaultValues: {
            industry: industries[0],
            sponsorshipRole: sponsorshipRoles[0].value
        }
    })

    const onSubmit: SubmitHandler<OnboardingFormInputs> = async (data) => {
        if (step < steps.length - 1) {
            setStep(step + 1)
            return
        }
        setLoading(true)
        try {
            const response = await updateOnboarding(data);
            if (response.error) {
                setError(response.error as string)
            } else {
                router.push('/')
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