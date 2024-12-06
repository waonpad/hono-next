import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default async function Page() {
  return (
    <div>
      <h1>/</h1>
      <Link href="/api/auth/login/github" prefetch={false}>
        Login with GitHub
      </Link>
    </div>
  );
}
