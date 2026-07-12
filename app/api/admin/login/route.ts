import { createAdminSession, validateAdminCredentials } from "@/lib/admin-auth";

type LoginBody = {
  username?: unknown;
  password?: unknown;
};

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBody;
  const username = typeof body.username === "string" ? body.username : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!validateAdminCredentials(username, password)) {
    return Response.json({ error: "Login ou senha invalidos." }, { status: 401 });
  }

  await createAdminSession(username);
  return Response.json({ ok: true });
}
