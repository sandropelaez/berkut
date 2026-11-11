import type { ApiRequest, ApiResponse } from "./_lib/http.js";

export default function handler(_req: ApiRequest, res: ApiResponse) {
  res.status(200).json({
    status: "ok",
    service: "berkut",
    version: "1.1.0",
    time: new Date().toISOString(),
  });
}
