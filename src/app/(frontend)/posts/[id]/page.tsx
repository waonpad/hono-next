import { client } from "@/lib/hono/client";

export default async function Page({ params }: { params: { id: string } }) {
  const res = await client.api.posts[":id"].$get({ param: { id: params.id } });

  if (!res.ok) {
    const error = await res.json();

    throw new Error(JSON.stringify(error, null, 2));
  }

  const post = await res.json();

  return (
    <div>
      <h1 className="text-2xl">{post.title}</h1>
      <p>{post.body}</p>
    </div>
  );
}
