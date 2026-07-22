"use client";

import { FormEvent, useMemo, useState } from "react";

type GuestForm = {
  fullName: string;
  phone: string;
  isAdult: boolean;
  invitedBy: "GROOM" | "BRIDE";
  dietaryRestrictions: string;
};

const makeEmptyGuest = (): GuestForm => ({
  fullName: "",
  phone: "",
  isAdult: true,
  invitedBy: "GROOM",
  dietaryRestrictions: "",
});

export default function RSVPButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [guests, setGuests] = useState<GuestForm[]>([makeEmptyGuest()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return guests.every((guest) => guest.fullName.trim() && guest.phone.trim());
  }, [guests]);

  const updateGuest = <K extends keyof GuestForm>(index: number, key: K, value: GuestForm[K]) => {
    setGuests((prevGuests) =>
      prevGuests.map((guest, currentIndex) =>
        currentIndex === index ? { ...guest, [key]: value } : guest,
      ),
    );
  };

  const resetForm = () => {
    setGuests([makeEmptyGuest()]);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!canSubmit) {
      setErrorMessage("Preencha nome e telefone para todos os convidados.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guests: guests.map((guest) => ({
            ...guest,
            fullName: guest.fullName.trim(),
            phone: guest.phone.trim(),
            dietaryRestrictions: guest.dietaryRestrictions.trim(),
          })),
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Nao foi possivel enviar o RSVP.");
      }

      setSuccessMessage("Presenca confirmada com sucesso!");
      setGuests([makeEmptyGuest()]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao confirmar presenca.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        className="border border-foreground rounded-full bg-foreground text-white px-4 py-2 mt-4 font-bold text-sm cursor-pointer"
        onClick={() => {
          resetForm();
          setIsOpen(true);
        }}
      >
        Confirme sua presenca
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#F8F7F3] p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-cinzel text-xl font-bold uppercase">Confirmar presenca</h2>
              <button
                type="button"
                className="rounded-full border border-foreground px-3 py-1 text-sm cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Fechar
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              {guests.map((guest, index) => (
                <div key={index} className="rounded-xl border border-foreground/30 bg-white p-4">
                  <h3 className="mb-4 font-cinzel text-sm font-bold uppercase">
                    Convidado {index + 1}
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-semibold">Nome</span>
                      <input
                        required
                        value={guest.fullName}
                        onChange={(event) => updateGuest(index, "fullName", event.target.value)}
                        className="rounded-lg border border-foreground/40 px-3 py-2"
                        placeholder="Nome completo"
                      />
                    </label>

                    <label className="flex flex-col gap-1">
                      <span className="text-sm font-semibold">Telefone com WhatsApp</span>
                      <input
                        required
                        value={guest.phone}
                        onChange={(event) => updateGuest(index, "phone", event.target.value)}
                        className="rounded-lg border border-foreground/40 px-3 py-2"
                        placeholder="(14) 99999-9999"
                      />
                    </label>

                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-semibold">Tipo de convidado</span>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={guest.isAdult}
                          onChange={() => updateGuest(index, "isAdult", true)}
                        />
                        Adulto
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={!guest.isAdult}
                          onChange={() => updateGuest(index, "isAdult", false)}
                        />
                        Crianca
                      </label>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-semibold">Convidado de</span>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={guest.invitedBy === "GROOM"}
                          onChange={() => updateGuest(index, "invitedBy", "GROOM")}
                        />
                        Noivo
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={guest.invitedBy === "BRIDE"}
                          onChange={() => updateGuest(index, "invitedBy", "BRIDE")}
                        />
                        Noiva
                      </label>
                    </div>

                    <label className="flex flex-col gap-1 md:col-span-2">
                      <span className="text-sm font-semibold">Restricao alimentar</span>
                      <textarea
                        value={guest.dietaryRestrictions}
                        onChange={(event) =>
                          updateGuest(index, "dietaryRestrictions", event.target.value)
                        }
                        className="min-h-22.5 rounded-lg border border-foreground/40 px-3 py-2"
                        placeholder="Informe se houver"
                      />
                    </label>
                  </div>
                </div>
              ))}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setGuests((prev) => [...prev, makeEmptyGuest()])}
                  className="rounded-full border border-foreground px-4 py-2 text-sm font-semibold cursor-pointer"
                >
                  + Adicionar
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || !canSubmit}
                  className="rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-white disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? "Enviando..." : "Enviar RSVP"}
                </button>
              </div>

              {errorMessage ? <p className="text-sm text-red-700">{errorMessage}</p> : null}
              {successMessage ? <p className="text-sm text-green-700">{successMessage}</p> : null}
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
