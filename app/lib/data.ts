// ponytail: seeded mockup data, no store. Swap `posts` for a real feed when there is one.

export type Reply = { who: string; when: string; text: string };

export type Post = {
  id: string;
  photo: string;
  /** days before today */
  day: number;
  caption?: string;
  description: string;
  tags: string[];
  replies: Reply[];
};

// ponytail: placeholder photography. Real posts carry an uploaded file.
const photo = (seed: string) => `https://picsum.photos/seed/${seed}/800/1000`;

const rich: Omit<Post, "id">[] = [
  {
    photo: photo("tablets"),
    day: 0,
    caption: "the new medicine from the hospital",
    description:
      "A packet of white tablets on a wooden table. The label says to take one tablet after food. There is a blue helmet on the shelf behind, next to a folded towel.",
    tags: ["medicine", "kitchen"],
    replies: [
      { who: "Anna", when: "7:20 pm", text: "One tablet, after dinner — not before. I'll ring you at seven to check." },
      { who: "Ben", when: "8:04 pm", text: "That's the same one Dr Owens gave you in June. Keep it by the kettle so you see it." },
    ],
  },
  {
    photo: photo("keys-bowl"),
    day: 0,
    description:
      "Three keys on a ring in a blue ceramic bowl by a front door. One key has a red plastic cap. A pair of reading glasses is beside the bowl.",
    tags: ["keys", "hallway"],
    replies: [],
  },
  {
    photo: photo("noodle-soup"),
    day: 1,
    caption: "lunch",
    description:
      "A bowl of noodle soup with sliced spring onion on a green placemat. Steam is rising. A glass of water sits to the right of the bowl.",
    tags: ["food", "kitchen"],
    replies: [
      { who: "Grace", when: "Yesterday", text: "That looks so good. Save me some on Sunday please." },
    ],
  },
  {
    photo: photo("bank-letter"),
    day: 2,
    caption: "this came today",
    description:
      "A printed letter on a table. The letterhead reads Northbank. The largest text says Your annual statement. A date near the top reads 14 August.",
    tags: ["documents"],
    replies: [
      { who: "Ben", when: "Wed", text: "Nothing to do with this one — it's just the yearly summary. Put it in the blue folder." },
      { who: "Anna", when: "Wed", text: "Agreed, no action needed. I'll look at it when I'm over." },
    ],
  },
  {
    photo: photo("tomatoes"),
    day: 3,
    description:
      "Six small tomatoes on a windowsill, four red and two still green. Behind them a garden with a wooden fence in afternoon light.",
    tags: ["outdoors", "food"],
    replies: [
      { who: "Grace", when: "Tue", text: "The green ones will turn if you leave them another few days." },
    ],
  },
  {
    photo: photo("helmet-shelf"),
    day: 4,
    caption: "is this the one",
    description:
      "A blue cycling helmet on a wooden shelf beside a folded towel and a small basket. A dark green jacket hangs on a hook to the left.",
    tags: ["outdoors"],
    replies: [
      { who: "Ben", when: "Mon", text: "That's Grace's. Hers is the blue one — mine's the black one in the car." },
    ],
  },
  {
    photo: photo("kettle-plug"),
    day: 5,
    description:
      "A white kettle on a kitchen counter, unplugged, with the cable coiled beside it. A wall socket above the counter is switched off.",
    tags: ["kitchen"],
    replies: [
      { who: "Anna", when: "Sun", text: "Perfect — that's exactly how to leave it. Thank you." },
    ],
  },
  {
    photo: photo("blue-inhaler"),
    day: 6,
    caption: "found it in the drawer",
    description:
      "A blue inhaler lying in an open drawer with pens and a tape measure. The label text is small and partly hidden by the drawer edge.",
    tags: ["medicine", "bedroom"],
    replies: [
      { who: "Anna", when: "Sat", text: "That's the old one — the date on it has passed. The new one is in the bathroom cabinet, top shelf." },
      { who: "Ben", when: "Sat", text: "Bin that one so they don't get mixed up." },
    ],
  },
  {
    photo: photo("dog-porch"),
    day: 8,
    description:
      "A brown dog lying on a porch in the sun beside an empty water bowl. The wooden boards are worn pale in the middle.",
    tags: ["outdoors"],
    replies: [
      { who: "Grace", when: "Aug 12", text: "Fill the bowl before you sit down, it's hot this week." },
    ],
  },
  {
    photo: photo("pill-organiser"),
    day: 11,
    description:
      "A weekly pill organiser with seven compartments, open. The Monday, Tuesday and Wednesday compartments are empty; the rest hold two tablets each.",
    tags: ["medicine", "kitchen"],
    replies: [
      { who: "Anna", when: "Aug 9", text: "You're up to date. I'll refill the whole thing on Saturday when I'm there." },
      { who: "Ben", when: "Aug 9", text: "Nice one. Keep it where you can see it." },
    ],
  },
  {
    photo: photo("market-stall"),
    day: 15,
    caption: "market this morning",
    description:
      "A market stall with crates of oranges and lemons under a striped awning. A handwritten sign reads 3 for 2. People are standing to the left.",
    tags: ["outdoors", "food"],
    replies: [
      { who: "Grace", when: "Aug 5", text: "Get the lemons, they keep for ages." },
    ],
  },
  {
    photo: photo("boiler-dial"),
    day: 21,
    caption: "which way",
    description:
      "A wall-mounted boiler with a round dial. The dial pointer sits between the numbers 2 and 3. A small green light is lit below it.",
    tags: ["documents", "hallway"],
    replies: [
      { who: "Ben", when: "Jul 30", text: "Turn it clockwise to 3 and leave it. Green light means it's fine." },
      { who: "Anna", when: "Jul 30", text: "Don't touch the lever underneath, that's the water." },
    ],
  },
  {
    photo: photo("birthday-cake"),
    day: 34,
    caption: "grace's birthday",
    description:
      "A round cake with white icing on a table, with candles unlit. Paper plates and glasses are set around it. A window behind lets in evening light.",
    tags: ["food"],
    replies: [
      { who: "Grace", when: "Jul 17", text: "Best day. Thank you for the cake." },
      { who: "Anna", when: "Jul 18", text: "Look at that icing. Saving this one." },
    ],
  },
  {
    photo: photo("train-ticket"),
    day: 47,
    description:
      "A paper train ticket on a knee. The printed text reads Depart 14:32, Platform 6. The date on the ticket is 6 July.",
    tags: ["documents"],
    replies: [
      { who: "Ben", when: "Jul 4", text: "Platform 6, half two. I'll be at the barrier when you get in." },
    ],
  },
];

// ponytail: filler so the archive looks lived-in. Only thumbnails and counts are ever seen.
const fillerDescriptions: [string, string[]][] = [
  ["A cup of tea on a saucer beside a folded newspaper, on a table by a window.", ["kitchen"]],
  ["A row of potted plants on a windowsill, the tallest leaning towards the glass.", ["outdoors"]],
  ["A pair of shoes left by a door mat, laces loose, next to an umbrella.", ["hallway"]],
  ["A bus timetable pinned to a board, the top row circled in pen.", ["documents", "outdoors"]],
  ["Two eggs and a loaf of bread on a counter next to a blue tin.", ["food", "kitchen"]],
  ["A cat asleep on a folded blanket at the end of a bed.", ["bedroom"]],
  ["A box of tablets on a bathroom shelf beside a toothbrush glass.", ["medicine", "bathroom"]],
  ["A garden path after rain, with wet leaves along one edge.", ["outdoors"]],
  ["A handwritten shopping list on lined paper, held down by a mug.", ["documents", "kitchen"]],
  ["A set of keys on a hook by the back door, beside a torch.", ["keys", "hallway"]],
  ["A plate of rice and greens on a wooden table under a hanging lamp.", ["food"]],
  ["A radio on a shelf with the volume dial turned low, next to a photo frame.", ["bedroom"]],
];

const fillerReplies: Reply[] = [
  { who: "Anna", when: "", text: "Got it — leave that where it is and I'll sort it Saturday." },
  { who: "Ben", when: "", text: "That's the right one. Second shelf, blue lid." },
  { who: "Grace", when: "", text: "Love this. Keep sending them." },
  { who: "Anna", when: "", text: "After food, not before. One only." },
  { who: "Ben", when: "", text: "It's in the bathroom cabinet, top shelf." },
];

function buildPosts(): Post[] {
  const out: Post[] = rich.map((p, i) => ({ ...p, id: `p${i}` }));
  for (let i = 0; i < 98; i++) {
    const [description, tags] = fillerDescriptions[i % fillerDescriptions.length];
    const count = (i % 3) + 2;
    out.push({
      id: `f${i}`,
      photo: photo(`moment-${i}`),
      day: 55 + Math.round(i * 3.1),
      description,
      tags,
      replies: Array.from({ length: count }, (_, r) => {
        const base = fillerReplies[(i + r) % fillerReplies.length];
        return { ...base, when: `${(r % 6) + 4}:0${r} pm` };
      }),
    });
  }
  return out.sort((a, b) => a.day - b.day);
}

export const posts = buildPosts();

export const getPost = (id: string) => posts.find((p) => p.id === id);

/** A post that nobody has replied to yet — the designed empty state. */
export const emptyPost = posts.find((p) => p.replies.length === 0)!;

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function dayName(day = 0, now = new Date()): string {
  const d = new Date(now);
  d.setDate(d.getDate() - day);
  return d.toLocaleDateString("en-GB", { weekday: "long" });
}

export function sectionLabel(day: number, now = new Date()): string {
  if (day < 7) return "This week";
  const d = new Date(now);
  d.setDate(d.getDate() - day);
  return d.getFullYear() === now.getFullYear()
    ? MONTHS[d.getMonth()]
    : `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function groupPosts(list: Post[], now = new Date()) {
  const out: { label: string; posts: Post[] }[] = [];
  for (const p of list) {
    const label = sectionLabel(p.day, now);
    const last = out[out.length - 1];
    if (last && last.label === label) last.posts.push(p);
    else out.push({ label, posts: [p] });
  }
  return out;
}

export type Period = "Week" | "Month" | "Year";

export const withinPeriod = (list: Post[], period: Period) =>
  list.filter((p) => p.day < { Week: 7, Month: 31, Year: 366 }[period]);

/** Tags across the archive, most used first. */
export function topTags(list: Post[]): string[] {
  const counts = new Map<string, number>();
  for (const p of list) for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
}

/** Unread means a reply landed recently and the poster has not opened it. */
export const hasUnread = (p: Post) => p.replies.length > 0 && p.day < 12;

export const replyCount = (list: Post[]) => list.reduce((n, p) => n + p.replies.length, 0);

export const COMMON_TAGS = ["medicine", "kitchen", "outdoors", "documents", "keys", "food", "bathroom", "bedroom", "hallway"];

export const QUICK_REPLIES = ["Take after food", "Twice a day", "It's in the bathroom", "Call me"];

// ponytail: canned stand-in for the vision call. One model request replaces this.
export const describe = () => ({
  description:
    "A packet of white tablets on a wooden table. The label says to take one tablet after food. There is a blue helmet on the shelf behind, next to a folded towel.",
  tags: ["medicine", "kitchen"],
});
