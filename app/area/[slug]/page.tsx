import { AreaView } from "@/components/AreaView";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <AreaView slug={slug} />;
}
