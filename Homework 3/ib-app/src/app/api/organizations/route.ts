import { createOrganization } from "@/lib/db/actions/organizations";
import { createOrgMember } from "@/lib/db/actions/orgMembers";
import { getSessionByToken } from "@/lib/db/actions/sessions";
import { getOrganizationsByUserId } from "@/lib/db/actions/organizations";
import { OrganizationRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await getSessionByToken(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const organizations = await getOrganizationsByUserId(session.userId);

  return NextResponse.json(organizations);
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { name } = await request.json();

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await getSessionByToken(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const userId = session.userId;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const organization = await createOrganization(name);
  await createOrgMember(userId, organization.id, OrganizationRole.OWNER);

  return NextResponse.json(organization, { status: 201 });
}
