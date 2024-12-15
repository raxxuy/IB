"use server";

import prisma from "..";

export async function createUser(username: string, email: string, password: string, passwordSalt: string) {
  return await prisma.user.create({ data: { username, email, password, passwordSalt } });
}

export async function getUsers() {
  return await prisma.user.findMany();
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({ where: { id } });
}

export async function getUserByUsername(username: string) {
  return await prisma.user.findUnique({ where: { username } });
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({ where: { email } });
}

export async function deleteUser(id: string) {
  return await prisma.user.delete({ where: { id } });
}
