"use client";

import { useEffect, useState } from "react";
import {
  READING_PLANS,
  getPlan,
  getPlanState,
  markPlanProgress,
  planPercent,
  startPlan,
} from "@/services/plans";
import type { ReadingPlanState } from "@/types/quran";
import { Button } from "@/components/ui/button";

export function PlanCard() {
  const [state, setState] = useState<ReadingPlanState | null>(null);

  useEffect(() => {
    void getPlanState().then((item) => setState(item ?? null));
  }, []);

  const plan = state ? getPlan(state.planId) : getPlan("khatm-30");
  const percent = state ? planPercent(state) : 0;

  return (
    <section className="rounded-3xl border border-line p-5">
      <p className="text-xs tracking-[0.18em] text-muted">Okuma planı</p>
      <h2 className="mt-2 text-xl font-medium">{plan.title}</h2>
      <p className="mt-1 text-sm text-muted">{plan.description}</p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-mute" aria-hidden="true">
        <div className="h-full bg-accent" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 text-sm text-muted">
        {state?.completedUnits ?? 0}/{plan.totalUnits} · %{percent}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {READING_PLANS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`rounded-full px-3 py-1 text-xs ${
              plan.id === item.id ? "bg-accent text-[var(--bg)]" : "bg-mute"
            }`}
            onClick={async () => setState(await startPlan(item.id))}
          >
            {item.title}
          </button>
        ))}
      </div>
      <Button
        className="mt-4"
        size="sm"
        onClick={async () => setState(await markPlanProgress())}
      >
        Bugünkü hedefi tamamla
      </Button>
    </section>
  );
}
