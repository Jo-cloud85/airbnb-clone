import { Listing, User } from "@prisma/client";
import React from "react";
import Container from "../components/Container";
import Heading from "../components/Heading";
import ListingCard from "../components/listings/ListingCard";

interface FavouritesClientProps {
    listings: Listing[];
    currentUser?: User | null; // you have to include null else if will be undefined if User is not available, leading to type error
}

const FavouritesClient: React.FC<FavouritesClientProps> = ({
    listings,
    currentUser
}) => {
  return (
    <Container>
        <Heading 
            title="Favourites"
            subtitle="List of places you have favourited!"
        />
        <div
            className="
                mt-10
                grid
                grid-cols-1
                sm:grid-cols-2
                md:grid-cols-3
                lg:grid-cols-4
                xl:grid-cols-5
                2xl:grid-cols-6
                gap-8
            "
        >
            {listings.map((listing) => (
                <ListingCard
                    currentUser={currentUser}
                    key={listing.id}
                    data={listing}
                />
            ))}
        </div>
        
    </Container>
  )
}

export default FavouritesClient;