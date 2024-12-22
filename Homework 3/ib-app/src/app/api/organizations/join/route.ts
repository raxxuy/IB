import { getOrganizationById } from "@/lib/db/actions/organizations";
import { createOrgMember, getOrgMemberByUserAndOrganization } from "@/lib/db/actions/orgMembers";
import { getSessionByToken } from "@/lib/db/actions/sessions";
import { OrganizationRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { id } = await request.json();

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await getSessionByToken(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.userId;
  
  if (!id) {
    return NextResponse.json({ error: "Organization ID is required" }, { status: 400 });
  }

  const organization = await getOrganizationById(id);

  if (!organization) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  }

  const existingMember = await getOrgMemberByUserAndOrganization(userId, organization.id);

  if (existingMember) {
    return NextResponse.json({ error: "User already a member of this organization" }, { status: 400 });
  }

  await createOrgMember(userId, organization.id, OrganizationRole.MEMBER);
  return NextResponse.json(organization);
}