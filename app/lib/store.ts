import { posts, type Post } from "./data";

const KEY = "shared-memory-saved";

export function prependPost(list: Post[], post: Post): Post[] {
  return [post, ...list.filter((p) => p.id !== post.id)];
}

export function loadSaved(): Post[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Post[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function savePost(post: Post) {
  const next = prependPost(loadSaved(), post);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // quota — keep going; this session still has React state
  }
  window.dispatchEvent(new Event("saved-posts-changed"));
}

export function getFeedPost(id: string): Post | undefined {
  return loadSaved().find((p) => p.id === id) ?? posts.find((p) => p.id === id);
}