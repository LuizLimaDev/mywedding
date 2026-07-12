import Image from "next/image";
import Link from "next/link";
import RSVPButton from "./components/RSVPButton";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-[#F8F7F3] font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center py-10  lg:px-16 bg-[#F8F7F3] dark:bg-black sm:items-start px-6">
        {/* HERO */}
        <div className="hero flex justify-center items-center w-full">
          <Image src="/hero.svg" alt="Hero Image" width={450} height={250} loading="eager" />
        </div>

        <div className="rsvp flex flex-col items-center justify-center gap-4 w-full mt-10">
          <h3 className="uppercase font-cinzel">Juntos com suas famílias</h3>

          <div>
            <h1 className="font-dancing text-[96px] text-center leading-none"> Tiffany </h1>
            <h1 className="font-dancing text-[96px] text-center leading-none"> & </h1>
            <h1 className="font-dancing text-[96px] text-center leading-none"> Luiz </h1>
          </div>

          <p className="font-cormorant text-center text-[20px] my-6">
            É um grande prazer convidar você para celebrar o nosso casamento nesta data
          </p>

          <h2 className="uppercase font-cinzel font-bold text-[20px]">
            17 de outubro de 2026 | Bauru-SP
          </h2>

          <RSVPButton />

          <span className="text-[12px]"> *Até 16 de Setembro</span>
        </div>

        {/* Wedding Details */}
        <div className="wedding-details flex justify-center items-center gap-4 w-full mt-28 relative">
          <Image
            src="/umbrella.png"
            alt="umbrella"
            width={450}
            height={250}
            className="w-1/2 h-auto absolute -top-44 -left-24"
          />

          <Image
            src="/chair.svg"
            alt="Chair Image"
            width={450}
            height={250}
            className="w-1/2 h-auto"
          />

          <div className="w-1/2 h-full flex flex-col items-center justify-start gap-4">
            <h1 className="font-dancing text-[1.70rem] text-center"> Dia do casamento </h1>

            <h2 className="uppercase font-cinzel font-bold text-[.8rem] text-center">
              17 de outubro de 2026, Bauru-SP
            </h2>

            <div>
              <p className="font-cinzel text-center text-[.8rem] uppercase leading-tight">
                Espaço Aveiro, Bauru - SP
              </p>
              <p className="font-cinzel text-center text-[.8rem] uppercase leading-tight">
                às <strong>16h30</strong>
              </p>
            </div>

            <Link
              href="https://www.google.com/maps/place/Espaço+Aveiro/data=!4m2!3m1!1s0x0:0x3806ba82f88fb170?sa=X&ved=1t:2428&ictx=111"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 h-10 border border-foreground rounded-full px-2 py-4"
            >
              <Image
                src="/location-icon.svg"
                alt="Location Icon"
                width={40}
                height={40}
                className="w-8 h-8"
              />
              <span>Localização</span>
            </Link>
          </div>
        </div>

        {/* Party Info */}
        <div className="party-info flex justify-center items-center gap-4 w-full mt-20">
          <div className="w-1/2 h-full flex flex-col items-center justify-start gap-4">
            <h1 className="font-dancing text-[1.70rem] text-center"> Celebração pós cerimônia </h1>

            <div>
              <h2 className="uppercase font-cinzel font-bold text-[.8rem] text-center">
                Salão espaço Aveiro
              </h2>
              <h2 className="uppercase font-cinzel font-bold text-[.8rem] text-center">
                Mesmo local
              </h2>
            </div>

            <div>
              <p className="font-cinzel text-center text-[.8rem] uppercase leading-tight">
                Espaço Aveiro, Bauru - SP
              </p>
              <p className="font-cinzel text-center text-[.8rem] uppercase leading-tight">
                às <strong>16h30</strong>
              </p>
            </div>
          </div>

          <Image
            src="/table.svg"
            alt="Table Icon"
            width={450}
            height={250}
            className="w-1/2 h-auto"
          />
        </div>

        {/* Gift List */}
        <div className="gift-list"></div>

        {/* Our Story */}
        <div className="our-story"></div>

        <div className="local"></div>

        <div className="left-your-msg"></div>

        <div className="footer-rsvp my-16"></div>
      </main>
    </div>
  );
}
