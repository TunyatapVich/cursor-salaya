import { notFound } from "next/navigation";
import { getPost } from "../../lib/data";
import { Phone, PostDetail } from "../../screens";

export default async function Page({ params }: PageProps<"/post/[id]">) {
  const { id } = await params;
  const post = getPost(id);
  if (!post) notFound();

  return (
    <Phone>
      <PostDetail post={post} />
    </Phone>
  );
}
