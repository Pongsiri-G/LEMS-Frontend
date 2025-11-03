import { apiClient } from "../apiClient";
import { Log, toLog } from "@/src/types/log";

export type LogQueryParams = {
  logType?: string;
  q?: string;
  sort?: string;
};

// ดึง Logs
export async function getLogs(params?: LogQueryParams): Promise<Log[]> {
  const query: Record<string, string> = {};
  if (params?.logType && params.logType !== "all") query.logType = params.logType;
  if (params?.q) query.q = params.q;
  if (params?.sort) query.sort = params.sort;

  const res = await apiClient.get("/v1/admin/logs", { params: query });
  const raw = (res.data?.data ?? res.data ?? []) as any[];
  return raw.map(toLog);
}
