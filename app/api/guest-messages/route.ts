import { prisma } from "@/lib/prisma";

type CreateBody = {
  names?: unknown;
  message?: unknown;
};

function validateBody(body: CreateBody) {
  const names = typeof body.names === "string" ? body.names.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (names.length < 2) {
    throw new Error("Preencha o campo de nomes.");
  }

  if (message.length < 3) {
    throw new Error("Preencha sua mensagem.");
  }

  return { names, message };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateBody;
    const data = validateBody(body);

    const guestMessage = await prisma.guestMessage.create({ data });
    return Response.json({ guestMessage });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Nao foi possivel enviar a mensagem.";
    return Response.json({ error: message }, { status: 400 });
  }
}
