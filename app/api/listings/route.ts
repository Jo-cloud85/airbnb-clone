import { NextResponse } from "next/server";

import prisma from "../../libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(req: Request) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const body = await req.json();

    const { 
        title,
        description,
        imageSrc,
        category,
        roomCount,
        bathroomCount,
        guestCount,
        location,
        price
    } = body;

    // prisma.listing comes from the schema.prisma file you created
    const listing = await prisma.listing.create({
        data: {
            title,
            description,
            imageSrc,
            category,
            roomCount,
            bathroomCount,
            guestCount,
            locationValue: location.value,
            price: parseInt(price, 10),
            userId: currentUser.id
        }
    });

    return NextResponse.json(listing);
}