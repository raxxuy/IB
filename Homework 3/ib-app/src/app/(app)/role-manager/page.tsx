"use client";

import { User } from "@prisma/client";
import { FormEvent, useState, useEffect } from "react";

enum Role {
  Admin = "ADMIN",
  User = "USER",
  SuperAdmin = "SUPER_ADMIN",
}

export default function RoleManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    fetch("/api/roles/assign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: selectedUser, role: selectedRole }),
    })
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Role Manager</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="user" className="form-label">User</label>
          <select
            id="user"
            name="user"
            value={selectedUser}
            onChange={e => setSelectedUser(e.target.value)}
            className="form-input h-8 text-sm"
            aria-label="Select User"
          >
            <option value="" disabled>Select User</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.email}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="role" className="form-label">Role</label>
          <select
            id="role"
            name="role"
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value)}
            className="form-input h-8 text-sm"
            aria-label="Select Role"
          >
            <option value="" disabled>Select Role</option>
            {Object.values(Role).map((role) => (
              <option key={role} value={role}>
                {role.charAt(0) + role.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="form-button"
        >
          Assign Role
        </button>
        {message && <p className="text-green-500 text-center mt-4">{message}</p>}
      </form>
    </div>
  );
}
