import getCurrentUser from "@/app/actions/getCurrentUser";
import getListingById from "@/app/actions/getListingById";
import getReservations from "@/app/actions/getReservations";
import EmptyState from "@/app/components/EmptyState";
import ListingClient from "./ListingClient";

interface IParams {
  listingId?: string;
}

const ListingPage = async ({ params }: { params: IParams }) => {
  try {
    const [listing, currentUser, reservations] = await Promise.all([
      getListingById(params),
      getCurrentUser(),
      getReservations({
        listingId: params.listingId
      })
    ]);

    if (!listing) {
      return (
        <EmptyState 
          title="Listing not found"
          subtitle="The listing you're looking for doesn't exist or has been removed"
        />
      );
    }

    // No need for JSON parsing since getReservations returns data directly
    return (
      <div>
        <ListingClient 
          listing={listing}
          currentUser={currentUser}
          reservations={reservations || []}
        />
      </div>
    );
  } catch (error) {
    // console.error("Error in ListingPage:", error);
    return (
      <EmptyState 
        title="Error"
        subtitle="Something went wrong while loading the listing"
      />
    );
  }
};

export default ListingPage;
