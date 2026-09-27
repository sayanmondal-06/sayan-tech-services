import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { randomUUID } from "crypto";
import path from "path";
import { mkdir, writeFile } from "fs/promises";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedTypes: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "application/pdf": ".pdf",
};

export async function POST(
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

    const transaction = order.transactions[0];

    if (!transaction) {
      return NextResponse.json(
        { error: "No transaction exists for this order." },
        { status: 400 }
      );
    }

    if (transaction.status === "PAID") {
      return NextResponse.json(
        { error: "This payment has already been verified." },
        { status: 400 }
      );
    }

    if (transaction.status === "VERIFICATION_PENDING") {
      return NextResponse.json(
        { error: "A receipt is already waiting for verification." },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("receipt");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Please upload a payment receipt." },
        { status: 400 }
      );
    }

    if (file.size <= 0) {
      return NextResponse.json(
        { error: "The uploaded file is empty." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Receipt must be smaller than 5 MB." },
        { status: 400 }
      );
    }

    const extension = allowedTypes[file.type];

    if (!extension) {
      return NextResponse.json(
        {
          error:
            "Only JPG, PNG, WEBP or PDF receipts are allowed.",
        },
        { status: 400 }
      );
    }

    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
      "payment-receipts"
    );

    await mkdir(uploadDirectory, { recursive: true });

    const safeFileName =
      `${orderId}-${randomUUID()}${extension}`;

    const filePath = path.join(
      uploadDirectory,
      safeFileName
    );

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(filePath, buffer);

    const receiptUrl =
      `/uploads/payment-receipts/${safeFileName}`;

    const updatedTransaction =
      await prisma.$transaction(async (tx) => {
        const updated = await tx.transaction.update({
          where: {
            id: transaction.id,
          },
          data: {
            status: "VERIFICATION_PENDING",
            paymentMethod: "UPI_MANUAL",
            receiptUrl,
            receiptFileName: file.name,
            receiptUploadedAt: new Date(),
            verifiedAt: null,
            verifiedBy: null,
            rejectionReason: null,
          },
        });

        await tx.notification.create({
          data: {
            userId: user.userId,
            title: "Payment receipt submitted",
            message:
              `Your payment receipt for ${order.service.name} has been submitted and is waiting for verification.`,
          },
        });

        const admins = await tx.user.findMany({
          where: {
            role: "ADMIN",
          },
          select: {
            id: true,
          },
        });

        for (let i = 0; i < admins.length; i++) {
          await tx.notification.create({
            data: {
              userId: admins[i].id,
              title: "Payment verification required",
              message:
                `A payment receipt has been submitted for order ${order.id}.`,
            },
          });
        }

        return updated;
      });

    return NextResponse.json({
      success: true,
      message:
        "Payment receipt submitted successfully.",
      transaction: {
        id: updatedTransaction.id,
        status: updatedTransaction.status,
      },
      order: {
        id: order.id,
        status: order.status,
        amount: order.amount
          ? Number(order.amount)
          : null,
        requirements: order.requirements,
        service: {
          name: order.service.name,
          description: order.service.description,
        },
        transaction: {
          id: updatedTransaction.id,
          amount: Number(updatedTransaction.amount),
          status: updatedTransaction.status,
          receiptFileName:
            updatedTransaction.receiptFileName,
          rejectionReason:
            updatedTransaction.rejectionReason,
        },
      },
    });
  } catch (error) {
    console.error("RECEIPT UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        error:
          "Unable to upload payment receipt. Please try again.",
      },
      { status: 500 }
    );
  }
}