import { PlanCard } from "@/features/plans/plan-card";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Okuma planı",
  path: "/plan",
});

export default function PlanPage() {
  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-3xl font-semibold">Okuma planı</h1>
      <PlanCard />
    </div>
  );
}
