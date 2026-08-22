"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import {
  COMMON_TAGS,
  QUICK_REPLIES,
  type Period,
  type Post,
  type Reply,
  dayName,
  groupPosts,
  hasUnread,
  posts as allPosts,
  replyCount,
  topTags,
  withinPeriod,
} from "./lib/data";

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
  <div className="flex h-full flex-col">{children}</div>
);

/* ---------- shared bits ---------- */

function CameraIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d="M3 8.5h3.2l1.4-2h7.8l1.4 2H20a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13" r="3.6" />
    </svg>
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

/* ---------- 1. Upload (camera) ---------- */

export function Upload({ onPick }: { onPick?: (url: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoConstraints = {
    facingMode,
    width: { ideal: 1280 },
    height: { ideal: 1600 },
  };

  const capture = useCallback(() => {
    const image = webcamRef.current?.getScreenshot({ width: 1280, height: 1600 });
    if (image) onPick?.(image);
  }, [onPick]);

  const flipCamera = () => {
    setFacingMode((mode) => (mode === "environment" ? "user" : "environment"));
  };

  return (
    <Screen>
      <div className="flex h-full flex-col px-5 pt-6">
        <p className="text-meta text-muted">{dayName()}</p>
        <h1 className="mt-1 text-title font-medium">Add a photo</h1>

        <div className="relative mt-5 aspect-4/5 w-full overflow-hidden rounded-card bg-black">
          {cameraError ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 bg-surface px-6 text-center text-muted">
              <CameraIcon />
              <p className="text-body text-ink">Camera unavailable</p>
              <p className="text-meta">{cameraError}</p>
            </div>
          ) : (
            <Webcam
              ref={webcamRef}
              audio={false}
              mirrored={facingMode === "user"}
              screenshotFormat="image/jpeg"
              screenshotQuality={0.92}
              videoConstraints={videoConstraints}
              onUserMediaError={() =>
                setCameraError("Allow camera access in your browser, or choose a photo from your library.")
              }
              className="h-full w-full object-cover"
            />
          )}

          {!cameraError ? (
            <button
              type="button"
              onClick={flipCamera}
              aria-label="Flip camera"
              className="absolute top-3 right-3 flex size-11 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M7 7h10M7 17h10M17 7l3 3-3 3M7 17l-3-3 3-3" />
              </svg>
            </button>
          ) : null}
        </div>

        <div className="mt-5 flex items-center justify-center gap-8">
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="text-meta text-muted underline underline-offset-4"
          >
            Library
          </button>

          {!cameraError ? (
            <button
              type="button"
              onClick={capture}
              aria-label="Take photo"
              className="flex size-[72px] items-center justify-center rounded-full border-4 border-accent bg-white p-1"
            >
              <span className="size-full rounded-full bg-accent" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => input.current?.click()}
              className="h-14 rounded-card bg-accent px-6 text-body font-medium text-white"
            >
              Choose photo
            </button>
          )}

          <span className="w-14" aria-hidden />
        </div>

        <input
          ref={input}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onPick?.(URL.createObjectURL(file));
          }}
        />

        <div className="flex-1" />
        <Link href="/archive" className="pb-7 text-center text-meta text-muted underline underline-offset-4">
          See the archive
        </Link>
      </div>
    </Screen>
  );
}

/* ---------- 2. Add context ---------- */

export function AddContext({
  photo,
  onContinue,
  onSkip,
}: {
  photo: string;
  onContinue?: (caption: string) => void;
  onSkip?: () => void;
}) {
  const [caption, setCaption] = useState("");
  return (
    <Screen>
      <div className="flex-1 overflow-y-auto px-5 pt-6">
        <img src={photo} alt="" className="aspect-4/5 w-full rounded-card bg-tint object-cover" />
        <h1 className="mt-6 text-title font-medium">Anything to add?</h1>
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="the new medicine from the hospital"
          className="mt-4 h-14 w-full rounded-card border border-line bg-surface px-4 text-body outline-none placeholder:text-muted"
        />
        <p className="mt-2 text-meta text-muted">You can skip this.</p>
      </div>
      <div className="shrink-0 px-5 pt-4 pb-7">
        <button
          type="button"
          onClick={() => onContinue?.(caption)}
          className="h-14 w-full rounded-card bg-accent text-body font-medium text-white"
        >
          Continue
        </button>
        <button type="button" onClick={onSkip} className="h-14 w-full text-body text-muted">
          Skip
        </button>
      </div>
    </Screen>
  );
}

/* ---------- 3. Generating ---------- */

export function Generating({ photo }: { photo: string }) {
  return (
    <Screen>
      <div className="flex h-full flex-col px-5 pt-6">
        <img src={photo} alt="" className="aspect-4/5 w-full rounded-card bg-tint object-cover opacity-45" />
        <p className="mt-8 text-center text-body text-muted">Looking at the photo&hellip;</p>
        <div className="mx-auto mt-5 h-px w-40 overflow-hidden bg-line">
          <div className="sweep h-px w-1/3 bg-accent" />
        </div>
      </div>
    </Screen>
  );
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
  const [replies, setReplies] = useState(post.replies);
  const [tags, setTags] = useState(post.tags);
  const [composing, setComposing] = useState(writing);
  const [draft, setDraft] = useState("");

  const send = () => {
    if (!draft.trim()) return;
    setReplies([...replies, { who: "Anna", when: "now", text: draft.trim() }]);
    setDraft("");
    setComposing(false);
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
            className="h-14 w-full rounded-card bg-accent text-body font-medium text-white"
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
          <AiBlock description={post.description} />
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

export function ArchiveGrid() {
  const [period, setPeriod] = useState<Period>("Year");
  const [tag, setTag] = useState<string | null>(null);

  const inPeriod = withinPeriod(allPosts, period);
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
  const list = withinPeriod(allPosts, "Month");
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
  const year = withinPeriod(allPosts, "Year");
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
