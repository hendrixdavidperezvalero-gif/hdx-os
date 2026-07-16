import { PlanView } from "@/components/PlanView";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PlanView id={id} />;
}
