"use client";

export default function RSVPButton() {
  return (
    <button
      className="border border-foreground rounded-full bg-foreground text-white px-4 py-2 mt-4 font-bold text-sm"
      onClick={() => alert("RSVP functionality is not implemented yet.")}
    >
      Confirme sua presença
    </button>
  );
}
