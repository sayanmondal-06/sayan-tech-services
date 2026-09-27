import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "You must be logged in to place an order.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const serviceId =
      typeof body.serviceId === "string" ? body.serviceId.trim() : "";

    const requirements =
      typeof body.requirements === "string"
        ? body.requirements.trim()
        : "";

    if (!serviceId) {
      return Response.json(
        { success: false, message: "Service ID is required." },
        { status: 400 }
      );
    }

    if (requirements.length > 10000) {
      return Response.json(
        {
          success: false,
          message: "Requirements are too long. Please keep them under 10,000 characters.",
        },
        { status: 400 }
      );
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service || !service.active) {
      return Response.json(
        {
          success: false,
          message: "Service not found or unavailable.",
        },
        { status: 404 }
      );
    }

    if (service.startingPrice === null) {
      return Response.json(
        {
          success: false,
          message: "This service does not currently have a valid starting price.",
        },
        { status: 400 }
      );
    }

    const amount = service.startingPrice;

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId: user.userId,
          serviceId: service.id,
          requirements: requirements || null,
          amount,
        },
        include: {
          service: true,
        },
      });

      await tx.transaction.create({
        data: {
          userId: user.userId,
          orderId: createdOrder.id,
          amount,
          status: "PENDING",
          gateway: null,
          gatewayReference: null,
        },
      });

      await tx.notification.create({
        data: {
          userId: user.userId,
          title: "Order received",
          message: `Your order for ${service.name} has been received and is currently pending review.`,
        },
      });

      return createdOrder;
    });

    return Response.json(
      {
        success: true,
        message: "Order created successfully.",
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong while creating the order.",
      },
      { status: 500 }
    );
  }
}
