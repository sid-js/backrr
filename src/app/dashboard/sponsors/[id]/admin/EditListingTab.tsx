'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SponsorListingFormInputs, sponsorListingSchema } from '@/lib/schema/create-sponsor-schema';
import { Input, TextArea, NumericTextBox } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Button } from '@progress/kendo-react-buttons';
import { Label } from '@progress/kendo-react-labels';
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';
import { Fade } from '@progress/kendo-react-animation';
import { useRouter } from 'next/navigation';

interface EditListingTabProps {
  listingId: string;
}

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

export default function EditListingTab({ listingId }: EditListingTabProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<SponsorListingFormInputs>({
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

  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        const response = await fetch(`/api/sponsors/${listingId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch listing details');
        }
        const data = await response.json();
        
        // Reset form with fetched data
        reset({
          title: data.title,
          companyName: data.companyName,
          description: data.description || '',
          type: data.type,
          budget: data.budget,
          targetAudienceSize: data.targetAudienceSize,
          industry: data.industry,
          // logo is handled separately
        });
      } catch (err) {
        setError('Failed to load listing details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchListingDetails();
  }, [listingId, reset]);

  const onSubmit = async (data: SponsorListingFormInputs) => {
    setSubmitting(true);
    try {
      const response = await fetch(`/api/sponsors/${listingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update listing');
      }

      setSuccess('Listing updated successfully!');
      setTimeout(() => setSuccess(null), 5000);
      router.refresh();
    } catch (err) {
      setError('Failed to update listing. Please try again.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading listing details...</div>;
  }

  return (
    <div style={{ padding: '20px 0' }}>
      <h3 style={{ marginBottom: '20px' }}>Edit Listing Details</h3>

      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '800px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <div>
                <Label>Listing Title</Label>
                <Input
                  {...field}
                  style={{ width: '100%' }}
                />
                {errors.title && (
                  <div style={{ color: '#f44336', fontSize: '14px', marginTop: '4px' }}>
                    {errors.title.message}
                  </div>
                )}
              </div>
            )}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Controller
            name="companyName"
            control={control}
            render={({ field }) => (
              <div>
                <Label>Company Name</Label>
                <Input
                  {...field}
                  style={{ width: '100%' }}
                />
                {errors.companyName && (
                  <div style={{ color: '#f44336', fontSize: '14px', marginTop: '4px' }}>
                    {errors.companyName.message}
                  </div>
                )}
              </div>
            )}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
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
                  <div style={{ color: '#f44336', fontSize: '14px', marginTop: '4px' }}>
                    {errors.description.message}
                  </div>
                )}
              </div>
            )}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <div>
                <Label>Sponsorship Type</Label>
                <DropDownList
                  {...field}
                  data={sponsorshipTypes}
                  style={{ width: '100%' }}
                />
                {errors.type && (
                  <div style={{ color: '#f44336', fontSize: '14px', marginTop: '4px' }}>
                    {errors.type.message}
                  </div>
                )}
              </div>
            )}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Controller
            name="budget"
            control={control}
            render={({ field }) => (
              <div>
                <Label>Budget</Label>
                <NumericTextBox
                  {...field}
                  format="c0"
                  min={1}
                  style={{ width: '100%' }}
                />
                {errors.budget && (
                  <div style={{ color: '#f44336', fontSize: '14px', marginTop: '4px' }}>
                    {errors.budget.message}
                  </div>
                )}
              </div>
            )}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Controller
            name="targetAudienceSize"
            control={control}
            render={({ field }) => (
              <div>
                <Label>Target Audience Size</Label>
                <NumericTextBox
                  {...field}
                  format="n0"
                  min={1}
                  style={{ width: '100%' }}
                />
                {errors.targetAudienceSize && (
                  <div style={{ color: '#f44336', fontSize: '14px', marginTop: '4px' }}>
                    {errors.targetAudienceSize.message}
                  </div>
                )}
              </div>
            )}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Controller
            name="industry"
            control={control}
            render={({ field }) => (
              <div>
                <Label>Industry</Label>
                <DropDownList
                  {...field}
                  data={industries}
                  style={{ width: '100%' }}
                />
                {errors.industry && (
                  <div style={{ color: '#f44336', fontSize: '14px', marginTop: '4px' }}>
                    {errors.industry.message}
                  </div>
                )}
              </div>
            )}
          />
        </div>

        <div style={{ marginTop: '30px' }}>
          <Button
            type="submit"
            themeColor="primary"
            disabled={submitting}
          >
            {submitting ? 'Saving Changes...' : 'Save Changes'}
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
            <Notification type={{ style: 'success', icon: true }} closable={true} onClose={() => setSuccess(null)}>
              <span>{success}</span>
            </Notification>
          )}
        </Fade>
      </NotificationGroup>
    </div>
  );
}