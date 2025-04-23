import type { postSchema } from "@/app/api/[[...route]]/_/posts/schemas";
import Link from "next/link";

export const PostListItem = ({ post }: { post: typeof postSchema._type }) => {
  return (
    <article>
      <div>
        <Link href={`/posts/${post.id}`}>
          <h2 className="text-xl">{post.title}</h2>
        </Link>
      </div>
      <p>{post.body}</p>
      <p>
        {post.createdAt}, {post.updatedAt}
      </p>
    </article>
  );
};
