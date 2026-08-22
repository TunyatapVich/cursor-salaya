"use client";

import { use, useSyncExternalStore } from "react";
import { getPost } from "../../lib/data";
import { getFeedPost } from "../../lib/store";
import { Phone, PostDetail } from "../../screens";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("saved-posts-changed", onStoreChange);
  return () => window.removeEventListener("saved-posts-changed", onStoreChange);
}

export default function Page({ params }: PageProps<"/post/[id]">) {
  const { id } = use(params);
  const post = useSyncExternalStore(
    subscribe,
    () => getFeedPost(id),
    () => getPost(id),
  );

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
