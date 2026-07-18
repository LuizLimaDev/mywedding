"use client";

import { FormEvent, useMemo, useState } from "react";

type FormState = {
  names: string;
  message: string;
};

const EMPTY_FORM: FormState = {
  names: "",
  message: "",
};

export default function GuestMessageForm() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return form.names.trim().length >= 2 && form.message.trim().length >= 3;
  }, [form.message, form.names]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedbackError(null);
    setFeedbackSuccess(null);

    if (!canSubmit) {
      setFeedbackError("Preencha nomes e mensagem antes de enviar.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/guest-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          names: form.names.trim(),
          message: form.message.trim(),
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Nao foi possivel enviar sua mensagem.");
      }

      setForm(EMPTY_FORM);
      setFeedbackSuccess("Mensagem enviada com sucesso!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao enviar mensagem.";
      setFeedbackError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full mt-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="guest-names" className="font-cinzel uppercase text-[0.75rem] tracking-wide">
          Nomes
        </label>
        <input
          id="guest-names"
          value={form.names}
          onChange={(event) => setForm((current) => ({ ...current, names: event.target.value }))}
          className="h-10 w-full rounded-sm border border-foreground/50 bg-[#E6DFD5] px-3 font-cormorant text-[1rem] outline-none"
        />
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <label
          htmlFor="guest-message"
          className="font-cinzel uppercase text-[0.75rem] tracking-wide"
        >
          Mensagem
        </label>
        <textarea
          id="guest-message"
          value={form.message}
          onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
          className="min-h-34 w-full rounded-sm border border-foreground/50 bg-[#E6DFD5] px-3 py-2 font-cormorant text-[1rem] outline-none"
        />
      </div>

      <div className="mt-4 flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting || !canSubmit}
          className="rounded-full bg-foreground px-7 py-2 pt-2.5 text-[0.7rem] font-semibold text-white disabled:opacity-60"
        >
          {isSubmitting ? "Enviando..." : "Enviar mensagem"}
        </button>
      </div>

      {feedbackError ? (
        <p className="mt-2 text-center text-xs text-red-700">{feedbackError}</p>
      ) : null}
      {feedbackSuccess ? (
        <p className="mt-2 text-center text-xs text-green-700">{feedbackSuccess}</p>
      ) : null}
    </form>
  );
}
