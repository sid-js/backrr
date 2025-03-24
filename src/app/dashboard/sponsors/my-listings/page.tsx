import { getSponsorListings } from '@/app/actions/sponsor/getSponsorListings';
import MyListingsGrid from '@/components/MyListingsGrid';

async function MyListings() {
    const response = await getSponsorListings();
    if (!response) {
        return <div>Error loading listings</div>;
    }

    const listings = response.listings;
    if (!listings) {
        return <div>No listings found</div>;  
    }

    return <MyListingsGrid listings={listings} error={response.error} />;
}

export default MyListings;