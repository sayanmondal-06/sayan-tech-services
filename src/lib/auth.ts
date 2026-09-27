import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";

export type AuthUser = {
  id: string;
  userId: string;
  email: string;
  name?: string | null;
  role?: string | null;
};

function getSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return new TextEncoder().encode(secret);
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, getSecret());

    const userId = payload.userId
      ? String(payload.userId)
      : payload.sub
        ? String(payload.sub)
        : null;

    if (!userId || !payload.email) {
      return null;
    }

    return {
      id: userId,
      userId: userId,
      email: String(payload.email),
      name: payload.name ? String(payload.name) : null,
      role: payload.role ? String(payload.role) : null,
    };
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireAuth();

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return user;
}