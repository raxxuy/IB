import { getOrgMemberByUserAndOrganization } from "@/lib/db/actions/orgMembers";
import { getResourceById, updateResourceAccess } from "@/lib/db/actions/resources";
import { getSessionByToken } from "@/lib/db/actions/sessions";
import { ResourceRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: {
    params: Promise<{
      resourceId: string;
      memberId: string;
    }>
  }
) {
  const token = request.cookies.get("token")?.value;
  const { resourceId, memberId } = await params;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await getSessionByToken(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role, expiresAt } = await request.json();

  if (!role || !Object.values(ResourceRole).includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const resource = await getResourceById(resourceId);

  if (!resource) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }

  const orgMember = await getOrgMemberByUserAndOrganization(
    session.userId,
    resource.organizationId
  );

  if (!orgMember || !["OWNER", "ADMIN"].includes(orgMember.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const access = await updateResourceAccess(
    resourceId,
    memberId,
    role,
    expiresAt ? new Date(expiresAt) : new Date(Date.now() + 10 * 60 * 1000)
  );

  return NextResponse.json(access);
}

export async function DELETE(
  request: NextRequest,
  { params }: {
    params: {
      resourceId: string;
      memberId: string;
    }
  }
) {
  const token = request.cookies.get("token")?.value;
  const { resourceId, memberId } = params;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await getSessionByToken(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resource = await getResourceById(resourceId);

  if (!resource) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }

  const orgMember = await getOrgMemberByUserAndOrganization(
    session.userId,
    resource.organizationId
  );

  if (!orgMember || !["OWNER", "ADMIN"].includes(orgMember.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await updateResourceAccess(
    resourceId,
    memberId,
    ResourceRole.NONE,
    undefined
  )

  return NextResponse.json({ success: true });
}