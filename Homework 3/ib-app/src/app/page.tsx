import Link from "next/link";

export default function Home() {
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
