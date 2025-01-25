import { NextResponse } from "next/server";
import prisma from "../../libs/prismadb";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    const body = await req.json();

    const { email, name, password } = body;

    const hashedPassword = await bcrypt.hash(password, 12);

    // prisma.user comes from the schema.prisma file you created
    const user = await prisma.user.create({
        data: {
            email, 
            name, 
            hashedPassword
        }
    });

    return NextResponse.json(user);
}