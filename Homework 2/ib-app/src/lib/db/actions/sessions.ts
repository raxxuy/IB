"use server";

import prisma from "..";

export async function createSession(userId: string, token: string, expiresAt: Date) {
  return await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });
}

export async function getSessionByToken(token: string) {
  const session = await prisma.session.findUnique({ where: { token } });
  return validateSession(session);
}

export async function deleteSession(id: string) {
  return await prisma.session.delete({ where: { id } });
}

export async function getSessionByUserId(userId: string) {
  const session = await prisma.session.findUnique({ where: { userId } });
  return validateSession(session);
}

async function validateSession(session: any) {
  if (!session) {
    return null;
  }

  if (session.expiresAt < new Date()) {
    await deleteSession(session.id);
    return null;
  }

  return session;
}
