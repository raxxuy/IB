"use client";

import AuthenticationCard from "@/components/authentication-card";
import BackButton from "@/components/back-button";
import SignupForm from "./signup-form";
import { useState } from "react";

export default function Signup() {
  const [view, setView] = useState<"signup" | "verify">("signup");
  const [email, setEmail] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md space-y-2">
        {view === "signup" ?
          <SignupForm
            setView={setView}
            setEmail={setEmail}
          />
        :
          <>
            <BackButton action={() => setView("signup")} />
            <AuthenticationCard
              title="Verify your email"
              description="Check your email for a verification code. The code will expire in 5 minutes."
              email={email}
            />
          </>
        }
      </div>
    </div>
  );
}