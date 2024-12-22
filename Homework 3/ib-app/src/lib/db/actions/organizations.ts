"use server";

import prisma from "..";

export async function createOrganization(name: string) {
  return await prisma.organization.create({ data: { name } });
}

export async function getOrganizations() {
  return await prisma.organization.findMany();
}

export async function getOrganizationsByUserId(userId: string) {
  return await prisma.organization.findMany({
    where: {
      members: {
        some: {
          userId
        }
      }
    },
    include: {
      members: true
    }
  });
}

export async function getOrganizationById(id: string) {
  return await prisma.organization.findUnique({
    where: { id },
    include: {
      members: {
        include: {
          user: true
        }
      }
    }
  });
}

export async function deleteOrganization(id: string) {
  return await prisma.organization.delete({ where: { id } });
}