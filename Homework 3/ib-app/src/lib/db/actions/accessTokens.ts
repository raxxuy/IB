"use server";

import prisma from "..";
import { AccessToken } from "@prisma/client";

export async function createAccessToken(userId: string, token: string, expiresAt: Date, organizationId?: string, resourceId?: string) {
  return await prisma.accessToken.create({
    data: {
      userId,
      token,
      organizationId,
      resourceId,
      expiresAt,
    },
  });
}

export async function getAccessTokenById(id: string) {
  const accessToken = await prisma.accessToken.findUnique({ where: { id } });
  return validateAccessToken(accessToken);
}

export async function getAccessTokenByToken(token: string) {
  const accessToken = await prisma.accessToken.findUnique({ where: { token } });
  return validateAccessToken(accessToken);
}

export async function getAccessTokenByUserAndOrganization(
  userId: string,
  organizationId: string,
) {
  const accessToken = await prisma.accessToken.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  });
  return validateAccessToken(accessToken);
} 

export async function getAccessTokenByUserAndResource(
  userId: string,
  resourceId: string,
) {
  const accessToken = await prisma.accessToken.findUnique({
    where: {
      userId_resourceId: {
        userId,
        resourceId,
      },
    },
  });
  return validateAccessToken(accessToken);
}

export async function deleteAccessToken(id: string) {
  return await prisma.accessToken.delete({ where: { id } });
}

export async function validateAccessToken(accessToken: AccessToken | null) {
  if (!accessToken) {
    return null;
  }

  if (accessToken.expiresAt < new Date()) {
    await deleteAccessToken(accessToken.id);
    return null;
  }

  return accessToken;
}
