import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json(
        { success: false, message: "Authentication required." },
        { status: 401 }
      );
    }

    const tickets = await prisma.supportTicket.findMany({
      where: {
        userId: user.userId,
      },
      include: {
        messages: {
          include: {
            sender: {
              select: {
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return Response.json({
      success: true,
      tickets,
    });
  } catch (error) {
    console.error("Support tickets GET error:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to load support tickets.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const subject =
      typeof body.subject === "string" ? body.subject.trim() : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    const priority =
      typeof body.priority === "string"
        ? body.priority.trim()
        : "MEDIUM";

    const allowedPriorities = [
      "LOW",
      "MEDIUM",
      "HIGH",
      "URGENT",
    ];

    if (!subject) {
      return Response.json(
        {
          success: false,
          message: "Subject is required.",
        },
        { status: 400 }
      );
    }

    if (!description) {
      return Response.json(
        {
          success: false,
          message: "Please describe your issue.",
        },
        { status: 400 }
      );
    }

    if (!allowedPriorities.includes(priority)) {
      return Response.json(
        {
          success: false,
          message: "Invalid priority.",
        },
        { status: 400 }
      );
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: user.userId,
        subject,
        description,
        priority: priority as
          | "LOW"
          | "MEDIUM"
          | "HIGH"
          | "URGENT",
        messages: {
          create: {
            senderId: user.userId,
            senderType: "USER",
            message: description,
          },
        },
      },
      include: {
        messages: true,
      },
    });

    return Response.json(
      {
        success: true,
        message: "Support ticket created successfully.",
        ticket,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Support ticket POST error:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to create support ticket.",
      },
      { status: 500 }
    );
  }
}