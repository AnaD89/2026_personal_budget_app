import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { alertPreferenceSchema } from "@/lib/validations";
import { unauthorized, notFound, serverError } from "@/lib/api-utils";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return unauthorized();
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { alertPreference: true },
    });

    if (!user) {
      return notFound("User not found");
    }

    return NextResponse.json(
      user.alertPreference || {
        emailEnabled: true,
        threshold: 80,
      }
    );
  } catch (error) {
    console.error("Error fetching alert preferences:", error);
    return serverError();
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return unauthorized();
    }

    const body = await req.json();
    const validatedData = alertPreferenceSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return notFound("User not found");
    }

    const alertPreference = await prisma.alertPreference.upsert({
      where: { userId: user.id },
      update: validatedData,
      create: {
        userId: user.id,
        ...validatedData,
      },
    });

    return NextResponse.json(alertPreference, { status: 201 });
  } catch (error) {
    console.error("Error updating alert preferences:", error);

    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    }

    return serverError();
  }
}
