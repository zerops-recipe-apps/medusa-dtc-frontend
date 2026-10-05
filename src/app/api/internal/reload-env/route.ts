import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

/**
 * Called from medusa `yarn reloadNextstoreEnv` after seed writes CHANNEL_PUBLISHABLE_KEY.
 * Do not exit — Zerops must keep :8000 up for readiness; key loads from env or medusa internal API.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.RELOAD_SECRET || process.env.REVALIDATE_SECRET
  const provided = request.headers.get("x-reload-secret")

  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return NextResponse.json({ status: "ok" })
}
