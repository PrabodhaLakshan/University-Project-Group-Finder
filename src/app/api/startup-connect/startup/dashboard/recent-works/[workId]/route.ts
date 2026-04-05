import {
  PATCH as startupConnectRecentWorksPatch,
  DELETE as startupConnectRecentWorksDelete,
} from "@/app/api/startup-connect/dashboard/recent-works/[workId]/route";

export const runtime = "nodejs";
export const PATCH = startupConnectRecentWorksPatch;
export const DELETE = startupConnectRecentWorksDelete;
