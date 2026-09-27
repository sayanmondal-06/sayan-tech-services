import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required." },
        { status: 403 }
      );
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        status: "VERIFICATION_PENDING",
      },
      orderBy: {
        receiptUploadedAt: "asc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        order: {
          include: {
            service: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      transactions: transactions.map((transaction) => ({
        id: transaction.id,
        amount: Number(transaction.amount),
        status: transaction.status,
        paymentMethod: transaction.paymentMethod,
        receiptUrl: transaction.receiptUrl,
        receiptFileName: transaction.receiptFileName,
        receiptUploadedAt:
          transaction.receiptUploadedAt,
        user: transaction.user,
        order: {
          id: transaction.order.id,
          status: transaction.order.status,
          service: transaction.order.service,
        },
      })),
    });
  } catch (error) {
    console.error("ADMIN PAYMENT GET ERROR:", error);

    return NextResponse.json(
      {
        error:
          "Unable to load pending payments.",
      },
      { status: 500 }
    );
  }
}