import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
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

    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    const unreadCount = await prisma.notification.count({
      where: {
        userId: user.userId,
        read: false,
      },
    });

    return Response.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Notifications error:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to load notifications.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
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

    const body = await request.json();

    const notificationId =
      typeof body.notificationId === "string"
        ? body.notificationId.trim()
        : "";

    if (!notificationId) {
      return Response.json(
        {
          success: false,
          message: "Notification ID is required.",
        },
        { status: 400 }
      );
    }

    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId: user.userId,
      },
    });

    if (!notification) {
      return Response.json(
        {
          success: false,
          message: "Notification not found.",
        },
        { status: 404 }
      );
    }

    const updatedNotification = await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        read: true,
      },
    });

    return Response.json({
      success: true,
      notification: updatedNotification,
    });
  } catch (error) {
    console.error("Notification update error:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to update notification.",
      },
      { status: 500 }
    );
  }
}