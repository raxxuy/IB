import { getOrgMemberByUserAndOrganization } from "@/lib/db/actions/orgMembers";
import { createResource, getResourcesByOrganization } from "@/lib/db/actions/resources";
import { getSessionByToken } from "@/lib/db/actions/sessions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await getSessionByToken(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, organizationId } = await request.json();

  if (!name || !organizationId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const orgMember = await getOrgMemberByUserAndOrganization(
    session.userId,
    organizationId
  );

  if (!orgMember || !["OWNER", "ADMIN"].includes(orgMember.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const resource = createResource(name, organizationId);

  return NextResponse.json(resource);
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { searchParams } = new URL(request.url);
  const organizationId = searchParams.get("organizationId");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!organizationId) {
    return NextResponse.json({ error: "Missing organizationId" }, { status: 400 });
  }

  const session = await getSessionByToken(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orgMember = await getOrgMemberByUserAndOrganization(
    session.userId,
    organizationId
  );

  if (!orgMember) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const resources = await getResourcesByOrganization(organizationId);

  return NextResponse.json(resources);
} 