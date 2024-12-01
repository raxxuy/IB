"use client";

import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  useEffect(() => {
    fetch("/api/session", {
      headers: {
        Authorization: document.cookie.split("; ")[0],
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  const logout = () => {
    document.cookie = `token=; path=/;`;
    router.push("/");
  };

  return (
    <div>
      <h1>{user?.username}</h1>
      <p>{user?.email}</p>
      <p>{user?.createdAt.toString()}</p>
      <p>{user?.updatedAt.toString()}</p>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}
