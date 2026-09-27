import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailPattern.test(email)) {
  return Response.json(
    {
      success: false,
      message: "Please enter a valid email address.",
    },
    { status: 400 }
  );
}

    // Basic validation
    if (!name || !email || !password) {
      return Response.json(
        {
          success: false,
          message: "Name, email and password are required.",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return Response.json(
        {
          success: false,
          message: "Password must be at least 8 characters.",
        },
        { status: 400 }
      );
    }

    // Check whether the email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "An account with this email already exists.",
        },
        { status: 409 }
      );
    }

    // Hash password before storing it
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    return Response.json(
      {
        success: true,
        message: "Account created successfully.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong while creating the account.",
      },
      { status: 500 }
    );
  }
}