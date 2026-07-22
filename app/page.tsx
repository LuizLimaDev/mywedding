import Image from "next/image";
import Link from "next/link";
import { readdir } from "node:fs/promises";
import path from "node:path";
import CarouselGallery from "./components/CarouselGallery";
import GuestMessageForm from "./components/GuestMessageForm";
import RSVPButton from "./components/RSVPButton";

export default async function Home() {
  const carouselDir = path.join(process.cwd(), "public", "carouselImgs");
  const allowedExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);

  const carouselImages = (await readdir(carouselDir))
    .filter((fileName) => allowedExtensions.has(path.extname(fileName).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }))
    .map((fileName) => `/carouselImgs/${fileName}`);

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

          <span className="text-[12px]"> *Até 27 de Setembro</span>

          <button className="font-cinzel text-[12px] cursor-pointer underline">
            Dress code (trajes)
          </button>
        </div>

        {/* Party Info */}
        <div className="party-info flex justify-center items-center gap-4 w-full mt-20">
          <div className="w-1/2 h-full flex flex-col items-center justify-start gap-4">
            <h1 className="font-dancing text-[1.70rem] text-center"> Celebração pós cerimônia </h1>

            <div>
              <h2 className="uppercase font-cinzel text-[.8rem] text-center">
                Salão espaço Aveiro
              </h2>
              <h2 className="uppercase font-cinzel text-[.8rem] text-center">Mesmo local</h2>
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

        <Image
          src="/star.svg"
          alt="star Icon"
          width={64}
          height={102}
          className="flex justify-start w-auto h-12 ml-20 mr-auto mt-10"
        />

        {/* Gift List */}
        <div className="gift-list flex justify-center items-center gap-4 w-full mt-6">
          <Image
            src="/gifts.svg"
            alt="Gifts Icon"
            width={450}
            height={250}
            className="w-1/2 h-auto"
          />

          <div className="w-1/2 h-45.25 flex flex-col items-center justify-start gap-4">
            <h1 className="font-dancing text-[1.70rem] text-center"> Lista de presentes </h1>

            <span> Carrousel presentes</span>
          </div>
        </div>

        {/* Our Story */}
        <div className="our-story flex flex-col justify-center items-center gap-4 w-full mt-16">
          <div className="container-content flex">
            <div className="container-text">
              <h1 className="font-dancing text-[1.70rem] text-center"> Nossa história </h1>

              <p className="min-w-[35%] max-h-50 overflow-y-auto overflow-x-hidden text-[12px]">
                {" "}
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magni quaerat harum sint
                quam dolorum necessitatibus deserunt, perferendis dicta exercitationem dolorem hic
                quas dignissimos sequi eum velit sapiente mollitia vitae! Alias minima veniam esse
                aliquam quam ab, et provident numquam sunt nobis? Deleniti sunt, et labore aut
                corrupti provident nostrum distinctio ut ipsum! Magni iste obcaecati ipsa rem
                perferendis. Molestias provident ad saepe, sint in perferendis illo, laudantium
                quidem quis dolorum temporibus aperiam quaerat, atque error. Rerum provident tempore
                asperiores eveniet illum et quos autem, possimus distinctio accusantium? Quas minus
                architecto, dicta, placeat numquam officia optio, fugiat laudantium ducimus soluta
                laboriosam!
              </p>
            </div>

            <Image
              src="/affair.svg"
              alt="Affair Icon"
              width={0}
              height={0}
              className="w-[60%] h-52.5 self-end "
            />
          </div>

          <CarouselGallery images={carouselImages} />
        </div>

        {/* Wedding Details */}
        <div className="wedding-details flex justify-center items-center gap-4 w-full mt-28 relative">
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

        {/* Local */}
        <div className="local flex flex-col justify-center items-center gap-4 w-full mt-16">
          <h1 className="font-dancing text-[1.70rem] text-center"> Local </h1>

          <Image
            src="/aveiro.svg"
            alt="Espaço Aveiro"
            width={0}
            height={0}
            className="w-full h-auto"
          />
        </div>

        <div className="rsvp relative flex flex-col items-center justify-center w-full mt-10">
          <RSVPButton />

          <span className="text-[12px] mt-2"> *Até 27 de Setembro</span>

          <button className="font-cinzel text-[12px] cursor-pointer underline mt-4">
            Dress code (trajes)
          </button>
        </div>

        <div className="left-your-msg w-full mt-20">
          <h1 className="font-dancing text-[1.70rem] text-center"> Deixe sua mensagem </h1>

          <div className="relative mt-2 w-full">
            <Image
              src="/book2.svg"
              alt="Deixe sua mensagem"
              width={0}
              height={0}
              className="w-full h-auto"
            />

            <GuestMessageForm />
          </div>
        </div>

        <div className="footer-rsvp my-16"></div>
      </main>
    </div>
  );
}
