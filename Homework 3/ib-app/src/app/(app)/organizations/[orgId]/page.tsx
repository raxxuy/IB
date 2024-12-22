"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Organization, OrgMember, User, Resource } from "@prisma/client";
import { OrganizationRole } from "@prisma/client";
import Link from "next/link";

interface OrgMemberWithUser extends OrgMember {
  user: User;
}

interface OrganizationWithMembers extends Organization {
  members: OrgMemberWithUser[];
}

export default function Organization() {
  const { orgId } = useParams();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<OrganizationWithMembers | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    fetch(`/api/organizations/${orgId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setOrganization(data);
      });

    const token = document.cookie.split("=")[1];

    fetch(`/api/auth/session`, {
      headers: {
        Authorization: token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCurrentUser(data);
      });

    fetch(`/api/resources?organizationId=${orgId}`)
      .then((res) => res.json())
      .then((data) => {
        setResources(data);
      });
  }, [orgId]);

  const handleRoleChange = async (memberId: string, newRole: string) => {
    const response = await fetch(`/api/organizations/${orgId}/members/${memberId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: newRole }),
    });

    if (response.ok) {
      setOrganization((prevOrg) => {
        if (!prevOrg) return prevOrg;
        return {
          ...prevOrg,
          members: prevOrg.members.map((member) =>
            member.id === memberId ? { ...member, role: newRole as OrganizationRole } : member
          ),
        };
      });
    }
  };

  if (!organization) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{organization.name}</h1>
      
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-semibold">Resources</h2>
          <Link 
            href={`/organizations/${orgId}/resources`}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Manage Resources
          </Link>
        </div>
        <div className="space-y-2">
          {resources.length === 0 ? (
            <p className="text-gray-500">No resources yet</p>
          ) : (
            <ul className="space-y-2">
              {resources.map((resource) => (
                <li key={resource.id} className="flex items-center justify-between border-b pb-2">
                  <span className="text-lg">{resource.name}</span>
                  <Link
                    href={`/organizations/${orgId}/resources/${resource.id}/access`}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Manage Access
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-2xl font-semibold mb-2">Members</h2>
        <ul className="space-y-2">
          {organization.members.map((member) => (
            <li key={member.id} className="flex items-center space-x-2">
              <span className="text-lg">{member.user.username} - {member.role.charAt(0).toUpperCase() + member.role.slice(1).toLowerCase()}</span>
              {member.role !== OrganizationRole.OWNER && currentUser?.id !== member.user.id && (
                <select className="form-select" value={member.role} onChange={(e) => handleRoleChange(member.id, e.target.value)}>
                  <option value={OrganizationRole.OWNER}>Owner</option>
                  <option value={OrganizationRole.ADMIN}>Admin</option>
                  <option value={OrganizationRole.MEMBER}>Member</option>
                </select>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}