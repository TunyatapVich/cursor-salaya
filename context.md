Shared memory — product and UI brief

A small shared space for a family. You post a photo of an ordinary moment. The app describes what it sees in the photo. The people who love you read it, and write back the thing you'll need to remember later — how to take the medicine, where you left the helmet, which one is the right key.

The AI describes. The people care. That separation is the whole product.

1. The idea in one paragraph

Older parents forget things, and their children live far away. Existing solutions either ask the parent to learn a complicated app, or replace the family with a chatbot. This does neither. The parent only ever does one thing — take a photo. Everything else is done by the people who already want to help. The app's job is to turn a photo into something a family member can respond to, and to keep those responses somewhere findable.

Over time the shared space becomes an archive of a year of small moments, browsable by period.

2. Who does what

There are two roles, and they use the same app.

The poster — usually the parent or grandparent. Takes a photo. Optionally types one short line. Never has to type anything long, never has to search, never has to configure anything.

The responder — usually the adult child. Sees the photo appear. Reads the AI's description. Writes the useful part: instructions, reminders, answers. This is the person doing the caring, and the app should make it feel like a small kind act, not a chore.

Either person can be either role. A daughter can post a photo of her own dinner and her mother can write back.

3. What the AI is allowed to do

This boundary is deliberate and should be visible in the interface.

The AI may: describe what is physically visible in the photo. Objects, text on labels, setting, time of day, colours, position of things relative to each other. Read printed text out loud in plain language. Point out details a person might not have noticed — a helmet on a shelf in the background, a bag left on a chair.

The AI may not: give medical instructions, dosages, or advice. Invent names of people. State facts about the family's life that are not visible in the image. Guess where an object is if it is not in an indexed photo.

When the AI cannot answer, it says so plainly and hands the question to the family instead. The not-found state is a designed screen, not an error.

Everything a person needs to do comes from another person.

4. Tags

Every post carries tags. Tags are what make the archive searchable later without a search engine.

The AI proposes tags from the photo — medicine, kitchen, outdoors, documents, keys, food.
Tags appear as a row of chips under the description, in a light tinted style.
Each chip is tappable to remove. A + Add tag chip at the end opens a short list of common tags plus a free text field.
Tags are never required. A post with no tags is fine.
In the archive, tapping any tag filters the whole archive to that tag.

Keep the tag vocabulary small and concrete. Nouns and rooms, not moods.

5. Screens

Mobile first, single column, 390px viewport. Warm off-white background, one accent colour, photos are the loudest element, hairline borders, 12px rounded corners, no gradients or shadows. Body text 18px minimum, buttons at least 56px tall with text labels, one primary action per screen, no tab bar and no hamburger menu.

Screen 1 — Upload

The entry point.

Muted line at top: Tuesday
Heading: Add a photo
A large empty photo slot, roughly 4:5, filling most of the screen, with a soft dashed border, a centred camera icon and the label Take a photo
Below it a quiet secondary link: Choose from library
Nothing else
Screen 2 — Add context (optional)

Shown immediately after a photo is selected.

The photo at the top, large, rounded, roughly 4:5
Heading: Anything to add?
A single-line text field, 56px tall, placeholder the new medicine from the hospital
Muted line under the field: You can skip this.
Two buttons stacked: primary Continue, and below it a quiet text link Skip

The field is genuinely optional and the interface must say so. The point is that a photo alone is enough.

Screen 3 — Generating

A brief waiting state. Keep it calm and honest.

The photo, dimmed slightly
Centred muted text: Looking at the photo…
A thin indeterminate progress line, no spinner, no percentage
No cancel button
Screen 4 — Post detail

The core screen of the app. Everything else leads here.

Top to bottom:

The photo, full width, rounded, roughly 4:5
The poster's own line if they wrote one, in 18px regular text
A visually distinct block for the AI description — light tinted background, hairline border, no rounded left-only corners. A small label above it reads What's in this photo in 13px muted text. The description itself is 17px, three to five sentences, plain language. Example: A packet of white tablets on a wooden table. The label says to take one tablet after food. There is a blue helmet on the shelf behind, next to a folded towel.
A row of tag chips
A hairline divider
Section label: From your family in 13px muted text
A list of responses. Each response is a row: a small circular avatar with initials, the person's name in 15px medium, the time in 13px muted, and the response text in 18px regular below. Responses are stacked with generous spacing, separated by hairlines, not bubbles.
Fixed at the bottom, a full-width input row: a text field with placeholder Write something helpful… and a send button

Design a second variant of this screen with no responses yet:

The From your family section shows one muted centred line: No one has written yet.
The input row is unchanged and still prominent
Screen 5 — Writing a response

Can be the same screen with the keyboard raised, or a separate frame.

The photo shrinks to a small thumbnail pinned at the top with the AI description collapsed to one line
The text field expands to three lines
Above the keyboard, a row of quick-insert chips: Take after food, Twice a day, It's in the bathroom, Call me
Primary button: Send

These chips matter — they let a busy person respond in one tap.

Screen 6 — Archive, grid view

The default archive view. Reached from a quiet link, not a nav bar.

A sticky header with the period selector: three text tabs, Week, Month, Year, current one underlined in the accent colour
Below it, a horizontally scrolling row of tag chips for filtering
Then a dense photo grid, three columns, small gaps, square crops, no captions. This should feel like the iOS Photos app — the point is volume, seeing that a lot has accumulated.
Date headings between sections: This week, March, February
Posts that have unread family responses show a small accent dot in the corner of the thumbnail
A floating button at the bottom right to switch to story view
Screen 7 — Archive, story view

The same content in a different shape. Full screen, one post at a time, swiped horizontally like Instagram stories.

Progress bars across the top showing position within the current day or period
The photo fills the screen, edge to edge
A gradient-free dark scrim only at the very bottom, behind the text, so it stays readable
Below the photo: the short description in 18px, then the number of family responses in 13px muted text, e.g. 2 replies
Tapping anywhere opens the full post detail screen
Tapping the left or right edge moves between posts, and the view auto-advances after a few seconds
Screen 8 — Archive, period summary

Shown at the end of a period in story view, or from the year tab.

Centred, mostly empty
Large number, 44px: 112
Below it in 18px: moments this year
Below that, muted: Your family wrote back 340 times.
A quiet button: See them all
6. Screens to produce
Upload
Add context
Generating
Post detail — with responses
Post detail — empty state
Writing a response
Archive — grid
Archive — story
Period summary

No login screen, no onboarding, no settings, no profile page.

7. Notes for the demo

Everything is a mockup, so the demo should be sequenced to show the loop rather than the technology.

Seed the archive with roughly forty backdated posts about one real person before the demo begins. The archive must look lived-in; an empty archive kills the idea instantly.

Show it in this order: post a photo live, let the description generate, then switch to the other person's phone and write the reminder back. That hand-off between two people is the moment the idea lands. Finish on the period summary.

Say the boundary out loud: the AI only describes what it can see, and the family provides everything that matters. It's the strongest thing about the design and it will not be obvious from the screens alone.