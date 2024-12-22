import { getOrgMemberByUserAndOrganization } from "@/lib/db/actions/orgMembers";
import { getResourceAccess, getResourceById } from "@/lib/db/actions/resources";
import { getSessionByToken } from "@/lib/db/actions/sessions";
import { ResourceRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest, 
  { params }: { 
    params: Promise<{ 
      resourceId: string
    }> 
  }
) {
  const token = request.cookies.get("token")?.value;
  const { resourceId } = await params;

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
  )

  if (!orgMember) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const resourceAccess = await getResourceAccess(resourceId, orgMember.id);

  return NextResponse.json({
    resource,
    access: resourceAccess?.role || ResourceRole.NONE,
    expiresAt: resourceAccess?.expiresAt || null
  });
}