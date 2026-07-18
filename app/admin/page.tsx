import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import {
  buildConfirmedPairSet,
  ensureRegisteredGuestsSeeded,
  isPairConfirmed,
} from "@/lib/registered-guests";
import AdminDashboardClient from "./AdminDashboardClient";

const WEDDING_DATE = "2026-10-17T16:30:00-03:00";

type GuestRow = {
  id: string;
  fullName: string;
  phone: string;
  isAdult: boolean;
  invitedBy: "GROOM" | "BRIDE";
  dietaryRestrictions: string | null;
  submission: {
    confirmedAt: Date;
  };
};

type RegisteredGuestRow = {
  id: string;
  fullName: string;
  phone: string;
  kinship: string;
  isAdult: boolean;
  invitedBy: "GROOM" | "BRIDE";
};

type GuestMessageRow = {
  id: string;
  names: string;
  message: string;
  createdAt: Date;
};

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

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  await ensureRegisteredGuestsSeeded();

  const confirmedGuests = await prisma.guest.count();
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
  })) as GuestRow[];

  const registeredGuests = (await prisma.registeredGuest.findMany({
    orderBy: [{ invitedBy: "asc" }, { fullName: "asc" }],
  })) as RegisteredGuestRow[];

  const guestMessages = (await prisma.guestMessage.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })) as GuestMessageRow[];

  const guestPairSet = buildConfirmedPairSet(
    guests.map((guest) => ({
      fullName: guest.fullName,
      phone: guest.phone,
    })),
  );

  const registeredPairSet = buildConfirmedPairSet(
    registeredGuests.map((guest) => ({
      fullName: guest.fullName,
      phone: guest.phone,
    })),
  );

  return (
    <AdminDashboardClient
      weddingDate={WEDDING_DATE}
      confirmedGuests={confirmedGuests}
      registeredGuestsCount={registeredGuests.length}
      registeredGuests={registeredGuests.map((guest) => ({
        ...guest,
        confirmed: isPairConfirmed(guestPairSet, guest.fullName, guest.phone),
      }))}
      guests={guests.map((guest) => ({
        id: guest.id,
        fullName: guest.fullName,
        phone: guest.phone,
        isAdult: guest.isAdult,
        invitedBy: guest.invitedBy,
        dietaryRestrictions: guest.dietaryRestrictions,
        confirmedAt: formatDatePtBrSaoPaulo(new Date(guest.submission.confirmedAt)),
        isRegistered: isPairConfirmed(registeredPairSet, guest.fullName, guest.phone),
      }))}
      guestMessages={guestMessages.map((message) => ({
        id: message.id,
        names: message.names,
        message: message.message,
        createdAt: formatDatePtBrSaoPaulo(new Date(message.createdAt)),
      }))}
    />
  );
}
