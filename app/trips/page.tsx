import EmptyState from "../components/EmptyState";
import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";
import TripsClient from "./TripsClient";

const TripsPage = async () => {
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
        const reservations = await getReservations({ 
            userId: currentUser.id 
        });

        if (!reservations || reservations.length === 0) {
            return (
                <EmptyState
                    title="No trips found"
                    subtitle="Looks like you haven't reserved any trips yet"
                />
            );
        }

        return (
            <TripsClient
                reservations={reservations}
                currentUser={currentUser}
            />
        );

    } catch (error) {
        // console.error("Error fetching reservations:", error);
        return (
            <EmptyState
                title="Error"
                subtitle="Something went wrong while loading your trips"
            />
        );
    }
}

export default TripsPage;