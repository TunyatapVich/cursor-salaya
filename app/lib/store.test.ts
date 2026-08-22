// run: bun test
import { expect, test } from "bun:test";
import { prependPost } from "./store";
import type { Post } from "./data";

const post = (id: string): Post => ({
  id,
  photo: "data:image/jpeg;base64,xx",
  day: 0,
  description: "taken just now",
  tags: [],
  replies: [],
});

test("a newly taken photo sits at the front of history", () => {
  const saved = prependPost([], post("live-1"));
  expect(saved[0].id).toBe("live-1");
  expect(prependPost(saved, post("live-2"))[0].id).toBe("live-2");
});

test("saving the same id again replaces rather than duplicates", () => {
  const once = prependPost([], post("live-1"));
  const again = prependPost(once, { ...post("live-1"), caption: "updated" });
  expect(again).toHaveLength(1);
  expect(again[0].caption).toBe("updated");
});
