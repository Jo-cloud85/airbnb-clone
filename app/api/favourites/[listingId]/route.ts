import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
    listingId?: string;
}

// Post ////////////////// ** explanation below why we don't use default
export async function POST({ params }: { params: IParams }) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    // Destructure after awaiting params (dont follow tutorial)
    const listingId = params.listingId;

    if (!listingId || typeof listingId !== 'string') {
        throw new Error('Invalid ID');
    }

    const favouriteIds = [...(currentUser.favouriteIds || [])];

    favouriteIds.push(listingId);

    const user = await prisma.user.update({
        where: {
            id: currentUser.id
        },
        data: {
            favouriteIds
        }
    });

    return NextResponse.json(user);
}

// Delete //////////////////
export async function DELETE (
    req: Request,
    { params }: { params: IParams }
) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    // Destructure after awaiting params (dont follow tutorial)
    const listingId = params.listingId;

    if (!listingId || typeof listingId !== 'string') {
        throw new Error('Invalid ID');
    }

    let favouriteIds = [...(currentUser.favouriteIds || [])];

    favouriteIds = favouriteIds.filter((id) => id !== listingId);

    const user = await prisma.user.update({
        where: {
            id: currentUser.id
        },
        data: {
            favouriteIds
        }
    });

    return NextResponse.json(user);
}

/*
In Next.js 13+, when creating API routes using the App Router (route.ts files), we don't use export default because:
1. Route Handlers in Next.js 13+ are designed to support multiple HTTP methods in a single file. 
Each method (GET, POST, DELETE, etc.) needs to be exported separately. For example:

// route.ts
export async function GET() { ... }
export async function POST() { ... }
export async function DELETE() { ... }

2. This pattern allows Next.js to do better tree-shaking (removing unused code) since it can identify which HTTP 
methods are actually being used.

It's more explicit about which HTTP methods are supported by the route.

// Don't do this in route.ts
export default async function handler(request: Request, { params }: { params: IParams }) {
  if (request.method === 'POST') {
    // handle POST
  } else if (request.method === 'DELETE') {
    // handle DELETE
  }
}
*/