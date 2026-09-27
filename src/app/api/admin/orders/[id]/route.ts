import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteProps = {
  params: Promise<{ id: string }>;
};

const allowedStatuses = [
  "PENDING",
  "ACCEPTED",
  "IN_PROGRESS",
  "REVIEW",
  "COMPLETED",
  "CANCELLED",
] as const;

export async function PATCH(request: Request, { params }: RouteProps) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json(
        { success: false, message: "Authentication required." },
        { status: 401 }
      );
    }

    if (user.role !== "ADMIN") {
      return Response.json(
        { success: false, message: "Admin access required." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const status = body.status;

    if (!allowedStatuses.includes(status)) {
      return Response.json(
        { success: false, message: "Invalid order status." },
        { status: 400 }
      );
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: { service: true },
    });

    if (!existingOrder) {
      return Response.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    if (existingOrder.status === status) {
      return Response.json({
        success: true,
        message: "Order status is already set to this value.",
      });
    }

    const order = await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id },
        data: { status },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          service: true,
        },
      });

      await tx.notification.create({
        data: {
          userId: existingOrder.userId,
          title: "Order status updated",
          message: `Your order for ${existingOrder.service.name} is now ${status.replaceAll("_", " ")}.`,
        },
      });

      return updatedOrder;
    });

    return Response.json({
      success: true,
      message: "Order status updated.",
      order,
    });
  } catch (error) {
    console.error("Admin order update error:", error);

    return Response.json(
      { success: false, message: "Unable to update order." },
      { status: 500 }
    );
  }
}
