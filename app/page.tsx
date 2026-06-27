import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-[#F8F7F3] font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center py-10 px-16 bg-[#F8F7F3] dark:bg-black sm:items-start">
        <div className="hero flex justify-center items-center w-full">
          <Image src="/hero.svg" alt="Hero Image" width={450} height={250} />
        </div>

        <div className="rsvp flex flex-col items-center justify-center gap-4 w-full mt-16">
          <h3 className="uppercase font-cinzel">Juntos com suas famílias</h3>
          <h1 className="font-dancing text-[96px]"> Tiffany & Luiz </h1>
          <p className="font-cormorant text-center text-[20px]">
            É um grande prazer convidar você para celebrar o nosso casamento
            nesta data
          </p>
          <h2 className="uppercase font-cinzel font-bold textv-[26px]">
            {" "}
            22 de outubro de 2026 | Bauru-SP
          </h2>
        </div>

        <div className="wedding-details"></div>

        <div className="party-info"></div>

        <div className="gift-list"></div>

        <div className="our-story"></div>

        <div className="local"></div>

        <div className="left-your-msg"></div>

        <div className="footer-rsvp"></div>
      </main>
    </div>
  );
}
