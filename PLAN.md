# Plan — photo library + generated images

Everything here is decided. The only open input is **your list of 10 subjects** (§6).

## 1. What changes, in one paragraph

Ten generated images become the app's entire photo pool. `picsum.photos` is deleted.
Each image is one record in `app/lib/library.json` carrying its own Cursor prompt, AI
description, tags and family replies — so the picker, the post detail and the archive all
read from the same source. `Choose from library` opens a full-screen sheet of those ten;
tapping one goes straight to Add context and on through the existing flow. Four seconds
after the post appears, a scripted family reply lands on it.

## 2. Decisions

| Question | Decision |
|---|---|
| Image source | You render in Cursor from prompts I write |
| File contract | Explicit `photo` path per record, `/library/NN-id.jpg` |
| Descriptions | Per record — picked photo carries its own description + tags |
| Archive | Stays ~112 posts; the 10 images cycle through them |
| Pools | One — the picker shows the same 10 that live in the archive |
| Replies | Belong to the image; medicine photo always gets the medicine reply |
| Hand-off | No two-phone sync. One scripted reply, ~4s after the post appears |
| Modal | Full-screen sheet, 2 columns, 4:5 thumbnails |
| Tap behaviour | Tap an image → straight into Add context, no confirm step |
| Missing files | No fallback. A misnamed file shows a broken image icon |
| Prompts | Live in the JSON as a `prompt` field |
| Style | Ordinary phone snapshot, shared suffix on all 10 |
| Text on labels | Exact text only on the 2-3 photos opened on stage |

## 3. The JSON contract

`app/lib/library.json` — ten records:

```json
{
  "id": "tablets",
  "photo": "/library/01-tablets.jpg",
  "prompt": "A packet of white tablets on a wooden table, the label reading TAKE ONE TABLET AFTER FOOD, a blue helmet on the shelf behind next to a folded towel — photographed on a phone, natural window light, slightly off-centre, ordinary home, no people, 4:5",
  "description": "A packet of white tablets on a wooden table. The label says to take one tablet after food. There is a blue helmet on the shelf behind, next to a folded towel.",
  "tags": ["medicine", "kitchen"],
  "replies": [
    { "who": "Anna", "when": "7:20 pm", "text": "One tablet, after dinner — not before. I'll ring you at seven to check." },
    { "who": "Ben", "when": "8:04 pm", "text": "That's the same one Dr Owens gave you in June. Keep it by the kettle so you see it." }
  ]
}
```

`description` is what the app shows as the AI output. `prompt` is that same scene written
for an image generator, plus the shared style suffix. They are kept as separate fields
because the good prompt and the good on-screen sentence are not the same sentence.

Tags come from the existing vocabulary in `COMMON_TAGS` — medicine, kitchen, outdoors,
documents, keys, food, bathroom, bedroom, hallway — so archive filtering keeps working
without new chips appearing.

## 4. Files

| File | Change |
|---|---|
| `app/lib/library.json` | **New.** The 10 records. |
| `public/library/*.jpg` | **New, yours.** 10 files, names must match the JSON exactly. |
| `app/lib/data.ts` | Delete `photo()`, `rich`, `fillerDescriptions`, `fillerReplies`, `describe()`. Import the JSON, type it as `LibraryItem`, cycle it into ~112 backdated posts. |
| `app/screens.tsx` | New `LibrarySheet`. `Upload` gains an `onPickFromLibrary` path. |
| `app/page.tsx` | Hold the picked `LibraryItem` instead of a bare URL; use its description/tags; the 4s reply timer. |
| `app/mockups/page.tsx` | Add the sheet as a 10th frame. |
| `app/lib/data.test.ts` | Add: every post's photo resolves to a library record; the archive still clears 100 posts and 200 replies. |

## 5. Build order

1. Write `library.json` with your 10 subjects — descriptions, tags, replies, prompts.
2. You render the 10 images in Cursor and save them to `public/library/`.
3. Rewire `data.ts` to build the archive by cycling the records. Keep `emptyPost` working
   by forcing one recent post to have zero replies — it is the designed empty state and
   cycling would otherwise give every post replies.
4. Build `LibrarySheet` and wire `Choose from library` to it.
5. Wire the picked record through Add context → Generating → Post detail so the
   description shown is the one belonging to that photo.
6. Add the 4s scripted reply on the live post.
7. `bun test`, then walk the flow once in the browser at 390px.

Steps 1 and 2 can run in parallel with 3-6; the code does not need the images to exist to
be written, only to be demoed.

## 6. What I need from you

**Your 10 subjects.** One line each is enough — "keys in a bowl", "a letter from the bank".
I write the description, tags, family replies and prompt for each.

Two things worth choosing deliberately as you pick them:

- **Cover the tag vocabulary.** Ten photos that are all kitchen objects leave the archive's
  tag filter with nothing to filter. Spread across medicine, documents, keys, food,
  outdoors and at least two rooms.
- **Name which 2-3 you will open on stage.** Those get exact label text in the prompt and
  the strongest family replies; the other seven get text angled away, because generated
  text usually renders as garbage and a projector shows it.

## 7. Known risks

- **No image fallback, by choice.** One misnamed file is a broken icon on stage with no
  clue why. Mitigation is a single check: after saving the images, load `/mockups` and
  confirm ten photos, not nine.
- **Repetition.** Ten images across ~112 posts means each appears ~11 times. Invisible
  while scrolling at speed, obvious if you stop. If it bothers you on the day, the fix is
  more records in the JSON — no code changes.
