"use server";

import { OrgMember, OrganizationRole } from "@prisma/client";
import prisma from "..";

export async function createOrgMember(userId: string, organizationId: string, role?: OrganizationRole) {
  return await prisma.orgMember.create({
    data: {
      userId,
      organizationId,
      role,
    },
  });
}

export async function getOrgMembers(organizationId: string) {
  return await prisma.orgMember.findMany({ where: { organizationId } });
}

export async function getOrgMemberById(id: string) {
  return await prisma.orgMember.findUnique({ where: { id } });
}

export async function getOrgMemberByUserAndOrganization(
  userId: string,
  organizationId: string,
) {
  return await prisma.orgMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  });
}

export async function updateOrgMember(id: string, data: Partial<OrgMember>) {
  return await prisma.orgMember.update({
    where: { id },
    data,
  });
}

export async function updateOrgMemberRole(id: string, role: OrganizationRole) {
  return await prisma.orgMember.update({
    where: { id },
    data: { role },
  });
}

export async function deleteOrgMember(id: string) {
  return await prisma.orgMember.delete({ where: { id } });
}
