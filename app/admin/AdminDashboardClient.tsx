"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import CountdownPanel from "./CountdownPanel";

type GuestRow = {
  id: string;
  fullName: string;
  phone: string;
  isAdult: boolean;
  invitedBy: "GROOM" | "BRIDE";
  dietaryRestrictions: string | null;
  confirmedAt: string;
  isRegistered: boolean;
};

type RegisteredRow = {
  id: string;
  fullName: string;
  phone: string;
  kinship: string;
  isAdult: boolean;
  invitedBy: "GROOM" | "BRIDE";
  confirmed: boolean;
};

type Props = {
  weddingDate: string;
  confirmedGuests: number;
  registeredGuestsCount: number;
  guests: GuestRow[];
  registeredGuests: RegisteredRow[];
};

type RegisteredDraft = {
  fullName: string;
  phone: string;
  kinship: string;
  typeText: string;
  invitedByText: string;
};

type AddDraft = {
  fullName: string;
  phone: string;
  kinship: string;
  isAdult: boolean;
  invitedBy: "GROOM" | "BRIDE";
};

function normalizeName(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase();
}

function normalizedPhone(value: string) {
  return value.replace(/\D/g, "");
}

function pairKey(name: string, phone: string) {
  return `${normalizeName(name)}::${normalizedPhone(phone)}`;
}

function parseTypeText(value: string) {
  const cleaned = normalizeName(value);

  if (cleaned === "ad" || cleaned === "adulto" || cleaned === "adulta") {
    return true;
  }

  if (
    cleaned === "cri" ||
    cleaned === "crianca" ||
    cleaned === "crianco" ||
    cleaned === "crianca(a)"
  ) {
    return false;
  }

  return null;
}

function parseInvitedByText(value: string) {
  const cleaned = normalizeName(value);

  if (cleaned === "noivo" || cleaned === "groom") {
    return "GROOM";
  }

  if (cleaned === "noiva" || cleaned === "bride") {
    return "BRIDE";
  }

  return null;
}

export default function AdminDashboardClient({
  weddingDate,
  confirmedGuests,
  guests,
  registeredGuests,
}: Props) {
  const [registeredRows, setRegisteredRows] = useState<RegisteredRow[]>(registeredGuests);
  const [showRegisteredTable, setShowRegisteredTable] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<RegisteredDraft | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<RegisteredRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addDraft, setAddDraft] = useState<AddDraft>({
    fullName: "",
    phone: "",
    kinship: "",
    isAdult: true,
    invitedBy: "GROOM",
  });
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const emptyRegisteredMessage = useMemo(() => {
    return "Nenhum convidado cadastrado com base nas fotos.";
  }, []);

  const guestPairSet = useMemo(() => {
    const set = new Set<string>();

    for (const guest of guests) {
      set.add(pairKey(guest.fullName, guest.phone));
    }

    return set;
  }, [guests]);

  const registeredPairSet = useMemo(() => {
    const set = new Set<string>();

    for (const guest of registeredRows) {
      if (guest.phone.trim()) {
        set.add(pairKey(guest.fullName, guest.phone));
      }
    }

    return set;
  }, [registeredRows]);

  const guestsWithMatch = useMemo(() => {
    return guests.map((guest) => ({
      ...guest,
      isRegistered: registeredPairSet.has(pairKey(guest.fullName, guest.phone)),
    }));
  }, [guests, registeredPairSet]);

  const registeredWithConfirmed = useMemo(() => {
    return registeredRows.map((guest) => ({
      ...guest,
      confirmed: guestPairSet.has(pairKey(guest.fullName, guest.phone)),
    }));
  }, [guestPairSet, registeredRows]);

  const startEditing = (guest: RegisteredRow) => {
    setFeedbackError(null);
    setFeedbackMessage(null);
    setEditingId(guest.id);
    setDraft({
      fullName: guest.fullName,
      phone: guest.phone,
      kinship: guest.kinship,
      typeText: guest.isAdult ? "Adulto" : "Crianca",
      invitedByText: guest.invitedBy === "GROOM" ? "Noivo" : "Noiva",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setDraft(null);
  };

  const saveEditing = async (guestId: string) => {
    if (!draft) {
      return;
    }

    const isAdult = parseTypeText(draft.typeText);
    const invitedBy = parseInvitedByText(draft.invitedByText);

    if (isAdult === null) {
      setFeedbackError("Tipo invalido. Use Adulto/AD ou Crianca/CRI.");
      return;
    }

    if (!invitedBy) {
      setFeedbackError("Convidado de invalido. Use Noivo ou Noiva.");
      return;
    }

    if (draft.fullName.trim().length < 2) {
      setFeedbackError("Nome precisa ter ao menos 2 caracteres.");
      return;
    }

    setIsSaving(true);
    setFeedbackError(null);
    setFeedbackMessage(null);

    try {
      const response = await fetch(`/api/admin/registered-guests/${guestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: draft.fullName.trim(),
          phone: draft.phone.trim(),
          kinship: draft.kinship.trim(),
          isAdult,
          invitedBy,
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
        guest?: RegisteredRow;
      };
      const updatedGuest = payload.guest;

      if (!response.ok || !updatedGuest) {
        throw new Error(payload.error ?? "Erro ao salvar convidado.");
      }

      setRegisteredRows((current) =>
        current.map((guest) => (guest.id === guestId ? updatedGuest : guest)),
      );
      setFeedbackMessage("Convidado atualizado com sucesso.");
      cancelEditing();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao salvar convidado.";
      setFeedbackError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);
    setFeedbackError(null);
    setFeedbackMessage(null);

    try {
      const response = await fetch(`/api/admin/registered-guests/${deleteTarget.id}`, {
        method: "DELETE",
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Erro ao deletar convidado.");
      }

      setRegisteredRows((current) => current.filter((guest) => guest.id !== deleteTarget.id));
      setDeleteTarget(null);
      setFeedbackMessage("Convidado deletado com sucesso.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao deletar convidado.";
      setFeedbackError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const addGuest = async () => {
    if (addDraft.fullName.trim().length < 2) {
      setFeedbackError("Nome do convidado precisa ter ao menos 2 caracteres.");
      return;
    }

    setIsAdding(true);
    setFeedbackError(null);
    setFeedbackMessage(null);

    try {
      const response = await fetch("/api/admin/registered-guests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: addDraft.fullName.trim(),
          phone: addDraft.phone.trim(),
          kinship: addDraft.kinship.trim(),
          isAdult: addDraft.isAdult,
          invitedBy: addDraft.invitedBy,
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
        guest?: RegisteredRow;
      };
      const createdGuest = payload.guest;

      if (!response.ok || !createdGuest) {
        throw new Error(payload.error ?? "Erro ao adicionar convidado.");
      }

      setRegisteredRows((current) => [...current, createdGuest]);
      setShowAddModal(false);
      setAddDraft({
        fullName: "",
        phone: "",
        kinship: "",
        isAdult: true,
        invitedBy: "GROOM",
      });
      setFeedbackMessage("Convidado adicionado com sucesso.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao adicionar convidado.";
      setFeedbackError(message);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F7F3] px-4 py-6 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-cinzel text-2xl font-bold uppercase">Painel administrativo</h1>
          <form action="/api/admin/logout" method="post">
            <button className="rounded-full border border-foreground px-4 py-2 text-sm font-semibold">
              Sair
            </button>
          </form>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-foreground/30 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide">Convidados confirmados</p>
            <p className="mt-2 text-3xl font-bold">{confirmedGuests}</p>
          </article>

          <button
            type="button"
            onClick={() => setShowRegisteredTable(true)}
            className="rounded-xl border border-foreground/30 bg-white p-4 text-left shadow-sm transition hover:scale-[1.01] hover:border-foreground"
          >
            <p className="text-xs uppercase tracking-wide">Convidados cadastrados</p>
            <p className="mt-2 text-3xl font-bold">{registeredRows.length}</p>
            <p className="mt-2 text-xs text-black/70">Clique para exibir a tabela de cadastrados</p>
          </button>

          <article className="rounded-xl border border-foreground/30 bg-white p-4 shadow-sm">
            <p className="text-base uppercase tracking-wide font-bold">
              👰🏾💍🤵🏾‍♂️ Contagem regressiva 🥳 🍾
            </p>
            <div className="mt-2">
              <CountdownPanel targetIsoDate={weddingDate} />
            </div>
          </article>
        </section>

        {showRegisteredTable ? (
          <section className="rounded-xl border border-foreground/30 bg-white p-4 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-cinzel text-lg font-bold uppercase">Convidados cadastrados</h2>
              <button
                type="button"
                onClick={() => setShowRegisteredTable(false)}
                className="rounded-full border border-foreground px-4 py-2 text-sm font-semibold"
              >
                Ocultar tabela
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-180 border-collapse text-sm">
                <thead>
                  <tr className="border-b border-foreground/20 text-left">
                    <th className="px-2 py-3">Nome</th>
                    <th className="px-2 py-3">Telefone</th>
                    <th className="px-2 py-3">Parentesco</th>
                    <th className="px-2 py-3">Tipo</th>
                    <th className="px-2 py-3">Convidado de</th>
                    <th className="px-2 py-3">Confirmado</th>
                    <th className="px-2 py-3">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {registeredWithConfirmed.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-2 py-4 text-center text-sm text-black/60">
                        {emptyRegisteredMessage}
                      </td>
                    </tr>
                  ) : (
                    registeredWithConfirmed.map((guest) => (
                      <tr key={guest.id} className="border-b border-foreground/10 align-top">
                        <td className="px-2 py-3">
                          {editingId === guest.id ? (
                            <input
                              value={draft?.fullName ?? ""}
                              onChange={(event) =>
                                setDraft((current) =>
                                  current ? { ...current, fullName: event.target.value } : current,
                                )
                              }
                              className="w-full rounded border border-foreground/30 px-2 py-1"
                            />
                          ) : (
                            guest.fullName
                          )}
                        </td>
                        <td className="px-2 py-3">
                          {editingId === guest.id ? (
                            <input
                              value={draft?.phone ?? ""}
                              onChange={(event) =>
                                setDraft((current) =>
                                  current ? { ...current, phone: event.target.value } : current,
                                )
                              }
                              className="w-full rounded border border-foreground/30 px-2 py-1"
                            />
                          ) : (
                            guest.phone || "-"
                          )}
                        </td>
                        <td className="px-2 py-3">
                          {editingId === guest.id ? (
                            <input
                              value={draft?.kinship ?? ""}
                              onChange={(event) =>
                                setDraft((current) =>
                                  current ? { ...current, kinship: event.target.value } : current,
                                )
                              }
                              className="w-full rounded border border-foreground/30 px-2 py-1"
                            />
                          ) : (
                            guest.kinship
                          )}
                        </td>
                        <td className="px-2 py-3">
                          {editingId === guest.id ? (
                            <input
                              value={draft?.typeText ?? ""}
                              onChange={(event) =>
                                setDraft((current) =>
                                  current ? { ...current, typeText: event.target.value } : current,
                                )
                              }
                              className="w-full rounded border border-foreground/30 px-2 py-1"
                              placeholder="Adulto ou Crianca"
                            />
                          ) : guest.isAdult ? (
                            "Adulto"
                          ) : (
                            "Crianca"
                          )}
                        </td>
                        <td className="px-2 py-3">
                          {editingId === guest.id ? (
                            <input
                              value={draft?.invitedByText ?? ""}
                              onChange={(event) =>
                                setDraft((current) =>
                                  current
                                    ? { ...current, invitedByText: event.target.value }
                                    : current,
                                )
                              }
                              className="w-full rounded border border-foreground/30 px-2 py-1"
                              placeholder="Noivo ou Noiva"
                            />
                          ) : guest.invitedBy === "GROOM" ? (
                            "Noivo"
                          ) : (
                            "Noiva"
                          )}
                        </td>
                        <td className="px-2 py-3 text-lg">{guest.confirmed ? "✅" : ""}</td>
                        <td className="px-2 py-3">
                          <div className="flex flex-wrap gap-2">
                            {editingId === guest.id ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => saveEditing(guest.id)}
                                  disabled={isSaving}
                                  className="rounded border border-foreground px-2 py-1 text-xs font-semibold"
                                >
                                  💾 Salvar
                                </button>
                                <button
                                  type="button"
                                  onClick={cancelEditing}
                                  className="rounded border border-foreground/50 px-2 py-1 text-xs"
                                >
                                  Cancelar
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => startEditing(guest)}
                                className="rounded border border-foreground px-2 py-1 text-xs font-semibold"
                              >
                                ✏️ Editar
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setDeleteTarget(guest)}
                              className="rounded border border-red-700 px-2 py-1 text-xs font-semibold text-red-700"
                            >
                              🗑️ Deletar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white"
              >
                Adicionar convidado
              </button>
            </div>

            {feedbackMessage ? (
              <p className="mt-3 text-sm text-green-700">{feedbackMessage}</p>
            ) : null}
            {feedbackError ? <p className="mt-3 text-sm text-red-700">{feedbackError}</p> : null}
          </section>
        ) : null}

        <section className="rounded-xl border border-foreground/30 bg-white p-4 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-cinzel text-lg font-bold uppercase">Lista de convidados</h2>
            <Link
              href="/api/admin/export"
              className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white"
            >
              Baixar CSV
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-180 border-collapse text-sm">
              <thead>
                <tr className="border-b border-foreground/20 text-left">
                  <th className="px-2 py-3">Nome</th>
                  <th className="px-2 py-3">Telefone</th>
                  <th className="px-2 py-3">Tipo</th>
                  <th className="px-2 py-3">Convidado de</th>
                  <th className="px-2 py-3">Restricao alimentar</th>
                  <th className="px-2 py-3">Data confirmacao</th>
                  <th className="px-2 py-3">Cadastrado</th>
                </tr>
              </thead>
              <tbody>
                {guestsWithMatch.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-2 py-4 text-center text-sm text-black/60">
                      Nenhum RSVP recebido ate o momento.
                    </td>
                  </tr>
                ) : (
                  guestsWithMatch.map((guest) => (
                    <tr key={guest.id} className="border-b border-foreground/10 align-top">
                      <td className="px-2 py-3">{guest.fullName}</td>
                      <td className="px-2 py-3">{guest.phone}</td>
                      <td className="px-2 py-3">{guest.isAdult ? "Adulto" : "Crianca"}</td>
                      <td className="px-2 py-3">
                        {guest.invitedBy === "GROOM" ? "Noivo" : "Noiva"}
                      </td>
                      <td className="px-2 py-3">{guest.dietaryRestrictions || "-"}</td>
                      <td className="px-2 py-3">{guest.confirmedAt}</td>
                      <td className="px-2 py-3 text-lg">{guest.isRegistered ? "✅" : ""}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl">
            <h3 className="font-cinzel text-lg font-bold uppercase">Confirmar delecao</h3>
            <p className="mt-2 text-sm text-black/80">
              Deseja realmente deletar <strong>{deleteTarget.fullName}</strong>?
            </p>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-full border border-foreground px-4 py-2 text-sm font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {isDeleting ? "Deletando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showAddModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
            <h3 className="font-cinzel text-lg font-bold uppercase">Adicionar convidado</h3>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="flex flex-col gap-1 md:col-span-2">
                <span className="text-sm font-semibold">Nome</span>
                <input
                  value={addDraft.fullName}
                  onChange={(event) =>
                    setAddDraft((current) => ({ ...current, fullName: event.target.value }))
                  }
                  className="rounded-lg border border-foreground/40 px-3 py-2"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold">Telefone</span>
                <input
                  value={addDraft.phone}
                  onChange={(event) =>
                    setAddDraft((current) => ({ ...current, phone: event.target.value }))
                  }
                  className="rounded-lg border border-foreground/40 px-3 py-2"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold">Parentesco</span>
                <input
                  value={addDraft.kinship}
                  onChange={(event) =>
                    setAddDraft((current) => ({ ...current, kinship: event.target.value }))
                  }
                  className="rounded-lg border border-foreground/40 px-3 py-2"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold">Tipo</span>
                <select
                  value={addDraft.isAdult ? "ADULT" : "CHILD"}
                  onChange={(event) =>
                    setAddDraft((current) => ({
                      ...current,
                      isAdult: event.target.value === "ADULT",
                    }))
                  }
                  className="rounded-lg border border-foreground/40 px-3 py-2"
                >
                  <option value="ADULT">Adulto</option>
                  <option value="CHILD">Crianca</option>
                </select>
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold">Convidado de</span>
                <select
                  value={addDraft.invitedBy}
                  onChange={(event) =>
                    setAddDraft((current) => ({
                      ...current,
                      invitedBy: event.target.value as "GROOM" | "BRIDE",
                    }))
                  }
                  className="rounded-lg border border-foreground/40 px-3 py-2"
                >
                  <option value="GROOM">Noivo</option>
                  <option value="BRIDE">Noiva</option>
                </select>
              </label>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-full border border-foreground px-4 py-2 text-sm font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={addGuest}
                disabled={isAdding}
                className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {isAdding ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
