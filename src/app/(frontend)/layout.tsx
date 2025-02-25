import { AppProvider } from "@/providers/app-provider";
import Link from "next/link";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <div>
        <div>
          <Link href="/">Home</Link>
          <Link href="/auth">Auth</Link>
          <Link href="/posts">Posts</Link>
        </div>
        {children}
      </div>
    </AppProvider>
  );
}
