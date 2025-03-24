'use client';

import { User } from '@prisma/client';
import { Avatar } from '@progress/kendo-react-layout';
import { Card, CardHeader, CardBody, CardTitle, CardSubtitle } from '@progress/kendo-react-layout';
import { Chip } from '@progress/kendo-react-buttons';
import { prettyNumber } from '@based/pretty-number';
import { getSocialIcon } from './SocialIcons';

interface ProfilePreviewCardProps {
  user: User;
}


const getSocialName = (url: string): string => {
  if (url.includes('twitter.com') || url.includes('x.com')) {
    return 'Twitter/X';
  } else if (url.includes('instagram.com')) {
    return 'Instagram';
  } else if (url.includes('youtube.com')) {
    return 'YouTube';
  } else if (url.includes('tiktok.com')) {
    return 'TikTok';
  } else if (url.includes('linkedin.com')) {
    return 'LinkedIn';
  } else {
    try {
      const url_obj = new URL(url);
      return url_obj.hostname.replace('www.', '');
    } catch {
      return 'Website';
    }
  }
};

export default function ProfilePreviewCard({ user }: ProfilePreviewCardProps) {
  return (
    <div className="profile-preview-card">
      <Card>
        <CardHeader className="k-hbox">
          <Avatar type="image" size="medium" rounded={'full'}>
            <img
              alt="Profile Picture"
              src={user.image ?? '/user-placeholder.jpg'}

            />
          </Avatar>
          <div className="profile-info-container">
            <CardTitle>{user.name}</CardTitle>
            <div className="profile-meta">
              <span className="industry-label">{user.industry || 'Creator'}</span>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <Chip
            text={`Audience: ${prettyNumber(user.totalAudience, "number-short").toUpperCase()}`}
            value={user.totalAudience}
            themeColor={"info"}
          />
          {user.socialLinks && user.socialLinks.length > 0 && (
            <div className="social-links-compact">
              <div className="social-links-container-compact">
                {user.socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link-item"
                  >
                    {getSocialIcon(link, { size: 16 })}
                  </a>
                ))}
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      <style jsx>{`
        .profile-preview-card {
          margin-bottom: 30px;
        }
        
        .profile-info-container {
          margin-left: 10px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .profile-meta {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .industry-label, .separator {
          font-size: 0.85rem;
          color: #555;
        }
        
        .social-links-compact {
          margin-top: 10px;
        }
        
        .social-links-container-compact {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .social-link-item {
          text-decoration: none;
          color: #4a6bbd;
        }
        
        .profile-notice-compact {
          margin-top: 12px;
          padding: 12px 15px;
          background-color: #f0f7ff;
          border-radius: 6px;
          border-left: 3px solid #4a6bbd;
        }
        
        .profile-notice-compact p {
          margin: 0;
          font-size: 14px;
          line-height: 1.5;
          color: #555;
        }
      `}</style>
    </div>
  );
}