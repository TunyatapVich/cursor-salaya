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
        className ?? "h-dvh"
      }`}
    >
      {children}
    </div>
  );
}

const Screen = ({ children }: { children: React.ReactNode }) => (
  <div className="relative flex h-full min-h-0 flex-col">{children}</div>
);

/* ---------- shared bits ---------- */

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function StoryIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="6" y="4" width="12" height="16" rx="2" />
      <path d="M4 7v10M20 7v10" />
    </svg>
  );
}

function HashTag({
  label,
  on = false,
  onClick,
}: {
  label: string;
  on?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 py-2 pr-4 text-name font-medium tracking-[0.02em] ${
        on ? "text-accent" : "text-muted"
      }`}
    >
      {label === "All" ? "All" : `#${label}`}
    </button>
  );
}

const PERIODS = ["Week", "Month", "Year"] as const;

function PeriodTabs({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
  const i = PERIODS.indexOf(value);
  return (
    <div
      role="tablist"
      aria-label="Time period"
      className="relative grid grid-cols-3 overflow-hidden rounded-full border border-white/70 bg-white/40 p-[3px] backdrop-blur-xl"
    >
      <span
        aria-hidden
        className="absolute top-[3px] bottom-[3px] left-[3px] w-[calc((100%-6px)/3)] rounded-full bg-tint transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: `translateX(${i * 100}%)` }}
      />
      {PERIODS.map((p) => (
        <button
          key={p}
          type="button"
          role="tab"
          aria-selected={p === value}
          onClick={() => onChange(p)}
          className={`relative z-10 h-11 text-name tracking-[0.02em] ${
            p === value ? "font-medium text-ink" : "text-muted"
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}

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
          <HashTag key={t} label={t} onClick={() => onRemove?.(t)} />
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
              <HashTag key={t} label={t} onClick={() => { onAdd(t); setOpen(false); }} />
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
            <button type="submit" className="btn-primary h-12 rounded-card px-4 text-name">
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
  onSave?: (info: { description: string; tags: string[]; caption: string }) => void;
  preview?: "looking" | "ready";
}) {
  const info = describePhoto(photo);
  const [looking, setLooking] = useState(preview !== "ready");
  const [tags, setTags] = useState(info.tags);
  const [note, setNote] = useState("");

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
      <div className="flex h-full flex-col bg-bg">
        <div className="px-5 pt-6">
          <img
            src={photo}
            alt=""
            className={`aspect-square w-full rounded-[28px] bg-tint object-cover ${looking ? "opacity-50" : ""}`}
          />
        </div>

        <div className="flex-1 overflow-y-auto px-5 pt-5">
          <p className="text-meta text-muted">What&rsquo;s in this photo</p>
          {looking ? (
            <p className="mt-2 text-ai text-muted">Reading the photo&hellip;</p>
          ) : (
            <>
              <p className="mt-2 text-ai">{info.description}</p>
              <div className="mt-4">
                <TagRow
                  tags={tags}
                  onRemove={(t) => setTags(tags.filter((x) => x !== t))}
                  onAdd={(t) => setTags(tags.includes(t) ? tags : [...tags, t])}
                />
              </div>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note if you want"
                className="mt-4 h-14 w-full rounded-card border border-line bg-surface px-4 text-body outline-none placeholder:text-muted"
              />
            </>
          )}
        </div>

        <div className="shrink-0 px-5 pt-3 pb-7">
          <button
            type="button"
            disabled={looking}
            onClick={() => onSave?.({ description: info.description, tags, caption: note.trim() })}
            className="btn-primary h-14 w-full rounded-card text-body font-medium disabled:opacity-40"
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
            className="btn-primary h-14 w-full rounded-card text-body font-medium disabled:opacity-40"
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
          className="btn-primary flex size-14 shrink-0 items-center justify-center rounded-card"
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
  return saved;
}

export function ArchiveGrid() {
  const feed = useFeed();
  const [period, setPeriod] = useState<Period>("Year");
  const [tag, setTag] = useState<string | null>(null);

  const inPeriod = withinPeriod(feed, period);
  const shown = tag ? inPeriod.filter((p) => p.tags.includes(tag)) : inPeriod;

  return (
    <Screen>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 px-5 pt-4 pb-3">
          <PeriodTabs value={period} onChange={setPeriod} />
        </header>

        {shown.length === 0 ? (
          <p className="px-8 py-16 text-center text-body text-muted">
            {tag ? `Nothing tagged ${tag} yet.` : "Add a photo to start this History."}
          </p>
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
      </div>

      <div className="relative z-10 shrink-0">
        <div
          className="pointer-events-none absolute inset-x-0 -top-24 h-24 backdrop-blur-xl"
          style={{
            maskImage: "linear-gradient(to top, black, transparent)",
            WebkitMaskImage: "linear-gradient(to top, black, transparent)",
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 -top-24 h-24 bg-gradient-to-t from-bg to-transparent" />
        <div className="relative bg-bg/85 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
          <div className="flex gap-2 overflow-x-auto px-5 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <HashTag label="All" on={tag === null} onClick={() => setTag(null)} />
            {topTags(inPeriod).map((t) => (
              <HashTag
                key={t}
                label={t}
                on={t === tag}
                onClick={() => setTag(t === tag ? null : t)}
              />
            ))}
          </div>

          <div className={`grid gap-3 px-5 ${feed.length > 0 ? "grid-cols-2" : "grid-cols-1"}`}>
            <Link
              href="/"
              className="btn-primary flex h-14 items-center justify-center gap-2 rounded-full text-name font-medium"
            >
              <PlusIcon />
              Add a photo
            </Link>
            {feed.length > 0 ? (
              <Link
                href="/archive/story"
                className="flex h-14 items-center justify-center gap-2 rounded-full border border-line bg-surface/90 text-name text-ink"
              >
                <StoryIcon />
                Story view
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </Screen>
  );
}

/* ---------- 7. Archive, story ---------- */

export function ArchiveStory({ start = 0, auto = true }: { start?: number; auto?: boolean }) {
  const router = useRouter();
  const feed = useFeed();
  const list = withinPeriod(feed, "Month");
  const [i, setI] = useState(Math.min(start, list.length - 1));
  const post = list[i];

  useEffect(() => {
    if (!auto || list.length === 0) return;
    const t = setInterval(() => setI((n) => (n + 1) % list.length), 5000);
    return () => clearInterval(t);
  }, [auto, list.length]);

  if (!post) {
    return (
      <Screen>
        <div className="flex h-full flex-col items-center justify-center bg-black px-8 text-center">
          <p className="text-body text-white/70">Nothing in History yet.</p>
          <Link href="/" className="mt-6 text-meta text-white/50">
            Add a photo
          </Link>
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <div className="relative h-full bg-black">
        <img src={post.photo} alt="" className="h-full w-full object-cover" />

        <div className="absolute inset-x-3 top-3 flex gap-1">
          {list.map((_, n) => (
            <span key={n} className={`h-0.5 flex-1 rounded-full ${n <= i ? "bg-white" : "bg-white/35"}`} />
          ))}
        </div>

        <button
          type="button"
          aria-label="Previous"
          onClick={() => setI((n) => (n - 1 + list.length) % list.length)}
          className="absolute top-20 bottom-0 left-0 z-0 w-1/4"
        />
        <button
          type="button"
          aria-label="Next"
          onClick={() => setI((n) => (n + 1) % list.length)}
          className="absolute top-20 bottom-0 right-0 z-0 w-1/4"
        />
        <Link href={`/post/${post.id}`} className="absolute top-20 bottom-0 left-1/4 z-0 w-1/2" aria-label="Open post" />

        <button
          type="button"
          aria-label="Close"
          onClick={() => router.push("/archive")}
          className="absolute top-8 right-3 z-20 flex size-11 items-center justify-center rounded-full border border-white/40 bg-black/35 text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

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
