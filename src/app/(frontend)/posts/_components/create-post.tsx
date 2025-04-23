"use client";

import { client } from "@/lib/hono/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const CreatePost = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = async () => {
    const res = await client.api.posts.$post({
      json: { title, body, public: true },
    });

    if (!res.ok) {
      const error = await res.json();

      throw new Error(JSON.stringify(error, null, 2));
    }

    setTitle("");
    setBody("");

    router.refresh();
  };

  return (
    <form>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="border" />
      <input type="text" value={body} onChange={(e) => setBody(e.target.value)} className="border" />
      <button type="button" onClick={handleSubmit}>
        Create post
      </button>
    </form>
  );
};
