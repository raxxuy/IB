"use client";

import UserCard from "./user-card";
import Organizations from "./organizations";

export default function Dashboard() {
  return (
    <div className="bg-gray-50 p-6 min-h-screen flex flex-col items-center">
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl">
        <div className="flex-1">
          <UserCard />
        </div>
        <div className="flex-2">
          <Organizations />
        </div>
      </div>
    </div>
  );
}
