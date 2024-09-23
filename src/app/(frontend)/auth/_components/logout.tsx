"use client";

import { client } from "@/lib/hono/client";

export const Logout = () => {
  const handleClick = async () => {
    await client.api.auth.logout.$post();

    if (location) {
      window.location.href = "/";
    }
  };

  return (
    <button onClick={handleClick} type="button">
      Logout
    </button>
  );
};
