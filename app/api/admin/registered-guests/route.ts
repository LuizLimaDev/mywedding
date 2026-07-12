import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

type CreateBody = {
  fullName?: unknown;
  phone?: unknown;
  kinship?: unknown;
  isAdult?: unknown;
  invitedBy?: unknown;
};

function validateBody(body: CreateBody) {
  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const kinship = typeof body.kinship === "string" ? body.kinship.trim() : "";

  if (fullName.length < 2) {
    throw new Error("Nome invalido.");
  }

  if (typeof body.isAdult !== "boolean") {
    throw new Error("Tipo invalido.");
  }

  if (body.invitedBy !== "GROOM" && body.invitedBy !== "BRIDE") {
    throw new Error("Convidado de invalido.");
  }

  return {
    fullName,
    phone,
    kinship,
    isAdult: body.isAdult,
    invitedBy: body.invitedBy as "GROOM" | "BRIDE",
  };
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Nao autorizado." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as CreateBody;
    const data = validateBody(body);

    const guest = await prisma.registeredGuest.create({ data });
    return Response.json({ guest });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao criar convidado.";
    return Response.json({ error: message }, { status: 400 });
  }
}
