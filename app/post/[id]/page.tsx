"use client";

import { use, useEffect, useState } from "react";
import { getPost, type Post } from "../../lib/data";
import { getFeedPost } from "../../lib/store";
import { Phone, PostDetail } from "../../screens";

export default function Page({ params }: PageProps<"/post/[id]">) {
  const { id } = use(params);
  const seed = getPost(id);
  const [post, setPost] = useState<Post | undefined>(seed);
  const [ready, setReady] = useState(Boolean(seed));

  useEffect(() => {
    setPost(getFeedPost(id));
    setReady(true);
  }, [id]);

  if (!ready) {
    return (
      <Phone>
        <div className="h-full bg-bg" />
      </Phone>
    );
  }

  if (!post) {
    return (
      <Phone>
        <p className="p-8 text-body text-muted">Photo not found.</p>
      </Phone>
    );
  }

  return (
    <Phone>
      <PostDetail post={post} />
    </Phone>
  );
}
