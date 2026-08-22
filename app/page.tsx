"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Preview, Saved, Upload } from "./screens";
import { savePost } from "./lib/store";

export default function Page() {
  const router = useRouter();
  const [photo, setPhoto] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const keep = () => {
    if (!photo) return;
    savePost({
      id: `live-${Date.now()}`,
      photo,
      day: 0,
      description: "",
      tags: [],
      replies: [],
    });
    setSaved(true);
  };

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => router.push("/archive"), 900);
    return () => clearTimeout(t);
  }, [saved, router]);

  return (
    <Phone>
      {saved && photo ? (
        <Saved photo={photo} />
      ) : photo ? (
        <Preview photo={photo} onKeep={keep} onRetake={() => setPhoto(null)} />
      ) : (
        <Upload onPick={setPhoto} />
      )}
    </Phone>
  );
}
