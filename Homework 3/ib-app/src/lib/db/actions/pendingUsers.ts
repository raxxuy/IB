"use server";

import prisma from "..";
import { PendingUser } from "@prisma/client";
import { deleteAuthCode, getAuthCodeByUserId } from "./authCodes";

export async function createPendingUser(username: string, email: string, password: string, passwordSalt: string) {
  return await prisma.pendingUser.create({
    data: {
      username,
      email,
      password,
      passwordSalt,
    },
  });
}

export async function getPendingUserByUsername(username: string) {
  const pendingUser = await prisma.pendingUser.findUnique({ where: { username } });
  return validatePendingUser(pendingUser);
}

export async function getPendingUserByEmail(email: string) {
  const pendingUser = await prisma.pendingUser.findUnique({ where: { email } });
  return validatePendingUser(pendingUser);
}

export async function deletePendingUser(id: string) {
  return await prisma.pendingUser.delete({ where: { id } });
}

async function validatePendingUser(pendingUser: PendingUser | null) {
  if (!pendingUser) {
    return null;
  }

  const authCode = await getAuthCodeByUserId(pendingUser.id);

  if (!authCode) {
    await deletePendingUser(pendingUser.id);
    return null;
  }

  if (authCode.expiresAt < new Date()) {
    await deletePendingUser(pendingUser.id);
    await deleteAuthCode(authCode.id);
    return null;
  }

  return pendingUser;
}