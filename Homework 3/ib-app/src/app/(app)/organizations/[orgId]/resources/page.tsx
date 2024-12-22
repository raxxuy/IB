"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Resource } from "@prisma/client"
import ResourceForm from "@/components/resource-form"

export default function ResourcesPage() {
  const { orgId } = useParams()
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/resources?organizationId=${orgId}`, {
      method: "GET",
    })
      .then(res => res.json())
      .then(data => {
        setResources(data);
        setIsLoading(false);
      });
  }, [orgId]);

  const handleCreateResource = async (name: string) => {
    const response = await fetch("/api/resources", {
      method: "POST",
      body: JSON.stringify({
        name,
        organizationId: orgId
      })
    });

    if (response.ok) {
      const newResource = await response.json()
      setResources(prev => [...prev, newResource])
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Resources</h1>
        <ResourceForm onSubmit={handleCreateResource} />
      </div>

      <div className="grid gap-4">
        {resources.map((resource) => (
          <Link
            key={resource.id}
            href={`/organizations/${orgId}/resources/${resource.id}/access`}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{resource.name}</h2>
                <p className="text-sm text-gray-600">
                  Created: {new Date(resource.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className="text-blue-500 hover:text-blue-600">
                Manage Access
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}