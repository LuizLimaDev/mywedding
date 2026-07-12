import { type InvitedBy, type RegisteredGuest } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type SeedRow = {
  fullName: string;
  kinship: string;
  typeCode: "AD" | "CRI" | "AS";
  invitedBy: InvitedBy;
};

const seedRows: SeedRow[] = [
  { fullName: "Marisa", kinship: "mae", typeCode: "AD", invitedBy: "GROOM" },
  { fullName: "Marcos", kinship: "irmao", typeCode: "AD", invitedBy: "GROOM" },
  { fullName: "Tamy", kinship: "cunhada", typeCode: "AD", invitedBy: "GROOM" },
  { fullName: "Rael", kinship: "sobrinho", typeCode: "CRI", invitedBy: "GROOM" },
  { fullName: "Bento", kinship: "sobrinho", typeCode: "CRI", invitedBy: "GROOM" },
  { fullName: "Ana", kinship: "irma", typeCode: "AD", invitedBy: "GROOM" },
  { fullName: "Beto", kinship: "tio", typeCode: "AD", invitedBy: "GROOM" },
  { fullName: "Margareth", kinship: "tia", typeCode: "AD", invitedBy: "GROOM" },
  { fullName: "Rafael", kinship: "primo", typeCode: "AD", invitedBy: "GROOM" },
  { fullName: "Rafaela", kinship: "prima", typeCode: "AD", invitedBy: "GROOM" },
  { fullName: "Duda", kinship: "prima", typeCode: "CRI", invitedBy: "GROOM" },
  { fullName: "Rosangela", kinship: "tia", typeCode: "AD", invitedBy: "GROOM" },
  { fullName: "Rodrigo", kinship: "primo", typeCode: "AD", invitedBy: "GROOM" },
  { fullName: "Stallone", kinship: "amigo", typeCode: "AD", invitedBy: "GROOM" },
  { fullName: "Tia Fatima", kinship: "amiga mae", typeCode: "AD", invitedBy: "GROOM" },
  { fullName: "Lucas Arantes", kinship: "amigo", typeCode: "AD", invitedBy: "GROOM" },
  { fullName: "Esp. Lucas", kinship: "amigo", typeCode: "AD", invitedBy: "GROOM" },
  { fullName: "Pastor William", kinship: "igreja", typeCode: "AD", invitedBy: "GROOM" },
  { fullName: "Pastora Fulvia", kinship: "igreja", typeCode: "AD", invitedBy: "GROOM" },
  { fullName: "H curso noivo", kinship: "igreja", typeCode: "AD", invitedBy: "GROOM" },
  { fullName: "M curso noiva", kinship: "igreja", typeCode: "AD", invitedBy: "GROOM" },
  { fullName: "Jordan", kinship: "filho", typeCode: "CRI", invitedBy: "GROOM" },
  { fullName: "Japao", kinship: "amigo mae", typeCode: "AD", invitedBy: "GROOM" },
  { fullName: "Luiz Felipe", kinship: "amigo", typeCode: "AD", invitedBy: "GROOM" },
  { fullName: "Imaculada", kinship: "mae", typeCode: "AD", invitedBy: "BRIDE" },
  { fullName: "Esio", kinship: "pai", typeCode: "AD", invitedBy: "BRIDE" },
  { fullName: "Esio", kinship: "irmao", typeCode: "AD", invitedBy: "BRIDE" },
  { fullName: "Eduvirges", kinship: "vo", typeCode: "AD", invitedBy: "BRIDE" },
  { fullName: "Anderson", kinship: "tio", typeCode: "AD", invitedBy: "BRIDE" },
  { fullName: "Carolina", kinship: "tia", typeCode: "AD", invitedBy: "BRIDE" },
  { fullName: "Uelton", kinship: "tio", typeCode: "AD", invitedBy: "BRIDE" },
  { fullName: "Valentina", kinship: "prima", typeCode: "CRI", invitedBy: "BRIDE" },
  { fullName: "Nathan", kinship: "primo", typeCode: "AD", invitedBy: "BRIDE" },
  { fullName: "Nicolas", kinship: "primo", typeCode: "CRI", invitedBy: "BRIDE" },
  { fullName: "Viviane", kinship: "prima", typeCode: "AD", invitedBy: "BRIDE" },
  { fullName: "Marido Vivi", kinship: "primo", typeCode: "AD", invitedBy: "BRIDE" },
  { fullName: "Nicole", kinship: "prima", typeCode: "CRI", invitedBy: "BRIDE" },
  { fullName: "Rian", kinship: "primo", typeCode: "CRI", invitedBy: "BRIDE" },
  { fullName: "Camila", kinship: "prima", typeCode: "AD", invitedBy: "BRIDE" },
  { fullName: "Marido Cami", kinship: "primo", typeCode: "AD", invitedBy: "BRIDE" },
  { fullName: "Filha Cami", kinship: "prima", typeCode: "CRI", invitedBy: "BRIDE" },
  { fullName: "Filha Cami", kinship: "prima", typeCode: "CRI", invitedBy: "BRIDE" },
  { fullName: "Marcos", kinship: "amigo", typeCode: "AD", invitedBy: "BRIDE" },
  { fullName: "Fabiana", kinship: "amigo", typeCode: "AS", invitedBy: "BRIDE" },
  { fullName: "Miqueias", kinship: "amigo", typeCode: "CRI", invitedBy: "BRIDE" },
  { fullName: "Matheus", kinship: "amigo", typeCode: "CRI", invitedBy: "BRIDE" },
  { fullName: "Pr. Jefferson", kinship: "igreja", typeCode: "AD", invitedBy: "BRIDE" },
  { fullName: "Pra. Dayane", kinship: "igreja", typeCode: "AD", invitedBy: "BRIDE" },
  { fullName: "Carla", kinship: "amigo", typeCode: "AD", invitedBy: "BRIDE" },
  { fullName: "Ian", kinship: "amigo", typeCode: "AD", invitedBy: "BRIDE" },
  { fullName: "Duda", kinship: "amigo", typeCode: "AD", invitedBy: "BRIDE" },
  { fullName: "Fernanda", kinship: "amigo", typeCode: "AD", invitedBy: "BRIDE" },
  { fullName: "Marie", kinship: "amigo", typeCode: "AD", invitedBy: "BRIDE" },
  { fullName: "Sarah", kinship: "amigo", typeCode: "AD", invitedBy: "BRIDE" },
];

function normalizeName(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase();
}

function toAdultFlag(code: SeedRow["typeCode"]) {
  return code !== "CRI";
}

export async function ensureRegisteredGuestsSeeded() {
  const total = await prisma.registeredGuest.count();
  if (total > 0) {
    return;
  }

  const guests = await prisma.guest.findMany({
    select: {
      fullName: true,
      phone: true,
    },
  });

  const phoneByNormalizedName = new Map<string, string>();
  for (const guest of guests) {
    const normalized = normalizeName(guest.fullName);
    if (!phoneByNormalizedName.has(normalized)) {
      phoneByNormalizedName.set(normalized, guest.phone);
    }
  }

  await prisma.registeredGuest.createMany({
    data: seedRows.map((row) => ({
      fullName: row.fullName,
      phone: phoneByNormalizedName.get(normalizeName(row.fullName)) ?? "",
      kinship: row.kinship,
      isAdult: toAdultFlag(row.typeCode),
      invitedBy: row.invitedBy,
    })),
    skipDuplicates: true,
  });
}

export type RegisteredGuestWithConfirmed = RegisteredGuest & {
  confirmed: boolean;
};

function normalizedPhone(value: string) {
  return value.replace(/\D/g, "");
}

function pairKey(name: string, phone: string) {
  return `${normalizeName(name)}::${normalizedPhone(phone)}`;
}

export function buildConfirmedPairSet(
  guests: Array<{ fullName: string; phone: string }>,
): Set<string> {
  const set = new Set<string>();

  for (const guest of guests) {
    if (!guest.phone.trim()) {
      continue;
    }

    set.add(pairKey(guest.fullName, guest.phone));
  }

  return set;
}

export function isPairConfirmed(set: Set<string>, fullName: string, phone: string) {
  if (!phone.trim()) {
    return false;
  }

  return set.has(pairKey(fullName, phone));
}
