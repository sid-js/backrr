'use client';

import { Card, CardBody, CardTitle } from "@progress/kendo-react-all";
import { Role } from "@prisma/client";
import { Edit } from "lucide-react";
import Link from "next/link";
import { getSocialIcon } from "@/components/SocialIcons";
import type { User } from "@prisma/client";

interface ProfileCardsProps {
  user: User;
}

export default function ProfileCards({ user }: ProfileCardsProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "24px",
        maxWidth: "1000px",
      }}
    >
      {/* Basic Information Card */}
      <Card style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
        <CardBody>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <CardTitle>Basic Information</CardTitle>
            <Link href="/dashboard/profile/edit">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: "#4285F4",
                  cursor: "pointer",
                }}
              >
                <Edit size={16} style={{ marginRight: "4px" }} />
                Edit
              </div>
            </Link>
          </div>

          <div style={{ marginTop: "16px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "120px 1fr",
                rowGap: "16px",
                marginBottom: "8px",
              }}
            >
              <div style={{ fontWeight: "500", color: "#666" }}>Name:</div>
              <div>{user.name}</div>

              <div style={{ fontWeight: "500", color: "#666" }}>Email:</div>
              <div>{user.email}</div>

              <div style={{ fontWeight: "500", color: "#666" }}>Role:</div>
              <div>
                {user.role === Role.CREATOR ? "Content Creator" : "Sponsor"}
              </div>

              <div style={{ fontWeight: "500", color: "#666" }}>
                Industry:
              </div>
              <div>{user.industry || "Not specified"}</div>

              {user.role === Role.CREATOR && (
                <>
                  <div style={{ fontWeight: "500", color: "#666" }}>
                    Audience Size:
                  </div>
                  <div>{user.totalAudience.toLocaleString()}</div>
                </>
              )}

              <div style={{ fontWeight: "500", color: "#666" }}>
                Member Since:
              </div>
              <div>
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Social Links Card */}
      <Card style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
        <CardBody>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <CardTitle>Social Links</CardTitle>
            <Link href="/dashboard/profile/edit">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: "#4285F4",
                  cursor: "pointer",
                }}
              >
                <Edit size={16} style={{ marginRight: "4px" }} />
                Edit
              </div>
            </Link>
          </div>

          <div style={{ marginTop: "16px" }}>
            {user.socialLinks && user.socialLinks.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {user.socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      textDecoration: "none",
                      color: "#333",
                    }}
                  >
                    <div style={{ marginRight: "8px" }}>
                      {getSocialIcon(link)}
                    </div>
                    <span>{link}</span>
                  </a>
                ))}
              </div>
            ) : (
              <div style={{ color: "#666", fontStyle: "italic" }}>
                No social links added yet.
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}