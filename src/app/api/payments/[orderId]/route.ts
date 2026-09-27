import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { orderId } = await context.params;

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: user.userId,
      },
      include: {
        service: true,
        transactions: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    const transaction = order.transactions[0] ?? null;

    return NextResponse.json({
      order: {
        id: order.id,
        status: order.status,
        amount: order.amount ? Number(order.amount) : null,
        requirements: order.requirements,
        service: {
          name: order.service.name,
          description: order.service.description,
        },
        transaction: transaction
          ? {
              id: transaction.id,
              amount: Number(transaction.amount),
              status: transaction.status,
              receiptFileName:
                transaction.receiptFileName ?? null,
              rejectionReason:
                transaction.rejectionReason ?? null,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("PAYMENT GET ERROR:", error);

    return NextResponse.json(
      { error: "Unable to load payment information." },
      { status: 500 }
    );
  }
}