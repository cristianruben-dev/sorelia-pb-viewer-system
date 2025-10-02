// Este archivo ya no es necesario - las rutas están en /api/auth/login y /api/auth/logout
export async function GET() {
  return new Response("Auth endpoint moved", { status: 404 });
}

export async function POST() {
  return new Response("Auth endpoint moved", { status: 404 });
}