'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SponsorApplicationFormInputs, sponsorApplicationSchema } from '@/lib/schema/sponsor-application-schema';
import { Input, TextArea } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { Error } from '@progress/kendo-react-labels';
import ProfilePreviewCard from './ProfilePreviewCard';
import { User } from '@prisma/client';
import { generateApplicationNote } from '@/app/actions/sponsor/generateApplicationNote';
import { sparklesIcon } from '@progress/kendo-svg-icons';
import { createSponsorApplication } from '@/app/actions/sponsor/createSponsorApplication';
import { useRouter } from 'next/navigation';
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';
import { Fade } from '@progress/kendo-react-animation';

interface SponsorApplicationFormProps {
    listingId: string;
    user: User;
}



export default function SponsorApplicationForm({
    listingId,
    user,
}: SponsorApplicationFormProps) {
    const [profileLoading, setProfileLoading] = useState<boolean>(false);
    const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);

    const router = useRouter();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset
    } = useForm<SponsorApplicationFormInputs>({
        resolver: zodResolver(sponsorApplicationSchema),
        defaultValues: {
            listingId,
            note: '',
        }
    });


    const submitForm = async (data: SponsorApplicationFormInputs) => {
        setFormSubmitting(true);
        const response = await createSponsorApplication(data);
        if (response?.error) {
            setError(response.error as string ?? 'Failed to create sponsor application');
            setFormSubmitting(false);
        } else {
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                router.push('/sponsor/applications');
            }, 3000);
        }
    };

    const handleGenerateNote = async () => {
        setIsGenerating(true);
        try {
            const result = await generateApplicationNote({ listingId });

            if ('error' in result) {
                setError(result.error);
            } else {
                // Update the form with the generated note
                reset({ listingId, note: result.content });
            }
        } catch (err) {
            setError('Failed to generate application note');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="sponsor-application-form">
            <h2>Apply for Sponsorship</h2>

            {profileLoading ? (
                <div className="loading-profile">Loading your profile...</div>
            ) : error ? (
                <div className="error-profile">Error loading profile: {error}</div>
            ) : user ? (
                <ProfilePreviewCard user={user} />
            ) : null}

            <form onSubmit={handleSubmit(submitForm)}>
                <div className="form-group">
                    <div className="note-header">
                        <label htmlFor="note">Application Note</label>
                        <Button
                            type="button"
                            onClick={handleGenerateNote}
                            disabled={isGenerating || formSubmitting}
                            themeColor="info"
                            className="ai-generate-button"
                            svgIcon={sparklesIcon}
                        >
                            {isGenerating ? 'Generating...' : 'AI Generate'}
                        </Button>
                    </div>
                    <Controller
                        name="note"
                        control={control}
                        render={({ field }) => (
                            <TextArea
                                rows={4}
                                {...field}
                            />
                        )}
                    />
                    {errors.note && (
                        <Error>{errors.note.message}</Error>
                    )}
                </div>

                <div className="form-actions">
                    <Button
                        type="submit"
                        disabled={formSubmitting}
                        themeColor={'primary'}
                    >
                        {formSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                </div>
            </form>

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
                            <span>Application submitted successfully!</span>
                        </Notification>
                    )}
                </Fade>
            </NotificationGroup>

            <style jsx>{`
        .sponsor-application-form {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        h2 {
          margin-bottom: 20px;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .note-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 5px;
        }
        
        label {
          display: block;
          font-weight: 500;
        }
        
        .ai-generate-button {
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .form-actions {
          margin-top: 30px;
          display: flex;
          justify-content: flex-end;
        }
      `}</style>
        </div>
    );
}