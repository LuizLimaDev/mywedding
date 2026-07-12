import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

type UpdateBody = {
  fullName?: unknown;
  phone?: unknown;
  kinship?: unknown;
  isAdult?: unknown;
  invitedBy?: unknown;
};

function validateBody(body: UpdateBody) {
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

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Nao autorizado." }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = (await request.json()) as UpdateBody;
    const data = validateBody(body);

    const guest = await prisma.registeredGuest.update({
      where: { id },
      data,
    });

    return Response.json({ guest });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao atualizar convidado.";
    return Response.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Nao autorizado." }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    await prisma.registeredGuest.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao deletar convidado.";
    return Response.json({ error: message }, { status: 400 });
  }
}
