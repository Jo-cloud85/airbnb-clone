import prisma from "../libs/prismadb";

export interface IListingsParams {
  userId?: string;
}

export default async function getListings(
  params: IListingsParams
) {
  try {
    const { userId } = params;

    // eslint-disable-next-line prefer-const
    let query: any = {};

    if (userId) {
      query.userId = userId;
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
