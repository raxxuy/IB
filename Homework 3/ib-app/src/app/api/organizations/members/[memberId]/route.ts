import { updateOrgMemberRole } from "@/lib/db/actions/orgMembers";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: Promise<{ memberId: string }> }) {
  const { memberId } = await params;
  const { role } = await request.json();
  const updatedMember = await updateOrgMemberRole(memberId, role);
  return NextResponse.json(updatedMember);
}
