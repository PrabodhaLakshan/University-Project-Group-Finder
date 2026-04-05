import {
  GET as startupConnectRecentWorksGet,
  POST as startupConnectRecentWorksPost,
} from "@/app/api/startup-connect/dashboard/recent-works/route";

export const runtime = "nodejs";
export const GET = startupConnectRecentWorksGet;
export const POST = startupConnectRecentWorksPost;
