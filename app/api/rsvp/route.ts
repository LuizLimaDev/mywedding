import { prisma } from "@/lib/prisma";

type GuestInput = {
  fullName?: unknown;
  phone?: unknown;
  isAdult?: unknown;
  invitedBy?: unknown;
  dietaryRestrictions?: unknown;
};

type BodyInput = {
  guests?: unknown;
};

type InvitedByValue = "GROOM" | "BRIDE";

function parseGuest(raw: GuestInput) {
  if (typeof raw.fullName !== "string" || raw.fullName.trim().length < 2) {
    throw new Error("Nome invalido.");
  }

  if (typeof raw.phone !== "string" || raw.phone.trim().length < 8) {
    throw new Error("Telefone invalido.");
  }

  if (typeof raw.isAdult !== "boolean") {
    throw new Error("Tipo de convidado invalido.");
  }

  if (raw.invitedBy !== "GROOM" && raw.invitedBy !== "BRIDE") {
    throw new Error("Origem do convite invalida.");
  }

  if (typeof raw.dietaryRestrictions !== "string") {
    throw new Error("Restricao alimentar invalida.");
  }

  return {
    fullName: raw.fullName.trim(),
    phone: raw.phone.trim(),
    isAdult: raw.isAdult,
    invitedBy: raw.invitedBy as InvitedByValue,
    dietaryRestrictions: raw.dietaryRestrictions.trim() || null,
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BodyInput;

    if (!Array.isArray(body.guests) || body.guests.length === 0) {
      return Response.json({ error: "Adicione ao menos um convidado." }, { status: 400 });
    }

    const parsedGuests = body.guests.map((guest) => parseGuest(guest as GuestInput));

    await prisma.rsvpSubmission.create({
      data: {
        guests: {
          create: parsedGuests,
        },
      },
    });

    return Response.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao salvar RSVP.";
    return Response.json({ error: message }, { status: 400 });
  }
}
