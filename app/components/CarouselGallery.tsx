"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";

type CarouselGalleryProps = {
  images: string[];
};

const SCROLL_STEP = 320;

export default function CarouselGallery({ images }: CarouselGalleryProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);

  const hasImages = useMemo(() => images.length > 0, [images.length]);

  const scrollByAmount = (distance: number) => {
    if (!scrollRef.current) {
      return;
    }

    scrollRef.current.scrollBy({ left: distance, behavior: "smooth" });
  };

  if (!hasImages) {
    return (
      <div className="w-full max-w-[90vw] rounded-xl border border-foreground/20 bg-white/60 px-4 py-6 text-center text-sm">
        Nenhuma foto encontrada em /public/carouselImgs.
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-[90vw]">
        <div className="relative">
          <button
            type="button"
            aria-label="Foto anterior"
            onClick={() => scrollByAmount(-SCROLL_STEP)}
            className="absolute left-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-foreground text-white shadow-md transition hover:bg-black cursor-pointer"
          >
            <Image
              src="/arrow.svg"
              alt="Seta para esquerda"
              width={16}
              height={16}
              className="rotate-180"
            />
          </button>

          <div
            ref={scrollRef}
            className="flex w-full snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth rounded-2xl px-12 py-2"
          >
            {images.map((src) => {
              const fileName = src.split("/").pop() ?? "Foto";

              return (
                <button
                  key={src}
                  type="button"
                  onClick={() => setModalImage(src)}
                  className="relative h-52 w-40 shrink-0 snap-start overflow-hidden rounded-xl border border-foreground/20 shadow-sm"
                  aria-label={`Abrir ${fileName}`}
                >
                  <Image
                    src={src}
                    alt={fileName}
                    fill
                    sizes="160px"
                    className="object-cover transition duration-300 hover:scale-105"
                  />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            aria-label="Proxima foto"
            onClick={() => scrollByAmount(SCROLL_STEP)}
            className="absolute right-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-foreground text-white shadow-md transition hover:bg-black cursor-pointer"
          >
            <Image src="/arrow.svg" alt="Seta para direita" width={16} height={16} />
          </button>
        </div>
      </div>

      {modalImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setModalImage(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full border border-white/70 px-3 py-1 text-sm text-white z-50 cursor-pointer"
            onClick={() => setModalImage(null)}
          >
            Fechar
          </button>

          <div
            className="max-h-[92vh] max-w-[96vw] overflow-auto rounded-lg bg-black/30 p-2 relative w-screen h-screen"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={modalImage}
              alt="Foto em tamanho original"
              fill
              className="h-auto w-auto max-w-none object-contain"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
