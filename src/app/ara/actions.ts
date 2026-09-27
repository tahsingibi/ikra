"use server";

import { searchQuran } from "@/services/search";
import type { SearchFilters, SearchHit } from "@/types/quran";

export async function searchAction(filters: SearchFilters): Promise<SearchHit[]> {
  return searchQuran(filters);
}
