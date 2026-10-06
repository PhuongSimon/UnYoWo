import { queryOptions } from "@tanstack/react-query";
import { http } from "@/lib/http";
import type { Dashboard } from "./types";

export const dashboardApi = {
  get: () => http.get<Dashboard>("/dashboard").then((r) => r.data),
};

// Refreshed after every finished game (useSessionCompletion invalidates it).
export const dashboardQuery = queryOptions({
  queryKey: ["dashboard"],
  queryFn: () => dashboardApi.get(),
  staleTime: 30_000,
});
