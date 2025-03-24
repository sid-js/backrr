import { getDashboardData } from "@/app/actions/dashboard/getDashboardData";
import SponsorListingCard from "@/components/SponsorListingCard";
import { Card, CardBody, CardTitle } from "@progress/kendo-react-all";
import { Check, Clock, FileText, Users } from "lucide-react";
import Link from "next/link";

// Analytics Card Component
function AnalyticsCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <Card style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", height: "100%" }}>
      <CardBody>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <CardTitle style={{ fontSize: "16px", color: "#666" }}>{title}</CardTitle>
            <div style={{ fontSize: "28px", fontWeight: "bold", marginTop: "8px" }}>{value}</div>
          </div>
          <div style={{
            backgroundColor: color,
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white"
          }}>
            {icon}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default async function Page() {
  const dashboardData = await getDashboardData();

  if (dashboardData.error) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Dashboard</h1>
        <div style={{ color: "#EA4335", marginTop: "20px" }}>{dashboardData.error}</div>
      </div>
    );
  }

  const { listings, recentSponsors, analytics } = dashboardData;

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "24px" }}>Dashboard</h1>

      {/* Analytics Cards */}
      {analytics && <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "24px",
        marginBottom: "40px"
      }}>
        <AnalyticsCard
          title="Total Listings"
          value={analytics.totalListings}
          icon={<FileText size={24} />}
          color="#4285F4"
        />
        <AnalyticsCard
          title="Total Applications"
          value={analytics.totalApplications}
          icon={<Users size={24} />}
          color="#34A853"
        />
        <AnalyticsCard
          title="Pending Applications"
          value={analytics.pendingApplications}
          icon={<Clock size={24} />}
          color="#FBBC05"
        />
        <AnalyticsCard
          title="Accepted Applications"
          value={analytics.acceptedApplications}
          icon={<Check size={24} />}
          color="#34A853"
        />
      </div>}


      {/* Recent Listings Section */}
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Recent Sponsor Listings</h2>
        <Link href="/dashboard/sponsors">
          <span style={{ color: "#4285F4", textDecoration: "none" }}>View All</span>
        </Link>
      </div>

      {recentSponsors && recentSponsors.length > 0 ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "24px",
        }}>
          {recentSponsors.map((sponsor) => (
            <SponsorListingCard
              key={sponsor.id}
              sponsorListing={sponsor}
            />
          ))}
        </div>
      ) : (
        <div style={{ padding: "24px", textAlign: "center", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
          <p>No sponsor listings found.</p>
          <Link href="/dashboard/sponsors/create-listing">
            <span style={{ color: "#4285F4", textDecoration: "none" }}>Create your first listing</span>
          </Link>
        </div>
      )}

      {/* My Listings Section */}
      {listings && listings.length > 0 && (
        <>
          <div style={{ marginTop: "40px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>My Listings</h2>
            <Link href="/dashboard/sponsors/my-listings">
              <span style={{ color: "#4285F4", textDecoration: "none" }}>View All</span>
            </Link>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "24px",
          }}>
            {listings.map((listing) => (
              <SponsorListingCard
                key={listing.id}
                sponsorListing={listing}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}