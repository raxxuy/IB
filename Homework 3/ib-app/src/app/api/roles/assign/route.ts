import { getUserById, updateUserRole } from "@/lib/db/actions/users";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const { userId, role } = body;

  const user = await getUserById(userId);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await updateUserRole(userId, role);

  return NextResponse.json({ message: "Role assigned successfully" });
} 