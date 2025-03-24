"use client"
import { useState } from 'react';
import { Typography } from '@progress/kendo-react-common';
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from '@progress/kendo-react-buttons';
import { Input, NumericTextBox, TextArea } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Stepper, StepperChangeEvent } from '@progress/kendo-react-layout';
import { Label } from '@progress/kendo-react-labels';
import styles from './styles.module.css';
import { useRouter } from 'next/navigation';
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';
import { Fade } from '@progress/kendo-react-animation';
import { createSponsorListing } from '@/app/actions/sponsor/createSponsorListing';
import { SponsorListingFormInputs, sponsorListingSchema } from '@/lib/schema/create-sponsor-schema';


const steps = [
    { label: 'Basic Info' },
    { label: 'Details' },
    { label: 'Review' },
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

const sponsorshipTypes = [
    'Product Placement',
    'Brand Integration',
    'Sponsored Content',
    'Event Sponsorship',
    'Affiliate Marketing',
    'Other'
];

export default function CreateListingForm() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const { control, handleSubmit, watch, trigger, formState: { errors, touchedFields } } = useForm<SponsorListingFormInputs>({
        resolver: zodResolver(sponsorListingSchema),
        defaultValues: {
            title: '',
            companyName: '',
            description: '',
            type: sponsorshipTypes[0],
            budget: 1000,
            targetAudienceSize: 1000,
            industry: industries[0],
        }
    });

    const onSubmit: SubmitHandler<SponsorListingFormInputs> = async (data) => {
        if (currentStep < steps.length - 1) {
            // Validate current step fields before proceeding
            let isCurrentStepValid = true;

            if (currentStep === 0) {
                // Validate Basic Info step
                isCurrentStepValid = !errors.title && !errors.companyName && !errors.description;
            } else if (currentStep === 1) {
                // Validate Details step
                isCurrentStepValid = !errors.type && !errors.budget && !errors.targetAudienceSize && !errors.industry;
            }

            if (isCurrentStepValid) {
                setCurrentStep(currentStep + 1);
            } else {
                setError('Please fix the errors before proceeding to the next step.');
                setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
            }
            return;
        }

        setLoading(true);
        try {
            console.log('Form data submitted:', data);

            const response = await createSponsorListing(data);
            if (!response.error) {
                setSuccess(true);
                router.push('/dashboard/sponsors');
            } else {
                setError(response.error as string);
            }
        } catch (err) {
            setLoading(false);
            setError('Failed to create listing. Please try again.');
        }
    };

    const handleStepChange = (e: StepperChangeEvent) => {
        // Only allow going back or validate current step before proceeding
        if (e.value < currentStep) {
            setCurrentStep(e.value);
        } else if (e.value > currentStep) {
            // Validate current step fields before proceeding
            let isCurrentStepValid = true;

            if (currentStep === 0) {
                // Validate Basic Info step
                isCurrentStepValid = !errors.title && !errors.companyName && !errors.description;
            } else if (currentStep === 1) {
                // Validate Details step
                isCurrentStepValid = !errors.type && !errors.budget && !errors.targetAudienceSize && !errors.industry;
            }   

            if (isCurrentStepValid) {
                setCurrentStep(e.value);
            } else {
                setError('Please fix the errors before proceeding to the next step.');
                setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
            }
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const formValues = watch();

    return (
        <div className={styles.container}>
            <Typography.h3>Create Sponsor Listing</Typography.h3>

            <div className={styles.formContainer}>
                <div className={styles.stepperContainer}>
                    <Stepper
                        orientation="horizontal"
                        linear={true}
                        value={currentStep}
                        items={steps}
                        onChange={handleStepChange}
                    />
                </div>

                <div className={styles.formWrapper}>
                    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                        {currentStep === 0 && (
                            <>
                                <Controller
                                    name="title"
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <Input
                                                {...field}
                                                label="Listing Title"
                                                style={{ width: '100%' }}
                                            />
                                            {errors.title && (
                                                <div className={styles.error}>{errors.title.message}</div>
                                            )}
                                        </div>
                                    )}
                                />

                                <Controller
                                    name="companyName"
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <Input
                                                {...field}
                                                label="Company Name"
                                                style={{ width: '100%' }}
                                            />
                                            {errors.companyName && (
                                                <div className={styles.error}>{errors.companyName.message}</div>
                                            )}
                                        </div>
                                    )}
                                />

                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <Label>Description</Label>
                                            <TextArea
                                                {...field}
                                                style={{ width: '100%', minHeight: '100px' }}
                                            />
                                            {errors.description && (
                                                <div className={styles.error}>{errors.description.message}</div>
                                            )}
                                        </div>
                                    )}
                                />
                            </>
                        )}

                        {currentStep === 1 && (
                            <>
                                <Controller
                                    name="type"
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <DropDownList
                                                {...field}
                                                label="Sponsorship Type"
                                                data={sponsorshipTypes}
                                                style={{ width: '100%' }}
                                            />
                                            {errors.type && (
                                                <div className={styles.error}>{errors.type.message}</div>
                                            )}
                                        </div>
                                    )}
                                />

                                <Controller
                                    name="budget"
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <NumericTextBox
                                                {...field}
                                                label="Budget ($)"
                                                min={1}
                                                format="c0"
                                                step={1000}
                                                style={{ width: '100%' }}
                                            />
                                            {errors.budget && (
                                                <div className={styles.error}>{errors.budget.message}</div>
                                            )}
                                        </div>
                                    )}
                                />

                                <Controller
                                    name="targetAudienceSize"
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <NumericTextBox
                                                {...field}
                                                label="Target Audience Size"
                                                min={1}
                                                format="n0"
                                                style={{ width: '100%' }}
                                                step={1000}
                                            />
                                            {errors.targetAudienceSize && (
                                                <div className={styles.error}>{errors.targetAudienceSize.message}</div>
                                            )}
                                        </div>
                                    )}
                                />

                                <Controller
                                    name="industry"
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <DropDownList
                                                {...field}
                                                label="Industry"
                                                data={industries}
                                                style={{ width: '100%' }}
                                            />
                                            {errors.industry && (
                                                <div className={styles.error}>{errors.industry.message}</div>
                                            )}
                                        </div>
                                    )}
                                />
                            </>
                        )}

                        {currentStep === 2 && (
                            <div>
                                <Typography.h4>Review Your Listing</Typography.h4>
                                <div style={{ marginBottom: '20px' }}>
                                    <Typography.p><strong>Title:</strong> {formValues.title}</Typography.p>
                                    <Typography.p><strong>Company:</strong> {formValues.companyName}</Typography.p>
                                    <Typography.p><strong>Description:</strong> {formValues.description}</Typography.p>
                                    <Typography.p><strong>Type:</strong> {formValues.type}</Typography.p>
                                    <Typography.p><strong>Budget:</strong> ${formValues.budget}</Typography.p>
                                    <Typography.p><strong>Target Audience Size:</strong> {formValues.targetAudienceSize}</Typography.p>
                                    <Typography.p><strong>Industry:</strong> {formValues.industry}</Typography.p>
                                </div>
                            </div>
                        )}

                        <div className={styles.formActions}>
                            {currentStep > 0 && (
                                <Button
                                    onClick={handlePrevious}
                                    disabled={loading}
                                >
                                    Previous
                                </Button>
                            )}
                            <div style={{ flex: 1 }}></div>
                            <Button
                                themeColor="primary"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : currentStep === steps.length - 1 ? 'Submit' : 'Next'}
                            </Button>
                        </div>
                    </form>
                </div>
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
                        <Notification type={{ style: 'error', icon: true }} closable={true} onClose={() => setError(null)}>
                            <span>{error}</span>
                        </Notification>
                    )}
                    {success && (
                        <Notification type={{ style: 'success', icon: true }} closable={true}>
                            <span>Listing created successfully!</span>
                        </Notification>
                    )}
                </Fade>
            </NotificationGroup>
        </div>
    );
}