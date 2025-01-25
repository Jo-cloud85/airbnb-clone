import prisma from "../libs/prismadb";

export default async function getProducts() {
  try {
    const listings = await prisma.listing.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return listings;
  } catch (error) {
    console.log(error);
  }
}
