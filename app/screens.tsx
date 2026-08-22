"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import {
  COMMON_TAGS,
  GALLERY,
  QUICK_REPLIES,
  type Period,
  type Post,
  type Reply,
  describePhoto,
  groupPosts,
  hasUnread,
  posts as allPosts,
  replyCount,
  topTags,
  withinPeriod,
} from "./lib/data";
import { loadSaved, savePost } from "./lib/store";

/* ---------- frame ---------- */

export function Phone({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative mx-auto w-[390px] max-w-full overflow-hidden bg-bg text-ink ${
        className ?? "h-full"
      }`}
    >
      {children}
    </div>
  );
}

const Screen = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-full flex-col">{children}</div>
);

/* ---------- shared bits ---------- */

function Chip({
  children,
  onClick,
  tone = "tint",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  tone?: "tint" | "plain" | "on";
}) {
  const tones = {
    tint: "bg-tint text-accent border-transparent",
    plain: "bg-surface text-ink border-line",
    on: "bg-accent text-white border-transparent",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3 py-1.5 text-meta ${tones[tone]}`}
    >
      {children}
    </button>
  );
}

function TagRow({ tags, onRemove, onAdd }: { tags: string[]; onRemove?: (t: string) => void; onAdd?: (t: string) => void }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <Chip key={t} onClick={() => onRemove?.(t)}>
            {t}
            {onRemove ? <span className="ml-1.5 opacity-60">×</span> : null}
          </Chip>
        ))}
        {onAdd ? (
          <Chip tone="plain" onClick={() => setOpen(!open)}>
            + Add tag
          </Chip>
        ) : null}
      </div>
      {open && onAdd ? (
        <div className="mt-3 rounded-card border border-line bg-surface p-3">
          <div className="flex flex-wrap gap-2">
            {COMMON_TAGS.filter((t) => !tags.includes(t)).map((t) => (
              <Chip key={t} tone="plain" onClick={() => { onAdd(t); setOpen(false); }}>
                {t}
              </Chip>
            ))}
          </div>
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!draft.trim()) return;
              onAdd(draft.trim().toLowerCase());
              setDraft("");
              setOpen(false);
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="something else"
              className="h-12 flex-1 rounded-card border border-line bg-bg px-3 text-body outline-none placeholder:text-muted"
            />
            <button type="submit" className="h-12 rounded-card bg-accent px-4 text-name text-white">
              Add
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

const initials = (name: string) => name.slice(0, 1).toUpperCase();

function ReplyRow({ reply }: { reply: Reply }) {
  return (
    <li className="flex gap-3 border-b border-line py-5 last:border-b-0">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-tint text-name font-medium text-accent">
        {initials(reply.who)}
      </span>
      <div className="min-w-0">
        <p className="flex items-baseline gap-2">
          <span className="text-name font-medium">{reply.who}</span>
          <span className="text-meta text-muted">{reply.when}</span>
        </p>
        <p className="mt-1 text-body">{reply.text}</p>
      </div>
    </li>
  );
}

function AiBlock({ description }: { description: string }) {
  return (
    <div>
      <p className="mb-2 text-meta text-muted">What&rsquo;s in this photo</p>
      <div className="rounded-card border border-line bg-tint p-4">
        <p className="text-ai">{description}</p>
      </div>
    </div>
  );
}

/* ---------- 1. Upload ---------- */

export function Upload({ onPick }: { onPick?: (url: string) => void }) {
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  const capture = useCallback(() => {
    if (cameraError) {
      setGalleryOpen(true);
      return;
    }
    const image = webcamRef.current?.getScreenshot({ width: 1080, height: 1080 });
    if (image) onPick?.(image);
  }, [cameraError, onPick]);

  const pickFromGallery = (src: string) => {
    setGalleryOpen(false);
    onPick?.(src);
  };

  return (
    <Screen>
      <div className="relative flex h-full flex-col bg-black text-white">
        {galleryOpen ? (
          <div className="absolute inset-0 z-10 flex flex-col bg-black">
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <button type="button" onClick={() => setGalleryOpen(false)} className="text-meta text-white/70">
                Close
              </button>
              <p className="text-meta tracking-wide">Gallery</p>
              <span className="w-10" aria-hidden />
            </div>
            <div className="grid grid-cols-3 gap-0.5 overflow-y-auto pb-8">
              {GALLERY.map((src) => (
                <button key={src} type="button" onClick={() => pickFromGallery(src)} className="relative block">
                  <img src={src} alt="" className="aspect-square w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex items-center justify-between px-6 pt-5">
          <Link href="/archive" aria-label="Family" className="flex size-11 items-center justify-center">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <circle cx="8.5" cy="8" r="3.1" />
              <path d="M2.8 18.8c.5-3.4 3.2-5.2 5.7-5.2s5.2 1.8 5.7 5.2" />
              <circle cx="16.4" cy="8.6" r="2.5" />
              <path d="M13.6 18.8c.4-2.4 2-3.8 3.8-3.8 1.9 0 3.5 1.4 4 3.8" />
            </svg>
          </Link>
          <Link href="/archive" aria-label="Profile" className="flex size-11 items-center justify-center">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <circle cx="12" cy="12" r="9.2" />
              <circle cx="12" cy="10" r="2.8" />
              <path d="M7 18c1.1-2.3 2.9-3.4 5-3.4s3.9 1.1 5 3.4" />
            </svg>
          </Link>
        </div>

        <div className="flex flex-1 items-center px-[18px]">
          <div className="relative aspect-square w-full overflow-hidden rounded-[40px] bg-neutral-900">
            {cameraError ? (
              <button
                type="button"
                onClick={() => setGalleryOpen(true)}
                className="flex h-full w-full items-center justify-center text-meta text-white/40"
              >
                Allow camera
              </button>
            ) : (
              <Webcam
                ref={webcamRef}
                audio={false}
                mirrored={facingMode === "user"}
                screenshotFormat="image/jpeg"
                screenshotQuality={0.92}
                videoConstraints={{ facingMode, aspectRatio: 1, width: { ideal: 1080 } }}
                onUserMediaError={() => setCameraError(true)}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between px-10 pt-5">
          <button type="button" onClick={() => setGalleryOpen(true)} aria-label="Gallery">
            <img src={GALLERY[0]} alt="" className="size-11 rounded-[12px] object-cover" />
          </button>

          <button
            type="button"
            onClick={capture}
            aria-label="Take photo"
            className="flex size-[78px] items-center justify-center rounded-full border-[3px] border-[#E8C84A]"
          >
            <span className="size-[64px] rounded-full bg-white" />
          </button>

          <button
            type="button"
            onClick={() => setFacingMode((m) => (m === "user" ? "environment" : "user"))}
            aria-label="Flip camera"
            className="flex size-11 items-center justify-center"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
              <path d="M20 7V4h-3M4 17v3h3" />
              <path d="M19.2 4.8A9 9 0 0 0 5.2 8.4M4.8 19.2A9 9 0 0 0 18.8 15.6" />
            </svg>
          </button>
        </div>

        <Link href="/archive" className="flex flex-col items-center pb-8 pt-4 text-meta tracking-wide">
          History
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-1" aria-hidden>
            <path d="M6 9l6 6 6-6" />
          </svg>
        </Link>
      </div>
    </Screen>
  );
}

/* ---------- 2. Describe ---------- */

export function Describe({
  photo,
  onSave,
  preview,
}: {
  photo: string;
  onSave?: (info: { description: string; tags: string[] }) => void;
  preview?: "looking" | "ready";
}) {
  const info = describePhoto(photo);
  const [looking, setLooking] = useState(preview !== "ready");

  useEffect(() => {
    if (preview) {
      setLooking(preview === "looking");
      return;
    }
    const t = setTimeout(() => setLooking(false), 1600);
    return () => clearTimeout(t);
  }, [photo, preview]);

  return (
    <Screen>
      <div className="flex h-full flex-col bg-black text-white">
        <div className="flex flex-1 items-center px-[18px] pt-8">
          <img
            src={photo}
            alt=""
            className={`aspect-square w-full rounded-[40px] object-cover ${looking ? "opacity-50" : ""}`}
          />
        </div>

        <div className="px-7 pt-6 pb-10">
          {looking ? (
            <p className="text-ai text-white/45">Reading the photo&hellip;</p>
          ) : (
            <p className="text-ai text-white/90">{info.description}</p>
          )}
          <button
            type="button"
            disabled={looking}
            onClick={() => onSave?.(info)}
            className="mt-6 h-14 w-full rounded-full bg-white text-body font-medium text-black disabled:opacity-30"
          >
            Save
          </button>
        </div>
      </div>
    </Screen>
  );
}

export function AddContext({ photo }: { photo: string; onContinue?: (caption: string) => void; onSkip?: () => void }) {
  return <Describe photo={photo} preview="ready" />;
}

export function Generating({ photo }: { photo: string }) {
  return <Describe photo={photo} preview="looking" />;
}

/* ---------- 4 + 5. Post detail, empty state, writing a response ---------- */

export function PostDetail({
  post,
  writing = false,
  backHref = "/archive",
}: {
  post: Post;
  writing?: boolean;
  backHref?: string;
}) {
  const router = useRouter();
  const [replies, setReplies] = useState(post.replies);
  const [tags, setTags] = useState(post.tags);
  const [composing, setComposing] = useState(writing);
  const [draft, setDraft] = useState("");

  const send = () => {
    const text = draft.trim();
    if (text) {
      const next = [...replies, { who: "Anna", when: "now", text }];
      setReplies(next);
      savePost({ ...post, replies: next, tags });
      setDraft("");
      setComposing(false);
      return;
    }
    if (!composing) {
      savePost({ ...post, replies, tags });
      router.push(backHref);
    }
  };

  if (composing) {
    return (
      <Screen>
        <div className="flex shrink-0 gap-3 border-b border-line px-5 py-3">
          <img src={post.photo} alt="" className="size-14 shrink-0 rounded-card bg-tint object-cover" />
          <p className="min-w-0 flex-1 self-center truncate text-ai text-muted">{post.description}</p>
          <button type="button" onClick={() => setComposing(false)} className="self-center text-meta text-muted">
            Close
          </button>
        </div>

        <div className="flex-1 px-5 pt-4">
          <textarea
            autoFocus
            rows={3}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write something helpful&hellip;"
            className="w-full resize-none rounded-card border border-line bg-surface p-4 text-body outline-none placeholder:text-muted"
          />
        </div>

        <div className="shrink-0 px-5 pb-7">
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-4">
            {QUICK_REPLIES.map((q) => (
              <Chip key={q} onClick={() => setDraft(draft ? `${draft} ${q}` : q)}>
                {q}
              </Chip>
            ))}
          </div>
          <button
            type="button"
            onClick={send}
            disabled={!draft.trim()}
            className="h-14 w-full rounded-card bg-accent text-body font-medium text-white disabled:opacity-40"
          >
            Send
          </button>
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 pt-4 pb-3">
          <Link href={backHref} className="text-meta text-muted">
            &lsaquo; Back
          </Link>
        </div>
        <img src={post.photo} alt="" className="aspect-4/5 w-full bg-tint object-cover" />

        <div className="space-y-5 px-5 pt-5">
          {post.caption ? <p className="text-body">{post.caption}</p> : null}
          {post.description ? <AiBlock description={post.description} /> : null}
          <TagRow
            tags={tags}
            onRemove={(t) => setTags(tags.filter((x) => x !== t))}
            onAdd={(t) => setTags(tags.includes(t) ? tags : [...tags, t])}
          />
          <hr className="border-line" />
          <div>
            <p className="text-meta text-muted">From your family</p>
            {replies.length === 0 ? (
              <p className="py-10 text-center text-body text-muted">No one has written yet.</p>
            ) : (
              <ul className="mt-1">
                {replies.map((r, i) => (
                  <ReplyRow key={i} reply={r} />
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 border-t border-line bg-bg px-5 py-3 pb-6">
        <input
          value={draft}
          onFocus={() => setComposing(true)}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write something helpful&hellip;"
          className="h-14 flex-1 rounded-card border border-line bg-surface px-4 text-body outline-none placeholder:text-muted"
        />
        <button
          type="button"
          onClick={send}
          aria-label="Send"
          className="flex size-14 shrink-0 items-center justify-center rounded-card bg-accent text-white"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M4 12h15M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </Screen>
  );
}

/* ---------- 6. Archive, grid ---------- */

function useFeed() {
  const [saved, setSaved] = useState<Post[]>([]);
  useEffect(() => {
    const sync = () => setSaved(loadSaved());
    sync();
    window.addEventListener("saved-posts-changed", sync);
    return () => window.removeEventListener("saved-posts-changed", sync);
  }, []);
  return [...saved, ...allPosts];
}

export function ArchiveGrid() {
  const feed = useFeed();
  const [period, setPeriod] = useState<Period>("Year");
  const [tag, setTag] = useState<string | null>(null);

  const inPeriod = withinPeriod(feed, period);
  const shown = tag ? inPeriod.filter((p) => p.tags.includes(tag)) : inPeriod;

  return (
    <Screen>
      <div className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 border-b border-line bg-bg/95 backdrop-blur">
          <div className="flex items-center justify-between px-5 pt-4">
            <Link href="/" className="text-meta text-muted">
              &lsaquo; Add a photo
            </Link>
            <Link href="/archive/summary" className="text-meta text-muted">
              This year
            </Link>
          </div>
          <div className="flex gap-6 px-5 pt-3">
            {(["Week", "Month", "Year"] as Period[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`border-b-2 pb-2 text-body ${
                  p === period ? "border-accent text-ink" : "border-transparent text-muted"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="-mx-0 flex gap-2 overflow-x-auto px-5 py-3">
            <Chip tone={tag === null ? "on" : "plain"} onClick={() => setTag(null)}>
              All
            </Chip>
            {topTags(inPeriod).map((t) => (
              <Chip key={t} tone={t === tag ? "on" : "tint"} onClick={() => setTag(t === tag ? null : t)}>
                {t}
              </Chip>
            ))}
          </div>
        </header>

        {shown.length === 0 ? (
          <p className="py-16 text-center text-body text-muted">Nothing tagged {tag} yet.</p>
        ) : null}

        {groupPosts(shown).map((group) => (
          <section key={group.label}>
            <h2 className="px-5 pt-5 pb-2 text-meta text-muted">{group.label}</h2>
            <div className="grid grid-cols-3 gap-0.5">
              {group.posts.map((p) => (
                <Link key={p.id} href={`/post/${p.id}`} className="relative block">
                  <img src={p.photo} alt="" loading="lazy" decoding="async" className="aspect-square w-full bg-tint object-cover" />
                  {hasUnread(p) ? <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-accent" /> : null}
                </Link>
              ))}
            </div>
          </section>
        ))}
        <div className="h-24" />
      </div>

      <Link
        href="/archive/story"
        className="absolute right-5 bottom-7 flex h-14 items-center rounded-full bg-accent px-5 text-body font-medium text-white"
      >
        Story view
      </Link>
    </Screen>
  );
}

/* ---------- 7. Archive, story ---------- */

export function ArchiveStory({ start = 0, auto = true }: { start?: number; auto?: boolean }) {
  const feed = useFeed();
  const list = withinPeriod(feed, "Month");
  const [i, setI] = useState(Math.min(start, list.length - 1));
  const post = list[i];

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setI((n) => (n + 1) % list.length), 5000);
    return () => clearInterval(t);
  }, [auto, list.length]);

  return (
    <Screen>
      <div className="relative h-full bg-black">
        <img src={post.photo} alt="" className="h-full w-full object-cover" />

        <div className="absolute inset-x-3 top-3 flex gap-1">
          {list.map((_, n) => (
            <span key={n} className={`h-0.5 flex-1 rounded-full ${n <= i ? "bg-white" : "bg-white/35"}`} />
          ))}
        </div>

        <Link href="/archive" className="absolute top-6 right-4 text-body text-white/90">
          Close
        </Link>

        <button
          type="button"
          aria-label="Previous"
          onClick={() => setI((n) => (n - 1 + list.length) % list.length)}
          className="absolute inset-y-0 left-0 w-1/4"
        />
        <button
          type="button"
          aria-label="Next"
          onClick={() => setI((n) => (n + 1) % list.length)}
          className="absolute inset-y-0 right-0 w-1/4"
        />
        <Link href={`/post/${post.id}`} className="absolute inset-y-0 left-1/4 w-1/2" aria-label="Open post" />

        <div className="absolute inset-x-0 bottom-0 bg-black/65 px-5 pt-4 pb-8">
          <p className="text-body text-white">{post.description}</p>
          <p className="mt-2 text-meta text-white/70">
            {post.replies.length} {post.replies.length === 1 ? "reply" : "replies"}
          </p>
        </div>
      </div>
    </Screen>
  );
}

/* ---------- 8. Period summary ---------- */

export function PeriodSummary() {
  const feed = useFeed();
  const year = withinPeriod(feed, "Year");
  return (
    <Screen>
      <div className="flex h-full flex-col items-center justify-center px-8 text-center">
        <p className="text-hero font-medium">{year.length}</p>
        <p className="mt-2 text-body">moments this year</p>
        <p className="mt-6 text-body text-muted">Your family wrote back {replyCount(year)} times.</p>
        <Link
          href="/archive"
          className="mt-10 flex h-14 items-center rounded-card border border-line bg-surface px-6 text-body"
        >
          See them all
        </Link>
      </div>
    </Screen>
  );
}
