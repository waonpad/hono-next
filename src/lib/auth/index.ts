import { serverEnv } from "@/config/env/server";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { GitHub } from "arctic";
import { Lucia } from "lucia";
import { prisma } from "../prisma/client";

export const github = new GitHub(serverEnv.GITHUB_CLIENT_ID, serverEnv.GITHUB_CLIENT_SECRET);

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    // this sets cookies with super long expiration
    // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
    expires: false,
    attributes: {
      // set to `true` when using HTTPS
      secure: serverEnv.APP_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      // attributes has the type of DatabaseUserAttributes
      githubId: attributes.githubId,
      name: attributes.name,
    };
  },
});

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  githubId: number;
  name: string;
}
