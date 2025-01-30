import EmptyState from "../components/EmptyState";

import getCurrentUser from "../actions/getCurrentUser";
import getFavouriteListings from "../actions/getFavouriteListings";
import FavouritesClient from "./FavouritesClient";

// Rename from ListingPage so that I don't get confuse with the one under listings/[listingId]
const FavListingPage = async() => {
  const listings = await getFavouriteListings();
  const currentUser = await getCurrentUser();

  if (listings.length === 0) {
    return (
      <EmptyState
        title="No favourites"
        subtitle="Looks like you have no favourite listings."
      />
    )
  }

  return (
    <FavouritesClient 
      listings={listings}
      currentUser={currentUser}
    />
  )
}

export default FavListingPage;