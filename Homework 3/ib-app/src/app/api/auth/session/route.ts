import { deleteSession, getSessionByToken } from "@/lib/db/actions/sessions";
import { getUserById } from "@/lib/db/actions/users";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.headers.get("Authorization");
  
  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  const session = await getSessionByToken(token);

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const user = await getUserById(session.userId);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function DELETE(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  const session = await getSessionByToken(token);

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  await deleteSession(session.id);

  const response = NextResponse.json({ message: "Session deleted successfully" });

  response.cookies.set("token", "", {
    expires: new Date(0),
    path: "/",
  });

  return response;
}
