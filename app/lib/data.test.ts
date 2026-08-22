// run: bun test
import { expect, test } from "bun:test";
import { groupPosts, posts, replyCount, sectionLabel, withinPeriod } from "./data";

const NOW = new Date("2026-08-22T12:00:00Z");

test("recent days collapse into one section, older ones split by month", () => {
  expect(sectionLabel(0, NOW)).toBe("This week");
  expect(sectionLabel(6, NOW)).toBe("This week");
  expect(sectionLabel(30, NOW)).toBe("July");
  expect(sectionLabel(400, NOW)).toBe("July 2025");
});

test("groups keep archive order and never repeat a label", () => {
  const groups = groupPosts(posts, NOW);
  expect(groups[0].label).toBe("This week");
  expect(new Set(groups.map((g) => g.label)).size).toBe(groups.length);
  expect(groups.reduce((n, g) => n + g.posts.length, 0)).toBe(posts.length);
});

test("period filter narrows, and the year has enough to look lived-in", () => {
  expect(withinPeriod(posts, "Week").length).toBeLessThan(withinPeriod(posts, "Month").length);
  expect(withinPeriod(posts, "Year").length).toBeGreaterThan(100);
  expect(replyCount(withinPeriod(posts, "Year"))).toBeGreaterThan(200);
});
