"use client";

import Image from "next/image";
import { useState } from "react";

type DressCodeButtonProps = {
  className?: string;
};

export default function DressCodeButton({ className = "" }: DressCodeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`font-cinzel text-[12px] cursor-pointer underline ${className}`.trim()}
      >
        Dress code (trajes)
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Dress code"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative w-[80vw] h-[80vh]" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              aria-label="Fechar modal"
              className="absolute -top-12 -right-4 text-white text-xl cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              x
            </button>

            <Image
              src="/dressCode/flyer.svg"
              alt="Flyer do dress code"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
