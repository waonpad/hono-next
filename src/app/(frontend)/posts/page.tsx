import { client } from "@/lib/hono/client";
import { CreatePost } from "./_components/create-post";
import { PostListItem } from "./_components/post-list-item";

export const dynamic = "force-dynamic";

export default async function Page() {
  const res = await client.api.posts.$get({
    query: {
      limit: "10",
      order: "desc",
    },
  });

  if (!res.ok) {
    const error = await res.json();

    throw new Error(JSON.stringify(error, null, 2));
  }

  const posts = await res.json();

  return (
    <div>
      <CreatePost />
      <ul className="space-y-4">
        {posts.data.items.map((post) => (
          <PostListItem key={post.id} post={post} />
        ))}
      </ul>
    </div>
  );
}
