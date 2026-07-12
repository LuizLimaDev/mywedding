import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

type GuestCsvRow = {
  fullName: string;
  phone: string;
  isAdult: boolean;
  invitedBy: "GROOM" | "BRIDE";
  dietaryRestrictions: string | null;
  submission: {
    confirmedAt: Date;
  };
};

function csvCell(value: string) {
  const escaped = value.replaceAll('"', '""');
  return `"${escaped}"`;
}

function formatDatePtBrSaoPaulo(date: Date) {
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${values.day}/${values.month}/${values.year} ${values.hour}:${values.minute}`;
}

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return Response.json({ error: "Nao autorizado" }, { status: 401 });
  }

  const guests = (await prisma.guest.findMany({
    include: {
      submission: {
        select: {
          confirmedAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })) as GuestCsvRow[];

  const header = [
    "nome",
    "telefone",
    "tipo",
    "convidado_de",
    "restricao_alimentar",
    "data_confirmacao",
  ];

  const rows = guests.map((guest) => {
    return [
      guest.fullName,
      guest.phone,
      guest.isAdult ? "adulto" : "crianca",
      guest.invitedBy === "GROOM" ? "noivo" : "noiva",
      guest.dietaryRestrictions ?? "",
      formatDatePtBrSaoPaulo(new Date(guest.submission.confirmedAt)),
    ]
      .map((value) => csvCell(value))
      .join(",");
  });

  const csv = [header.join(","), ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="convidados-rsvp.csv"',
      "Cache-Control": "no-store",
    },
  });
}
