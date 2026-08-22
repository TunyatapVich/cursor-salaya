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

const PHOTOS = [
  "/photos/laundry.jpg",
  "/photos/night-street.jpg",
  "/photos/fried-rice.jpg",
  "/photos/campus-walk.jpg",
  "/photos/campus-path.jpg",
  "/photos/tom-yum.jpg",
  "/photos/khao-kha-moo.jpg",
  "/photos/classroom.jpg",
  "/photos/painting-night.jpg",
  "/photos/meiji-milk.jpg",
];

const photo = (seed: string) => {
  let n = 0;
  for (let i = 0; i < seed.length; i++) n += seed.charCodeAt(i);
  return PHOTOS[n % PHOTOS.length];
};

const rich: Omit<Post, "id">[] = [
  {
    photo: "/photos/laundry.jpg",
    day: 0,
    caption: "laundry day",
    description:
      "A row of silver Speed Queen washing machines in a tiled laundromat. Machine 24 is in front. Someone in a dark shirt stands by a yellow cart, loading a machine.",
    tags: ["outdoors"],
    replies: [
      { who: "Anna", when: "7:20 pm", text: "Don't mix the whites. I'll pick you up when the last load is done." },
      { who: "Ben", when: "8:04 pm", text: "Machine 24 is the one that actually spins. The others take forever." },
    ],
  },
  {
    photo: "/photos/night-street.jpg",
    day: 0,
    description:
      "A dark street corner at night. Red traffic lights hang over the road. A glowing sign reads 19th, and a parking board shows SPACES 501.",
    tags: ["outdoors"],
    replies: [],
  },
  {
    photo: "/photos/fried-rice.jpg",
    day: 1,
    caption: "lunch",
    description:
      "A dark blue bowl of fried rice with a fried egg on top, fork and spoon crossed in the bowl. An iPad behind it is playing One Piece on a wooden table.",
    tags: ["food", "kitchen"],
    replies: [
      { who: "Grace", when: "Yesterday", text: "That looks so good. Save me some on Sunday please." },
    ],
  },
  {
    photo: "/photos/campus-walk.jpg",
    day: 2,
    caption: "walking back",
    description:
      "A person in a light hoodie and black shorts walking down a tree-lined campus path, Nike bag on one shoulder. Another person walks ahead toward a brick building.",
    tags: ["outdoors"],
    replies: [
      { who: "Ben", when: "Wed", text: "Text when you get to the gate." },
      { who: "Anna", when: "Wed", text: "Hot out. Take the shaded side." },
    ],
  },
  {
    photo: "/photos/campus-path.jpg",
    day: 3,
    description:
      "A long concrete sidewalk between grass and trees, with a red brick building and a silver awning on the right. A few people walk in the distance.",
    tags: ["outdoors"],
    replies: [
      { who: "Grace", when: "Tue", text: "That's the short way to the hall." },
    ],
  },
  {
    photo: "/photos/tom-yum.jpg",
    day: 4,
    caption: "dinner",
    description:
      "A white bowl of tom yum with noodles, a fishball, and a lot of green herbs, next to a plate of rice and fried wonton on a dark wooden table.",
    tags: ["food"],
    replies: [
      { who: "Ben", when: "Mon", text: "Ask for less lime next time if it's too sharp." },
    ],
  },
  {
    photo: "/photos/khao-kha-moo.jpg",
    day: 5,
    description:
      "A plate of khao kha moo held outdoors: braised pork, a halved egg, and greens on rice. Picnic tables and tree shade in the background.",
    tags: ["food", "outdoors"],
    replies: [
      { who: "Anna", when: "Sun", text: "Eat it while it's hot. The egg is the best bit." },
    ],
  },
  {
    photo: "/photos/classroom.jpg",
    day: 6,
    caption: "in class",
    description:
      "A lecture hall screen showing an English worksheet, In-class activity 2 on conditionals. A student with glasses sits in front, looking at a phone.",
    tags: ["documents"],
    replies: [
      { who: "Anna", when: "Sat", text: "Second conditional, page 35. You've got this." },
      { who: "Ben", when: "Sat", text: "Pick the queue-cutting one, it's the easiest to talk about." },
    ],
  },
  {
    photo: "/photos/painting-night.jpg",
    day: 8,
    description:
      "A folding table on grass at night with a paint palette, brushes in a red cup, and a small round landscape painting. Hands hold a phone at the edge of the frame.",
    tags: ["outdoors"],
    replies: [
      { who: "Grace", when: "Aug 12", text: "Keep that little painting. It's lovely." },
    ],
  },
  {
    photo: "/photos/meiji-milk.jpg",
    day: 11,
    caption: "desk",
    description:
      "A Meiji fat-free milk jug on a wooden desk, next to a white mouse, a black keyboard, and a monitor. Headphones sit behind the keyboard.",
    tags: ["kitchen"],
    replies: [
      { who: "Anna", when: "Aug 9", text: "Check the date on the shoulder before you open it." },
      { who: "Ben", when: "Aug 9", text: "Fat free is the blue one. Don't grab the full cream by mistake." },
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
