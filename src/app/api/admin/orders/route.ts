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

    if (user.role !== "ADMIN") {
      return Response.json(
        { success: false, message: "Admin access required." },
        { status: 403 }
      );
    }

    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        transactions: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Admin orders GET error:", error);

    return Response.json(
      { success: false, message: "Unable to load orders." },
      { status: 500 }
    );
  }
}
