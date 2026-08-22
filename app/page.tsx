"use client";

import { useState } from "react";
import { AddContext, Generating, Phone, PostDetail, Upload } from "./screens";
import { describe, type Post } from "./lib/data";

export default function Page() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [generating, setGenerating] = useState(false);

  // ponytail: canned description on a timer. One vision call replaces both.
  const generate = (caption: string) => {
    setGenerating(true);
    setTimeout(() => {
      setPost({ id: "live", photo: photo!, day: 0, caption: caption || undefined, replies: [], ...describe() });
      setGenerating(false);
    }, 2200);
  };

  return (
    <Phone>
      {post ? (
        <PostDetail post={post} backHref="/" />
      ) : generating && photo ? (
        <Generating photo={photo} />
      ) : photo ? (
        <AddContext photo={photo} onContinue={generate} onSkip={() => generate("")} />
      ) : (
        <Upload onPick={setPhoto} />
      )}
    </Phone>
  );
}
