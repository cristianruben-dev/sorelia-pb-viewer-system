import { redirect } from "next/navigation";
import { getSessionByToken, getSessionToken, deleteSessionCookie, type Session, type AuthUser } from "./auth";

export async function getServerSession(): Promise<Session | null> {
  try {
    const token = await getSessionToken();
    if (!token) return null;

    const session = await getSessionByToken(token);

    // Si la sesión está expirada, eliminar cookie y retornar null
    if (!session) {
      await deleteSessionCookie();
      return null;
    }

    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

export async function getCurrentUser(): Promise<AuthUser> {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  return session.user;
}

export async function requireAuth(): Promise<Session> {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user.role.includes("admin")) {
    redirect("/dashboard");
  }

  return user;
}
