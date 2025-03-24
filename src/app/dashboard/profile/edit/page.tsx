"use client";

import { useState, useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Button } from '@progress/kendo-react-buttons';
import { Input, NumericTextBox } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Label } from '@progress/kendo-react-labels';
import { useRouter } from "next/navigation";
import { Notification, NotificationGroup } from "@progress/kendo-react-notification";
import { Fade } from "@progress/kendo-react-animation";
import { getCurrentUser } from "@/app/actions/user/getCurrentUser";

import { Role } from "@prisma/client";
import { xIcon } from "@progress/kendo-svg-icons";
import { updateUserProfile } from "@/app/actions/user/updateUserProfile";

interface ProfileFormInputs {
  name: string;
  industry: string;
  totalAudience?: number;
  socialLinks: string[];
}

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Entertainment",
  "Manufacturing",
  "Retail",
  "Other",
];

const socialPlatforms = [
  { name: "twitter", label: "Twitter/X", prefix: "https://twitter.com/" },
  { name: "instagram", label: "Instagram", prefix: "https://instagram.com/" },
  { name: "youtube", label: "YouTube", prefix: "https://youtube.com/" },
  { name: "linkedin", label: "LinkedIn", prefix: "https://linkedin.com/in/" },
  { name: "tiktok", label: "TikTok", prefix: "https://tiktok.com/@" },
];

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);
  const [socialLinks, setSocialLinks] = useState<string[]>([]);
  const [socialPlatform, setSocialPlatform] = useState<string>("twitter");
  const [username, setUsername] = useState<string>("");

  const { control, handleSubmit, setValue, watch } = useForm<ProfileFormInputs>({
    defaultValues: {
      name: "",
      industry: industries[0],
      totalAudience: 0,
      socialLinks: [],
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getCurrentUser();
        if (response.error) {
          setError(response.error as string);
        } else if (response.user){
          setUserData(response.user);
          // Set form values
          setValue("name", response.user.name);
          setValue("industry", response.user.industry || industries[0]);
          setValue("totalAudience", response.user.totalAudience || 0);
          
          if (response.user.socialLinks && response.user.socialLinks.length > 0) {
            setSocialLinks(response.user.socialLinks);
            setValue("socialLinks", response.user.socialLinks);
          }
        }
      } catch (err) {
        setError("Failed to load user data");
      }
    };

    fetchUserData();
  }, [setValue]);

  const onSubmit: SubmitHandler<ProfileFormInputs> = async (data) => {
    setLoading(true);
    try {
      const response = await updateUserProfile(data);
      if (response.error) {
        setError(response.error as string);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard/profile");
        }, 2000);
      }
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Edit Profile</h1>
        <div>Loading user data...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "24px" }}>Edit Profile</h1>

      <div style={{ maxWidth: "600px" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: "20px" }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Name"
                  style={{ width: "100%" }}
                />
              )}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <Controller
              name="industry"
              control={control}
              render={({ field }) => (
                <>
                  <Label>Industry</Label>
                  <DropDownList
                    {...field}
                    data={industries}
                    style={{ width: "100%" }}
                  />
                </>
              )}
            />
          </div>

          {userData.role === Role.CREATOR && (
            <div style={{ marginBottom: "20px" }}>
              <Controller
                name="totalAudience"
                control={control}
                render={({ field }) => (
                  <>
                    <Label>Total Audience Size</Label>
                    <NumericTextBox
                      {...field}
                      placeholder="Enter your total audience size"
                      style={{ width: "100%" }}
                      min={0}
                      step={1000}
                      format="n0"
                    />
                  </>
                )}
              />
            </div>
          )}

          <div style={{ marginBottom: "20px" }}>
            <Label>Social Media Links</Label>
            <div
              style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}
            >
              <DropDownList
                data={socialPlatforms}
                textField="label"
                dataItemKey="name"
                value={socialPlatforms.find((p) => p.name === socialPlatform)}
                onChange={(e) => setSocialPlatform(e.value.name)}
                style={{ width: "40%" }}
              />
              <Input
                value={username}
                onChange={(e) => setUsername(e.value)}
                placeholder={`Enter your ${socialPlatforms.find((p) => p.name === socialPlatform)?.label} username`}
                style={{ width: "60%" }}
              />
            </div>
            <Button
              type="button"
              themeColor="secondary"
              style={{ marginBottom: "1rem" }}
              disabled={!username}
              onClick={() => {
                const platform = socialPlatforms.find(
                  (p) => p.name === socialPlatform
                );
                if (platform && username) {
                  const newLink = platform.prefix + username;
                  const updatedLinks = [...socialLinks, newLink];
                  setSocialLinks(updatedLinks);
                  setValue("socialLinks", updatedLinks);
                  setUsername("");
                }
              }}
            >
              Add Social Link
            </Button>

            {socialLinks.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  marginBottom: "16px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "4px",
                  padding: "12px",
                }}
              >
                {socialLinks.map((link, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px",
                        backgroundColor: "#f5f5f5",
                        borderRadius: "4px",
                      }}
                    >
                      <span>{link}</span>
                      <Button
                        svgIcon={xIcon}
                        themeColor="error"
                        size="small"
                        type="button"
                        onClick={() => {
                          const updatedLinks = socialLinks.filter(
                            (_, i) => i !== index
                          );
                          setSocialLinks(updatedLinks);
                          setValue("socialLinks", updatedLinks);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
            <Button
              themeColor="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              themeColor="base"
              type="button"
              onClick={() => router.push("/dashboard/profile")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>

      <NotificationGroup
        style={{
          right: 0,
          bottom: 0,
          alignItems: "flex-start",
          flexWrap: "wrap-reverse",
        }}
      >
        <Fade>
          {error && (
            <Notification
              type={{ style: "error", icon: true }}
              closable={true}
              onClose={() => setError(null)}
            >
              <span>{error}</span>
            </Notification>
          )}
          {success && (
            <Notification type={{ style: "success", icon: true }} closable={true}>
              <span>Profile updated successfully!</span>
            </Notification>
          )}
        </Fade>
      </NotificationGroup>
    </div>
  );
}