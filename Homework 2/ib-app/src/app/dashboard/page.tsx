"use client";

import { deleteSession, getSessionByUserId } from "@/lib/db/actions/sessions";
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

  const logout = async () => {
    document.cookie = `token=; path=/;`;
    const session = await getSessionByUserId(user!.id);
    if (session) {
      await deleteSession(session.id);
    }
    router.push("/");
  };

  return (
    <div>
      {user ? (
        <>
          <h1>{user.username}</h1>
          <p>{user.email}</p>
          <p>{user.createdAt.toString()}</p>
          <p>{user.updatedAt.toString()}</p>
          <button onClick={() => logout()}>Logout</button>
        </>
      ) : (
        <h1>Not logged in</h1>
      )}
    </div>
  );
}
