"use server";

import { Resource, ResourceRole } from "@prisma/client";
import prisma from "..";

export async function createResource(name: string, organizationId: string) {
  return await prisma.resource.create({
    data: {
      name,
      organizationId,
    },
  });
}

export async function getResourcesByOrganization(organizationId: string) {
  return await prisma.resource.findMany({
    where: { organizationId }
  });
}

export async function getResourceById(id: string) {
  return await prisma.resource.findUnique({ where: { id } });
}

export async function updateResource(id: string, data: Partial<Resource>) {
  return await prisma.resource.update({ where: { id }, data });
}

export async function deleteResource(id: string) {
  return await prisma.resource.delete({ where: { id } });
}

// Resource Access

export async function createResourceAccess(
  resourceId: string,
  memberId: string,
  role: ResourceRole,
) {
  return await prisma.resourceAccess.create({
    data: {
      resourceId,
      memberId,
      role,
    },
  });
}

export async function getResourceAccess(resourceId: string, memberId: string) {
  return await prisma.resourceAccess.findUnique({
    where: {
      resourceId_memberId: {
        resourceId,
        memberId,
      },
    },
  });
}

export async function deleteResourceAccess(id: string) {
  return await prisma.resourceAccess.delete({ where: { id } });
}

export async function updateResourceAccess(resourceId: string, memberId: string, role: ResourceRole, expiresAt?: Date) {
  return await prisma.resourceAccess.upsert({
    where: {
      resourceId_memberId: {
        resourceId,
        memberId
      }
    },
    update: {
      role,
      expiresAt
    },
    create: {
      resourceId,
      memberId,
      role,
      expiresAt
    }
  });
}