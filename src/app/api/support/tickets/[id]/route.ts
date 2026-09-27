import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: Request,
  { params }: RouteProps
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 }
      );
    }

    const { id } = await params;

    const ticket = await prisma.supportTicket.findFirst({
      where: {
        id,
        userId: user.userId,
      },
      include: {
        messages: {
          include: {
            sender: {
              select: {
                name: true,
                email: true,
                role: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!ticket) {
      return Response.json(
        {
          success: false,
          message: "Ticket not found.",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error("Support ticket GET error:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to load ticket.",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: RouteProps
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    if (!message) {
      return Response.json(
        {
          success: false,
          message: "Message cannot be empty.",
        },
        { status: 400 }
      );
    }

    const ticket = await prisma.supportTicket.findFirst({
      where: {
        id,
        userId: user.userId,
      },
    });

    if (!ticket) {
      return Response.json(
        {
          success: false,
          message: "Ticket not found.",
        },
        { status: 404 }
      );
    }

    if (
      ticket.status === "CLOSED" ||
      ticket.status === "RESOLVED"
    ) {
      return Response.json(
        {
          success: false,
          message:
            "This ticket is closed. Please create a new ticket.",
        },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const newMessage = await tx.supportMessage.create({
        data: {
          ticketId: ticket.id,
          senderId: user.userId,
          senderType: "USER",
          message,
        },
      });

      await tx.supportTicket.update({
        where: {
          id: ticket.id,
        },
        data: {
          status: "OPEN",
        },
      });

      return newMessage;
    });

    return Response.json({
      success: true,
      message: "Reply sent successfully.",
      supportMessage: result,
    });
  } catch (error) {
    console.error("Support reply error:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to send reply.",
      },
      { status: 500 }
    );
  }
}