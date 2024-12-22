import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

interface AuthenticationCardProps {
  title: string;
  description: string;
  email: string | null;
}

export default function AuthenticationCard({
  title,
  description,
  email,
}: AuthenticationCardProps) {
  const router = useRouter(); 
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      setSubmitting(true);

      const response = await fetch("/api/auth/verify", {
        method: "POST",
        body: JSON.stringify({ email, code }),
      });

      if (!response.ok) {
        throw new Error("Failed to verify code");
      }

      const { token, expiryDate } = await response.json();

      setSubmitting(false);

      if (token) {
        document.cookie = `token=${token}; path=/; expires=${new Date(expiryDate).toUTCString()}`;
      }

      router.push("/");
    } catch (error) {
      console.error(error);
      setError("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">{title}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p>{description}</p>
        <div>
          <label htmlFor="code" className="form-label">
            Code
          </label>
          <input
            type="text"
            id="username"
            name="code"
            value={code}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="form-button"
          disabled={submitting}
        >
          {submitting ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}
