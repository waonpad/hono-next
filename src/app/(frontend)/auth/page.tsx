import Link from "next/link";
import { Logout } from "./_components/logout";

export default async function Page() {
  return (
    <div>
      <h1>auth</h1>
      <Link href="/api/auth/login/github" prefetch={false}>
        Login with GitHub
      </Link>
      <Logout />
    </div>
  );
}
