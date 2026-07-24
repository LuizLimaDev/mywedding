"use client";

import Image from "next/image";
import { useRef } from "react";

type ProductCard = {
  id: string;
  name: string;
  price: number;
  image: string;
  link?: string;
};

const PRODUCTS: ProductCard[] = [
  {
    id: "gift-1",
    name: "Batedeira planetaria",
    price: 400,
    image: "/gifts/01.webp",
    link: "https://mpago.li/23V5fWy",
  },
  {
    id: "gift-2",
    name: "Jogo de panelas cerâmica",
    price: 1078,
    image: "/gifts/02.jpg",
    link: "https://mpago.li/1GTzfTP",
  },
  {
    id: "gift-3",
    name: "Conjunto de jantar",
    price: 186,
    image: "/gifts/03.webp",
    link: "https://mpago.li/23csVsj",
  },
  {
    id: "gift-4",
    name: "Balcão de cozinha",
    price: 738,
    image: "/gifts/04.webp",
    link: "https://mpago.li/1VELaKv",
  },
  {
    id: "gift-5",
    name: "Armário multiuso",
    price: 245,
    image: "/gifts/05.jpg",
    link: "https://mpago.la/24STCx8",
  },
  {
    id: "gift-6",
    name: "Jogo de cama",
    price: 408,
    image: "/gifts/06.webp",
    link: "https://mpago.li/1bQpVLv",
  },
  {
    id: "gift-7",
    name: "Sofá de 3 lugares",
    price: 1098,
    image: "/gifts/07.jpg",
    link: "https://mpago.li/2Ug5TNb",
  },
  {
    id: "gift-8",
    name: "Jantar romântico",
    price: 170,
    image: "/gifts/08.jpg",
    link: "https://mpago.li/2BMKd71",
  },
  {
    id: "gift-9",
    name: "Lua de mel",
    price: 1980,
    image: "/gifts/09.jpg",
    link: "https://mpago.li/1cFaRoF",
  },
  {
    id: "gift-10",
    name: "Guarda roupa de casal",
    price: 1032,
    image: "/gifts/10.webp",
    link: "https://mpago.li/1fefX49",
  },
  {
    id: "gift-11",
    name: "Pix de outro valor ❤️",
    price: 0,
    image: "/gifts/11.webp",
    link: "https://link.mercadopago.com.br/pixtiffanyeluiz",
  },
];

const SCROLL_STEP = 320;

function formatPrice(value: number): string {
  return `$${value}`;
}

export default function ProductCardCarousel() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollByAmount = (distance: number) => {
    if (!scrollRef.current) {
      return;
    }

    scrollRef.current.scrollBy({ left: distance, behavior: "smooth" });
  };

  return (
    <div className="w-full max-w-[90vw] lg:max-w-full">
      <div className="relative isolate block">
        <button
          type="button"
          aria-label="Card anterior"
          onClick={() => scrollByAmount(-SCROLL_STEP)}
          className="absolute left-0 top-1/2 z-50 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-foreground text-white shadow-md transition hover:bg-black cursor-pointer"
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
          className="flex w-full snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth rounded-2xl px-4 py-2 sm:gap-4 sm:px-12"
        >
          {PRODUCTS.map((product) => (
            <article
              key={product.id}
              className="relative h-121.25 w-[calc(100%-.5rem)] shrink-0 snap-start overflow-hidden rounded-3xl sm:w-85"
            >
              <Image src="/productCard/card_background.svg" alt="" fill className="object-cover" />

              <div className="relative z-10 flex w-full h-full flex-col items-center px-5 py-7">
                <div className="relative h-63.75 w-full overflow-hidden rounded-3xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="mt-6 text-center font-cinzel text-[1.25rem] uppercase tracking-[0.04em] text-[#5d4226] leading-tight font-bold">
                  {product.name}
                </h3>

                <p className="mt-5 font-cinzel text-[1.25rem] leading-none text-[#5d4226]">
                  {formatPrice(product.price)}
                </p>

                <div className="mt-4 flex w-full items-center justify-between">
                  <Image
                    src="/productCard/card_decoration-left.png"
                    alt=""
                    width={66}
                    height={93}
                    className="h-24 w-auto"
                  />

                  <button
                    type="button"
                    className="relative h-12 w-51.25 cursor-pointer transition hover:brightness-95"
                    onClick={() => product.link && window.open(product.link, "_blank")}
                  >
                    <Image
                      src="/productCard/card_button.svg"
                      alt="presentear"
                      fill
                      className="object-contain"
                    />
                  </button>

                  <Image
                    src="/productCard/card_decoration-left.png"
                    alt=""
                    width={66}
                    height={93}
                    className="h-24 w-auto scale-x-[-1]"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>

        <button
          type="button"
          aria-label="Proximo card"
          onClick={() => scrollByAmount(SCROLL_STEP)}
          className="absolute right-0 top-1/2 z-50 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-foreground text-white shadow-md transition hover:bg-black cursor-pointer"
        >
          <Image src="/arrow.svg" alt="Seta para direita" width={16} height={16} />
        </button>
      </div>
    </div>
  );
}
