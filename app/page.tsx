"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Describe, Phone, Upload } from "./screens";
import { savePost } from "./lib/store";

export default function Page() {
  const router = useRouter();
  const [photo, setPhoto] = useState<string | null>(null);

  const save = (info: { description: string; tags: string[]; caption: string }) => {
    if (!photo) return;
    savePost({
      id: `live-${Date.now()}`,
      photo,
      day: 0,
      caption: info.caption || undefined,
      description: info.description,
      tags: info.tags,
      replies: [],
    });
    router.push("/archive");
  };

  return (
    <Phone>
      {photo ? <Describe photo={photo} onSave={save} /> : <Upload onPick={setPhoto} />}
    </Phone>
  );
}
