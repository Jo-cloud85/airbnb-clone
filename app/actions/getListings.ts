import prisma from "../libs/prismadb";

export interface IListingsParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
}

export default async function getListings(
  params: Promise<IListingsParams>
) {
  try {
    const { 
      userId,
      roomCount, 
      guestCount, 
      bathroomCount, 
      locationValue, 
      startDate, 
      endDate, 
      category 
    } = await params;

    // eslint-disable-next-line prefer-const
    let query: any = {};

    if (userId) {
      query.userId = userId;
    }

    if (category) {
      query.category = category;
    }

    // If user selects they need at least 2 rooms
    if (roomCount) { // roomCount = "2"
      query.roomCount = {
        gte: +roomCount  // Will find listings with 2 or more rooms
      };
    }

    if (guestCount) {
      query.guestCount = {
        gte: +guestCount
      };
    }

    if (bathroomCount) {
      query.bathroomCount = {
        gte: +bathroomCount
      };
    }

    if (locationValue) {
      query.locationValue = locationValue;
    }

    if (startDate && endDate) {
      query.NOT = {
        reservations: {
          some: {
            OR: [
              {
                endDate: { gte: startDate },
                startDate: { lte: startDate }
              },
              {
                startDate: { lte: endDate },
                endDate: { gte: endDate }
              }
            ]
          }
        }
      }; 
    }

    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: {
        createdAt: "desc", 
      }
    });

    return listings;
  } catch (error: any) {
    console.log(error);
  }
}
