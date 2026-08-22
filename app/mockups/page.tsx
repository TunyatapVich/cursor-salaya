import Link from "next/link";
import { emptyPost, getPost } from "../lib/data";
import {
  AddContext,
  ArchiveGrid,
  ArchiveStory,
  Generating,
  PeriodSummary,
  Phone,
  PostDetail,
  Upload,
} from "../screens";

const demo = getPost("p0")!;

function Frame({ n, title, note, children }: { n: number; title: string; note: string; children: React.ReactNode }) {
  return (
    <figure className="w-[390px]">
      <Phone className="h-[844px] rounded-[28px] border border-line">{children}</Phone>
      <figcaption className="pt-3">
        <p className="text-name font-medium">
          {n}. {title}
        </p>
        <p className="text-meta text-muted">{note}</p>
      </figcaption>
    </figure>
  );
}

export default function Page() {
  return (
    <div className="min-h-dvh bg-[#eeeae4] px-8 py-12">
      <header className="mx-auto max-w-[1700px] pb-10">
        <h1 className="text-title font-medium">Shared memory — screens</h1>
        <p className="mt-2 max-w-[60ch] text-ai text-muted">
          Take a photo. The AI says what it sees. Save. Archive keeps filters and Add a photo / Story view at the bottom.
        </p>
        <Link href="/" className="mt-3 inline-block text-meta text-accent underline underline-offset-4">
          Open the live flow &rsaquo;
        </Link>
      </header>

      <div className="mx-auto flex max-w-[1700px] flex-wrap justify-center gap-x-10 gap-y-14">
        <Frame n={1} title="Upload" note="The only thing the poster ever has to do.">
          <Upload />
        </Frame>
        <Frame n={2} title="Describe" note="AI reads the photo. Then Save.">
          <Generating photo={demo.photo} />
        </Frame>
        <Frame n={3} title="Describe — ready" note="One button. Then History.">
          <AddContext photo={demo.photo} />
        </Frame>
        <Frame n={4} title="Post detail" note="Description block, tags, then what the family wrote.">
          <PostDetail post={demo} />
        </Frame>
        <Frame n={5} title="Post detail — empty" note="No one has written yet. The input row stays prominent.">
          <PostDetail post={emptyPost} />
        </Frame>
        <Frame n={6} title="Writing a response" note="Photo shrinks, quick-insert chips do the typing.">
          <PostDetail post={demo} writing />
        </Frame>
        <Frame n={7} title="Archive — grid" note="Period pill at the top; tags and Add a photo / Story view at the bottom.">
          <ArchiveGrid />
        </Frame>
        <Frame n={8} title="Archive — story" note="Circular X closes; tap zones do not cover it.">
          <ArchiveStory start={2} auto={false} />
        </Frame>
        <Frame n={9} title="Period summary" note="Ends the demo: what a year of small moments adds up to.">
          <PeriodSummary />
        </Frame>
      </div>
    </div>
  );
}
