"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";

// Simple session token for client portal (isolated from admin NextAuth)
function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function portalLogin(prevState: string | undefined, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return "Preencha todos os campos.";

  const contact = await prisma.clientContact.findFirst({
    where: { email, portalAccess: true },
    include: { client: true },
  });

  if (!contact) return "Acesso não encontrado. Verifique com a BlackDev.";

  // Simple password check (plain text for prototype, bcrypt in production)
  if (contact.passwordHash !== password) {
    return "Senha incorreta.";
  }

  // Create a portal session cookie
  const token = generateToken();
  const cookieStore = await cookies();
  cookieStore.set("portal_session", JSON.stringify({
    token,
    contactId: contact.id,
    clientId: contact.clientId,
    contactName: contact.name,
    clientName: contact.client.tradeName,
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/portal",
  });

  redirect("/portal");
}

export async function portalLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("portal_session");
  redirect("/portal/login");
}

export async function getPortalSession() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("portal_session");
  if (!raw?.value) return null;

  try {
    return JSON.parse(raw.value) as {
      token: string;
      contactId: string;
      clientId: string;
      contactName: string;
      clientName: string;
    };
  } catch {
    return null;
  }
}
