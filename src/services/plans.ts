import { idbGet, idbPut, STORES } from "@/lib/db";
import type { ReadingPlan, ReadingPlanId, ReadingPlanState } from "@/types/quran";

export const READING_PLANS: ReadingPlan[] = [
  {
    id: "page-1",
    title: "Günde 1 sayfa",
    description: "Medine mushafına göre her gün bir sayfa.",
    unit: "page",
    dailyTarget: 1,
    totalUnits: 604,
  },
  {
    id: "page-5",
    title: "Günde 5 sayfa",
    description: "Yaklaşık dört ayda hatim.",
    unit: "page",
    dailyTarget: 5,
    totalUnits: 604,
  },
  {
    id: "page-10",
    title: "Günde 10 sayfa",
    description: "İki ayda hatim temposu.",
    unit: "page",
    dailyTarget: 10,
    totalUnits: 604,
  },
  {
    id: "khatm-30",
    title: "30 günde hatim",
    description: "Her gün bir cüz.",
    unit: "page",
    dailyTarget: 20,
    totalUnits: 604,
  },
  {
    id: "nuzul",
    title: "Nüzul sırasıyla",
    description: "Her gün bir sure, ilk inen sureden son inene.",
    unit: "surah",
    dailyTarget: 1,
    totalUnits: 114,
  },
];

export function getPlan(id: ReadingPlanId) {
  return READING_PLANS.find((plan) => plan.id === id) ?? READING_PLANS[0];
}

export async function getPlanState(): Promise<ReadingPlanState | undefined> {
  return idbGet<ReadingPlanState & { id: string }>(STORES.plans, "active");
}

export async function startPlan(planId: ReadingPlanId) {
  const state: ReadingPlanState & { id: string } = {
    id: "active",
    planId,
    startedAt: new Date().toISOString(),
    completedUnits: 0,
  };
  await idbPut(STORES.plans, state);
  return state;
}

export async function markPlanProgress(delta = 1) {
  const current = (await getPlanState()) ?? (await startPlan("khatm-30"));
  const plan = getPlan(current.planId);
  const next: ReadingPlanState & { id: string } = {
    id: "active",
    ...current,
    completedUnits: Math.min(plan.totalUnits, current.completedUnits + delta),
    lastCompletedAt: new Date().toISOString(),
  };
  await idbPut(STORES.plans, next);
  return next;
}

export function planPercent(state: ReadingPlanState) {
  const plan = getPlan(state.planId);
  return Math.round((state.completedUnits / plan.totalUnits) * 100);
}
