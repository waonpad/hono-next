import "@/styles/globals.css";
import { clientEnv } from "@/config/env/client";
import { AppProvider } from "@/providers/app-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

const intr = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: clientEnv.NEXT_PUBLIC_APP_NAME,
    template: `%s | ${clientEnv.NEXT_PUBLIC_APP_NAME}`,
  },
  description: "",
  metadataBase: new URL(clientEnv.NEXT_PUBLIC_HOST_URL),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${intr.className}`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
