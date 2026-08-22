"use client";

import { useState } from "react";
import { Explain, Phone, PostDetail, Upload } from "./screens";
import { type Post } from "./lib/data";
import { savePost } from "./lib/store";

export default function Page() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [post, setPost] = useState<Post | null>(null);

  const keep = (note: string, info: { description: string; tags: string[] }) => {
    const next: Post = {
      id: `live-${Date.now()}`,
      photo: photo!,
      day: 0,
      caption: note.trim() || undefined,
      replies: [],
      ...info,
    };
    savePost(next);
    setPost(next);
  };

  return (
    <Phone>
      {post ? (
        <PostDetail post={post} backHref="/archive" />
      ) : photo ? (
        <Explain photo={photo} onKeep={keep} onRetake={() => setPhoto(null)} />
      ) : (
        <Upload onPick={setPhoto} />
      )}
    </Phone>
  );
}
