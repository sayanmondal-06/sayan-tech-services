import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteProps = {
  params: Promise<{ id: string }>;
};

const statuses = [
  "OPEN",
  "IN_PROGRESS",
  "WAITING_FOR_CLIENT",
  "RESOLVED",
  "CLOSED",
] as const;

const priorities = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
] as const;

export async function PATCH(
  request: Request,
  { params }: RouteProps
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json(
        { success: false, message: "Authentication required." },
        { status: 401 }
      );
    }

    if (user.role !== "ADMIN" && user.role !== "SUPPORT") {
      return Response.json(
        { success: false, message: "Support access required." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
    });

    if (!ticket) {
      return Response.json(
        { success: false, message: "Ticket not found." },
        { status: 404 }
      );
    }

    const data: {
      status?: (typeof statuses)[number];
      priority?: (typeof priorities)[number];
    } = {};

    if (body.status !== undefined) {
      if (!statuses.includes(body.status)) {
        return Response.json(
          { success: false, message: "Invalid status." },
          { status: 400 }
        );
      }

      data.status = body.status;
    }

    if (body.priority !== undefined) {
      if (!priorities.includes(body.priority)) {
        return Response.json(
          { success: false, message: "Invalid priority." },
          { status: 400 }
        );
      }

      data.priority = body.priority;
    }

    const updatedTicket = await prisma.$transaction(
      async (tx) => {
        const updated = await tx.supportTicket.update({
          where: { id },
          data,
        });

        if (data.status && data.status !== ticket.status) {
          await tx.notification.create({
            data: {
              userId: ticket.userId,
              title: "Support ticket updated",
              message: `Your support ticket "${ticket.subject}" is now ${data.status.replaceAll(
                "_",
                " "
              )}.`,
            },
          });
        }

        return updated;
      }
    );

    return Response.json({
      success: true,
      message: "Support ticket updated.",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Admin support PATCH error:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to update support ticket.",
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
        { success: false, message: "Authentication required." },
        { status: 401 }
      );
    }

    if (user.role !== "ADMIN" && user.role !== "SUPPORT") {
      return Response.json(
        { success: false, message: "Support access required." },
        { status: 403 }
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

    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
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

    const result = await prisma.$transaction(async (tx) => {
      const supportMessage = await tx.supportMessage.create({
        data: {
          ticketId: id,
          senderId: user.userId,
          senderType: "ADMIN",
          message,
        },
      });

      await tx.supportTicket.update({
        where: { id },
        data: {
          status: "IN_PROGRESS",
        },
      });

      await tx.notification.create({
        data: {
          userId: ticket.userId,
          title: "Support team replied",
          message: `The support team has replied to your ticket "${ticket.subject}".`,
        },
      });

      return supportMessage;
    });

    return Response.json({
      success: true,
      message: "Reply sent successfully.",
      supportMessage: result,
    });
  } catch (error) {
    console.error("Admin support POST error:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to send reply.",
      },
      { status: 500 }
    );
  }
}