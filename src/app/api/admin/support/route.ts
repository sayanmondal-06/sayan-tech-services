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

    if (user.role !== "ADMIN" && user.role !== "SUPPORT") {
      return Response.json(
        { success: false, message: "Support access required." },
        { status: 403 }
      );
    }

    const tickets = await prisma.supportTicket.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        messages: {
          include: {
            sender: {
              select: {
                id: true,
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
    console.error("Admin support GET error:", error);

    return Response.json(
      { success: false, message: "Unable to load support tickets." },
      { status: 500 }
    );
  }
}
