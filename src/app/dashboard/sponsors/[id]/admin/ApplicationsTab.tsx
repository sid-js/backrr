'use client';

import { useState, useEffect } from 'react';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { Button, Dialog, DialogActionsBar } from '@progress/kendo-react-all';
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';
import { Fade } from '@progress/kendo-react-animation';
import { useRouter } from 'next/navigation';
import { SponsorApplication, User, ApplicationStatus } from '@prisma/client';

interface ApplicationWithUser extends SponsorApplication {
  user: User;
}

interface ApplicationsTabProps {
  listingId: string;
}

export default function ApplicationsTab({ listingId }: ApplicationsTabProps) {
  const [applications, setApplications] = useState<ApplicationWithUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithUser | null>(null);
  const [showAcceptDialog, setShowAcceptDialog] = useState<boolean>(false);
  const [showRejectDialog, setShowRejectDialog] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  
  const router = useRouter();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(`/api/sponsors/${listingId}/applications`);
        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }
        const data = await response.json();
        setApplications(data);
      } catch (err) {
        setError('Failed to load applications. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [listingId]);

  const handleAccept = async () => {
    if (!selectedApplication) return;
    
    setActionLoading(true);
    try {
      const response = await fetch(`/api/sponsors/applications/${selectedApplication.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'ACCEPTED' }),
      });

      if (!response.ok) {
        throw new Error('Failed to update application status');
      }

      // Update local state
      setApplications(applications.map(app => 
        app.id === selectedApplication.id 
          ? { ...app, status: 'ACCEPTED' as ApplicationStatus } 
          : app
      ));
      
      setSuccess('Application accepted successfully!');
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError('Failed to accept application. Please try again.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setActionLoading(false);
      setShowAcceptDialog(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApplication) return;
    
    setActionLoading(true);
    try {
      const response = await fetch(`/api/sponsors/applications/${selectedApplication.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'REJECTED' }),
      });

      if (!response.ok) {
        throw new Error('Failed to update application status');
      }

      // Update local state
      setApplications(applications.map(app => 
        app.id === selectedApplication.id 
          ? { ...app, status: 'REJECTED' as ApplicationStatus } 
          : app
      ));
      
      setSuccess('Application rejected successfully!');
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError('Failed to reject application. Please try again.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setActionLoading(false);
      setShowRejectDialog(false);
    }
  };

  const StatusCell = (props: any) => {
    const { dataItem } = props;
    let statusColor = '';
    
    switch(dataItem.status) {
      case 'ACCEPTED':
        statusColor = '#4caf50';
        break;
      case 'REJECTED':
        statusColor = '#f44336';
        break;
      default:
        statusColor = '#ff9800';
    }
    
    return (
      <td>
        <span style={{ 
          padding: '4px 8px', 
          borderRadius: '4px', 
          backgroundColor: statusColor,
          color: 'white',
          fontWeight: 'bold',
          fontSize: '12px'
        }}>
          {dataItem.status}
        </span>
      </td>
    );
  };

  const ActionCell = (props: any) => {
    const { dataItem } = props;
    const isPending = dataItem.status === 'PENDING';
    
    return (
      <td>
        <Button
          onClick={() => {
            setSelectedApplication(dataItem);
            setShowAcceptDialog(true);
          }}
          themeColor="success"
          style={{ marginRight: '8px' }}
          disabled={!isPending}
        >
          Accept
        </Button>
        <Button
          onClick={() => {
            setSelectedApplication(dataItem);
            setShowRejectDialog(true);
          }}
          themeColor="error"
          disabled={!isPending}
        >
          Reject
        </Button>
      </td>
    );
  };

  const DateCell = (props: any) => {
    const { dataItem, field } = props;
    return (
      <td>
        {new Date(dataItem[field]).toLocaleDateString()}
      </td>
    );
  };

  return (
    <div style={{ padding: '20px 0' }}>
      <h3 style={{ marginBottom: '20px' }}>Sponsor Applications</h3>
      
      {loading ? (
        <div>Loading applications...</div>
      ) : error ? (
        <div style={{ color: '#f44336' }}>{error}</div>
      ) : applications.length === 0 ? (
        <div>No applications found for this listing.</div>
      ) : (
        <Grid data={applications}>
          <GridColumn field="user.name" title="Applicant Name" />
          <GridColumn field="user.email" title="Email" />
          <GridColumn field="note" title="Application Note" />
          <GridColumn field="createdAt" title="Applied On" cell={DateCell} />
          <GridColumn field="status" title="Status" cell={StatusCell} />
          <GridColumn title="Actions" cell={ActionCell} width="220px" />
        </Grid>
      )}

      {/* Accept Dialog */}
      {selectedApplication && showAcceptDialog && (
        <Dialog
          title="Accept Application"
          onClose={() => setShowAcceptDialog(false)}
        >
          <p>Are you sure you want to accept the application from {selectedApplication.user?.name}?</p>
          <DialogActionsBar>
            <Button
              onClick={() => setShowAcceptDialog(false)}
              themeColor="base"
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAccept}
              themeColor="success"
              disabled={actionLoading}
            >
              {actionLoading ? 'Processing...' : 'Accept'}
            </Button>
          </DialogActionsBar>
        </Dialog>
      )}
      {selectedApplication && showRejectDialog && (
        <Dialog
          title="Reject Application"
          onClose={() => setShowRejectDialog(false)}
        >
          <p>Are you sure you want to reject the application from {selectedApplication.user?.name}?</p>
          <DialogActionsBar>
            <Button
              onClick={() => setShowRejectDialog(false)}
              themeColor="base"
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              themeColor="error"
              disabled={actionLoading}
            >
              {actionLoading ? 'Processing...' : 'Reject'}
            </Button>
          </DialogActionsBar>
        </Dialog>
      )}

      {/* Notifications */}
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