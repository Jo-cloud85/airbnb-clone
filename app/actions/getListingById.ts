import prisma from "../libs/prismadb";

interface IParams {
    listingId?: string;
}

export default async function getListingById(params: IParams) {
    try {
        const { listingId } = await params;

        const listing = await prisma.listing.findUnique({
            where: {
                id: listingId,
            },
            include: {
                user: true,
            }
        });

        if (!listing) {
            return null;
        }

        // No need to manually serialize the dates now in the new Next.js. 
        // The dates are automatically serialized when sending the response.
        return {
            ...listing,
            user: {
                ...listing.user,
                emailVerified: listing.user.emailVerified || null,
            }
        };
    } catch (error: any) {
        throw new Error(error);
    }
}