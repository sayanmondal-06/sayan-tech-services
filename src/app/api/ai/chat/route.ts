import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function getAssistantResponse(message: string) {
  const text = message.toLowerCase();

  const seriousKeywords = [
    "hacked",
    "hack",
    "breach",
    "stolen",
    "compromised",
    "fraud",
    "scam",
    "payment fraud",
    "money stolen",
    "account stolen",
    "data stolen",
    "data loss",
    "security incident",
    "urgent",
    "critical",
  ];

  const serious = seriousKeywords.some((keyword) =>
    text.includes(keyword)
  );

  if (serious) {
    return {
      response:
        "This appears to be an issue that may require human attention. I am escalating it to the support team so an administrator can review it.",
      serious: true,
    };
  }

  if (
    text.includes("hello") ||
    text.includes("hi") ||
    text.includes("hey")
  ) {
    return {
      response:
        "Hi! I'm the Sayan Tech Services assistant. I can help you with services, development, testing, cybersecurity, orders and support.",
      serious: false,
    };
  }

  if (
    text.includes("service") ||
    text.includes("services") ||
    text.includes("what do you do")
  ) {
    return {
      response:
        "Sayan Tech Services provides web development, website security testing, website and app testing, Android app testing, AI/AIoT testing, mobile photography, application assistance and technology collaboration.",
      serious: false,
    };
  }

  if (
    text.includes("price") ||
    text.includes("pricing") ||
    text.includes("cost") ||
    text.includes("charge")
  ) {
    return {
      response:
        "You can view the current starting prices for available services from the Services page. The final price may depend on the requirements of your project.",
      serious: false,
    };
  }

  if (
    text.includes("order") ||
    text.includes("booking") ||
    text.includes("book")
  ) {
    return {
      response:
        "You can place an order by opening the Services page, selecting a service and submitting your requirements. Existing orders can be managed from your dashboard.",
      serious: false,
    };
  }

  if (
    text.includes("support") ||
    text.includes("help") ||
    text.includes("problem")
  ) {
    return {
      response:
        "You can create and manage support tickets from your dashboard. If your issue appears serious, I can also escalate it to the support team.",
      serious: false,
    };
  }

  if (
    text.includes("security") ||
    text.includes("vulnerability") ||
    text.includes("pentest") ||
    text.includes("penetration")
  ) {
    return {
      response:
        "Website security testing can help identify common security weaknesses, configuration problems and vulnerabilities. You can check the Website Security Testing service for more information.",
      serious: false,
    };
  }

  if (
    text.includes("bug") ||
    text.includes("testing") ||
    text.includes("test my website") ||
    text.includes("test my app")
  ) {
    return {
      response:
        "Sayan Tech Services offers website, application and Android testing. You can select the appropriate testing service and provide your requirements.",
      serious: false,
    };
  }

  if (
    text.includes("developer") ||
    text.includes("website") ||
    text.includes("web development") ||
    text.includes("build a website")
  ) {
    return {
      response:
        "Web development services are available for building websites based on your requirements. Visit the Services page to view the Web Development service and submit a request.",
      serious: false,
    };
  }

  return {
    response:
      "I can help you with Sayan Tech Services, including development, testing, cybersecurity, orders, pricing and support. Tell me what you need help with.",
    serious: false,
  };
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Please log in to use the AI assistant.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    const conversationId =
      typeof body.conversationId === "string"
        ? body.conversationId.trim()
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

    if (message.length > 2000) {
      return Response.json(
        {
          success: false,
          message: "Message is too long. Please keep it under 2000 characters.",
        },
        { status: 400 }
      );
    }

    let conversation = null;

    if (conversationId) {
      conversation = await prisma.aIConversation.findFirst({
        where: {
          id: conversationId,
          userId: user.userId,
        },
      });
    }

    if (!conversation) {
      conversation = await prisma.aIConversation.create({
        data: {
          userId: user.userId,
        },
      });
    }

    await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        senderType: "USER",
        message,
      },
    });

    const result = getAssistantResponse(message);

    await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        senderType: "AI",
        message: result.response,
      },
    });

    let ticketId: string | null = null;

    if (result.serious) {
      const existingTicket = await prisma.supportTicket.findFirst({
        where: {
          userId: user.userId,
          status: {
            in: [
              "OPEN",
              "IN_PROGRESS",
              "WAITING_FOR_CLIENT",
            ],
          },
          subject: "AI Assistant Escalation",
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (existingTicket) {
        ticketId = existingTicket.id;
      } else {
        const ticket = await prisma.supportTicket.create({
          data: {
            userId: user.userId,
            subject: "AI Assistant Escalation",
            description:
              "Automatically created after the AI assistant detected a potentially serious issue.",
            priority: "HIGH",
            messages: {
              create: {
                senderId: user.userId,
                senderType: "USER",
                message:
                  `Issue reported through AI Assistant:\n\n${message}`,
              },
            },
          },
        });

        ticketId = ticket.id;
      }

      await prisma.notification.create({
        data: {
          userId: user.userId,
          title: "Issue escalated to support",
          message:
            `Your issue has been escalated to the support team. Ticket ID: ${ticketId}`,
        },
      });

      const admins = await prisma.user.findMany({
        where: {
          role: "ADMIN",
        },
        select: {
          id: true,
        },
      });

      if (admins.length > 0) {
        await prisma.notification.createMany({
          data: admins.map((admin) => ({
            userId: admin.id,
            title: "AI issue escalation",
            message:
              `A potentially serious issue was reported through the AI assistant. Ticket ID: ${ticketId}`,
          })),
        });
      }
    }

    return Response.json({
      success: true,
      conversationId: conversation.id,
      response: result.response,
      escalated: result.serious,
      ticketId,
    });
  } catch (error) {
    console.error("AI chat error:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to process your message right now.",
      },
      { status: 500 }
    );
  }
}