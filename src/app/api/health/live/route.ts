export const dynamic = "force-static";
export async function GET() {
  return Response.json({ status: "ok", service: "website" }, { headers: { "Cache-Control": "no-store" } });
}
