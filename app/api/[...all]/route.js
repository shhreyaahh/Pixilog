export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  return Response.json({
    ok: true,
    message: "Catch-all API handler is active",
    params
  });
}

export async function POST(req, { params }) {
  return Response.json({
    ok: true,
    message: "Catch-all API handler is active (POST)",
    params
  });
}
