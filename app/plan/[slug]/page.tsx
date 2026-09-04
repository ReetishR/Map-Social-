import { PlanExperience } from "@/components/plan/PlanExperience";

export default async function PlanPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PlanExperience slug={slug} />;
}
