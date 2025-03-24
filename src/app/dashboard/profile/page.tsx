import { getCurrentUser } from "@/app/actions/user/getCurrentUser";
import ProfileCards from "./components/ProfileCards";

export default async function ProfilePage() {
  const userResponse = await getCurrentUser();

  if (userResponse.error) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>My Profile</h1>
        <div style={{ color: "#EA4335", marginTop: "20px" }}>
          {userResponse.error as string}
        </div>
      </div>
    );
  }

  const { user } = userResponse;
  if(!user) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>My Profile</h1>
        <div style={{ color: "#EA4335", marginTop: "20px" }}>
          There was an error loading your profile.
        </div>
      </div>
    ); 
  }
  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "24px" }}>My Profile</h1>

      <ProfileCards user={user} />
    </div>
  );
}