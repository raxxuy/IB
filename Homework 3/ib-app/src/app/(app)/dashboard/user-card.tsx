"use client";

import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserCard() {
  const router = useRouter();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const fetchData = async () => {
      const token = document.cookie.split("=")[1];

      fetch("/api/auth/session", {
        headers: {
          Authorization: token
        }
      })
        .then((res) => res.json())
        .then((data) => setUser(data));
    };

    fetchData();
  }, []);

  const logout = () => {
    fetch("/api/auth/session", {
      method: "DELETE",
    });

    router.push("/");
  };

  if (!user) return (
    <div className="flex rounded-lg shadow-lg w-[300px] p-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">User Profile</h1>
        <p>Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="flex rounded-lg shadow-lg w-[300px] p-6">
      <div className="space-y-4 w-full">
        <h1 className="text-2xl font-bold">User Profile</h1>
        <div className="space-y-2">
          <div>
            <label className="form-label">Username</label>
            <p>{user.username}</p>
          </div>
          <div>
            <label className="form-label">Email</label>
            <p>{user?.email}</p>
          </div>
          <button className="form-button" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}