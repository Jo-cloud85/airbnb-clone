import prisma from "../libs/prismadb";

interface IParams {
    listingId?: string;
    userId?: string;
    authorId?: string;
}

export default async function getReservations(params: IParams) {

    try {
        const { listingId, userId, authorId } = params;

        const query: any = {};

        if (listingId) {
            query.listingId = listingId;
        }

        if (userId) {
            query.userId = userId;
        }

        if (authorId) {
            query.listing = { userId: authorId };
        }

        const reservations = await prisma.reservation.findMany({
            where: query,
            // By default, Prisma does not include related models in a .findMany() query unless 
            // explicitly requested thats why you have to do this.
            include: {
                listing: true,
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        // console.log(reservations);
        return reservations;

    } catch (error: any) {
        throw new Error("Error fetching reservations");
    }
}