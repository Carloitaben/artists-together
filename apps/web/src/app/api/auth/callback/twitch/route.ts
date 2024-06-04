import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  void request
  return Response.json("Twitch OAuth callback")
}
