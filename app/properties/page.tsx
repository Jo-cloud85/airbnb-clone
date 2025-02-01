import EmptyState from "../components/EmptyState";
import getCurrentUser from "../actions/getCurrentUser";
import PropertiesClient from "./PropertiesClient";
import getListings from "../actions/getListings";

const PropertiesPage = async () => {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return (
            <EmptyState 
                title="Unauthorized"
                subtitle="Please login"
            />
        );
    }

    try {
        const listings = await getListings(Promise.resolve({ 
            userId: currentUser.id 
        }));

        if (!listings || listings.length === 0) {
            return (
                <EmptyState
                    title="No properties found"
                    subtitle="Looks like you have no properties yet"
                />
            );
        }

        return (
            <PropertiesClient
                listings={listings}
                currentUser={currentUser}
            />
        );

    } catch (error) {
        // console.error("Error fetching reservations:", error);
        return (
            <EmptyState
                title="Error"
                subtitle="Something went wrong while loading your Properties"
            />
        );
    }
}

export default PropertiesPage;