import getCurrentUser from "./actions/getCurrentUser";
import getListings, { IListingsParams } from "./actions/getListings";
import Container from "./components/Container";
import EmptyState from "./components/EmptyState";
import ListingCard from "./components/listings/ListingCard";

/*
I have to add the line below if not I will have this error:
Error: Dynamic server usage: Route / couldn't be rendered statically because it used ``await searchParams`, `searchParams.then`, or similar`. 
See more info here: https://nextjs.org/docs/messages/dynamic-server-error
*/
export const dynamic = 'force-dynamic';

interface HomeProps {
  searchParams: Promise<IListingsParams>;
}

const Home = async ({ searchParams }: HomeProps) => {
  const listings = await getListings(searchParams);
  const currentUser = await getCurrentUser();

  if (listings?.length === 0) {
    return (
      <EmptyState showReset/>
    );
  }

  return (
    <Container>
      <div className=" 
        pt-24
        grid
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        2xl:grid-cols-5
        gap-6
      ">
        {listings?.map((listing: any) => {
          return (
            <ListingCard
              currentUser={currentUser}
              key={listing.id}
              data={listing}
            />
          )
        })}
      </div>
    </Container>
  );
}

export default Home;
