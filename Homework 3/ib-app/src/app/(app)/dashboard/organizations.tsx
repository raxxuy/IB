import type { Organization, OrgMember } from "@prisma/client";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

interface OrganizationWithMembers extends Organization {
  members: OrgMember[];
}

export default function Organizations() {
  const [organizationName, setOrganizationName] = useState<string>("");
  const [organizationId, setOrganizationId] = useState<string>("");
  const [error1, setError1] = useState<string | null>(null);
  const [error2, setError2] = useState<string | null>(null);
  const [organizations, setOrganizations] = useState<OrganizationWithMembers[] | null>(null);

  const handleCreateOrganization = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError1(null);
    setError2(null);

    const response = await fetch("/api/organizations", {
      method: "POST",
      body: JSON.stringify({ name: organizationName }),
    });

    if (response.ok) {
      fetchOrganizations();
    } else {
      const data = await response.json();
      setError1(data.error);
    }
  };

  const handleJoinOrganization = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError1(null);
    setError2(null);

    const response = await fetch("/api/organizations/join", {
      method: "POST",
      body: JSON.stringify({ id: organizationId }),
    });

    if (response.ok) {
      fetchOrganizations();
    } else {
      const data = await response.json();
      setError2(data.error);
    }
  };  

  const fetchOrganizations = async () => {
    const response = await fetch("/api/organizations");
    const data = await response.json();
    setOrganizations(data);
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleCreateOrganization} className="space-y-4">
          <h2 className="text-xl font-semibold">Create a New Organization</h2>
          <p className="text-gray-600">Manage your projects and team members by creating a new organization.</p>
          <div>
            <label htmlFor="organizationName" className="form-label block mb-1">
              Organization Name
            </label>
            <input
              type="text"
              id="organizationName"
              name="organizationName"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              className="form-input w-full"
            />
          </div>
          <button className="form-button w-full" type="submit">Create Organization</button>
          {error1 && <p className="text-red-500">{error1}</p>}
        </form>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleJoinOrganization} className="space-y-4">
          <h2 className="text-xl font-semibold">Join an Organization</h2>
          <p className="text-gray-600">Join an existing organization to manage your projects and team members.</p>
          <div>
            <label htmlFor="organizationId" className="form-label block mb-1">
              Organization ID
            </label>
            <input
              type="text"
              id="organizationId"
              name="organizationId"
              value={organizationId}
              onChange={(e) => setOrganizationId(e.target.value)}
              className="form-input w-full"
            />
          </div>
          <button className="form-button w-full" type="submit">Join Organization</button>
          {error2 && <p className="text-red-500">{error2}</p>}
        </form>
      </div>
      
      <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Your Organizations</h1>
          {organizations ? (
            organizations.length > 0 ? (
              <div className="space-y-2">
                {organizations.map((org: OrganizationWithMembers) => (
                  <div key={org.id} className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-base font-medium">{org.name} <span className="text-gray-500">({org.members.length} members)</span></h2>
                    <Link href={`/organizations/${org.id}`} className="text-blue-500 hover:underline">View</Link>
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-600">No organizations found.</p>
          ) : (
            <p className="text-gray-600">Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}