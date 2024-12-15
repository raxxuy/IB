"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    const checkSession = async () => {
      const token = document.cookie.split("; ")[0];
      
      if (token) {
        const response = await fetch("/api/session", {
          headers: {
            Authorization: token
          }
        });

        if (response.ok) {
          router.push("/dashboard");
        }
      }
    };

    checkSession();
  }, [router]);

  return (
    <div className="w-full h-screen bg-gray-50">
      <div className="flex font-[family-name:var(--font-geist-sans)] justify-end bg-white gap-4 p-4 shadow-lg">
        <Link href="/auth/signin" className="home-button">
          Sign in
        </Link>
        <Link href="/auth/signup" className="home-button">
          Sign up
        </Link>
      </div>
    </div>
  );
}
