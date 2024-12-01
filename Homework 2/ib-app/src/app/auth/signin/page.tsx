"use client";

import AuthenticationCard from "@/components/authentication-card";
import BackButton from "@/components/back-button";
import SigninForm from "./signin-form";
import { useState } from "react";

export default function Signin() {
  const [view, setView] = useState<"signin" | "verify">("signin");
  const [email, setEmail] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md space-y-2">
        {view === "signin" ?
          <SigninForm
            setView={setView}
            setEmail={setEmail}
          />
        :
          <>
            <BackButton action={() => setView("signin")} />
            <AuthenticationCard
              title="Authenticate your account"
              description="Check your email for an authentication code. The code will expire in 5 minutes."
              email={email}
            />
          </>
        }
      </div>
    </div>
  );
}
