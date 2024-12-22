"use server";

import prisma from "..";
import { AuthCode } from "@prisma/client";

export async function createAuthCode(userId: string, code: string, type: string, expiresAt: Date) {
  return await prisma.authCode.create({
    data: {
      userId,
      code,
      type,
      expiresAt,
    },
  });
}

export async function getAuthCodeById(id: string) {
  const authCode = await prisma.authCode.findUnique({ where: { id } });
  return validateAuthCode(authCode);
}

export async function getAuthCodeByUserId(userId: string) {
  const authCode = await prisma.authCode.findUnique({ where: { userId } });
  return validateAuthCode(authCode);
}

export async function getAuthCodeByUserIdAndType(userId: string, type: string) {
  const authCode = await prisma.authCode.findUnique({ where: { userId, type } });
  return validateAuthCode(authCode);
}

export async function deleteAuthCode(id: string) {
  return await prisma.authCode.delete({ where: { id } });
}

async function validateAuthCode(authCode: AuthCode | null) {
  if (!authCode) {
    return null;
  }

  if (authCode.expiresAt < new Date()) {
    await deleteAuthCode(authCode.id);
    return null;
  }

  return authCode;
}
