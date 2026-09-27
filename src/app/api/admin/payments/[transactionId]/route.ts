import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  request: Request,
  context: {
    params: Promise<{ transactionId: string }>;
  }
) {
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

    const { transactionId } = await context.params;

    const body = await request.json();

    const action = body.action;
    const rejectionReason =
      typeof body.rejectionReason === "string"
        ? body.rejectionReason.trim()
        : "";

    if (action !== "VERIFY" && action !== "REJECT") {
      return NextResponse.json(
        {
          error:
            "Invalid action. Use VERIFY or REJECT.",
        },
        { status: 400 }
      );
    }

    if (
      action === "REJECT" &&
      !rejectionReason
    ) {
      return NextResponse.json(
        {
          error:
            "A rejection reason is required.",
        },
        { status: 400 }
      );
    }

    const transaction =
      await prisma.transaction.findUnique({
        where: {
          id: transactionId,
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
              service: true,
            },
          },
        },
      });

    if (!transaction) {
      return NextResponse.json(
        {
          error: "Transaction not found.",
        },
        { status: 404 }
      );
    }

    if (
      transaction.status !==
      "VERIFICATION_PENDING"
    ) {
      return NextResponse.json(
        {
          error:
            "This payment is no longer waiting for verification.",
        },
        { status: 400 }
      );
    }

    if (action === "VERIFY") {
      const result =
        await prisma.$transaction(async (tx) => {
          const updatedTransaction =
            await tx.transaction.update({
              where: {
                id: transactionId,
              },
              data: {
                status: "PAID",
                verifiedAt: new Date(),
                verifiedBy: user.userId,
                rejectionReason: null,
              },
            });

          const updatedOrder =
            await tx.order.update({
              where: {
                id: transaction.orderId,
              },
              data: {
                status: "ACCEPTED",
              },
            });

          await tx.notification.create({
            data: {
              userId: transaction.userId,
              title: "Payment verified",
              message:
                `Your payment of ₹${Number(transaction.amount)} for ${transaction.order.service.name} has been verified successfully. Your order has been accepted.`,
            },
          });

          return {
            transaction: updatedTransaction,
            order: updatedOrder,
          };
        });

      return NextResponse.json({
        success: true,
        action: "VERIFY",
        message:
          "Payment verified successfully.",
        transaction: {
          id: result.transaction.id,
          status: result.transaction.status,
        },
        order: {
          id: result.order.id,
          status: result.order.status,
        },
      });
    }

    const result =
      await prisma.$transaction(async (tx) => {
        const updatedTransaction =
          await tx.transaction.update({
            where: {
              id: transactionId,
            },
            data: {
              status: "FAILED",
              verifiedAt: null,
              verifiedBy: null,
              rejectionReason,
            },
          });

        await tx.notification.create({
          data: {
            userId: transaction.userId,
            title: "Payment receipt rejected",
            message:
              `Your payment receipt for ${transaction.order.service.name} was rejected. Reason: ${rejectionReason}`,
          },
        });

        return updatedTransaction;
      });

    return NextResponse.json({
      success: true,
      action: "REJECT",
      message:
        "Payment receipt rejected.",
      transaction: {
        id: result.id,
        status: result.status,
        rejectionReason:
          result.rejectionReason,
      },
    });
  } catch (error) {
    console.error(
      "ADMIN PAYMENT ACTION ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to process payment verification.",
      },
      { status: 500 }
    );
  }
}