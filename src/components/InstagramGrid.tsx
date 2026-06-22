import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { SocialLinks } from "@/components/SocialLinks";
import { InstagramFeed } from "@/components/InstagramFeed";
import { site } from "@/config/site";
import { photos } from "@/config/images";

// Fallback showcase shown until a real feed is configured (content/instagram.ts):
// a widget iframe (auto-updating) or official embed.js post permalinks.
const tiles = [
  photos.doctorPortraitSuit,
  photos.team,
  photos.emface,
  photos.emfaceFace,
  photos.exomindBrain,
  photos.teamWide,
];

export function InstagramGrid() {
  const ig = site.social.instagram;
  return (
    <section className="border-t border-nude-200 bg-cream-100 py-14 sm:py-20">
      <Container>
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-nude-400">Instagram</p>
            <a
              href={ig}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 font-serif text-3xl text-indigo-900 transition-colors hover:text-nude-400"
            >
              @doctororsini
            </a>
            <p className="mt-3 max-w-md text-sm text-nude-500">
              Síguenos para ver resultados, novedades y el día a día de la clínica.
            </p>
          </div>
        </Reveal>

        <div className="mt-10">
          <InstagramFeed
            fallback={
              <div className="grid grid-cols-3 gap-2 md:grid-cols-6 md:gap-3">
                {tiles.map((src, i) => (
                  <a
                    key={i}
                    href={ig}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Ver el Instagram de Perfect by Dr. Orsini"
                    className="group relative aspect-square overflow-hidden rounded-xl"
                  >
                    <Image
                      src={src}
                      alt="Publicación de Instagram de Perfect by Dr. Orsini"
                      fill
                      sizes="(max-width: 768px) 30vw, 180px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-indigo-950/0 transition-colors group-hover:bg-indigo-950/40">
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">
                        <rect x="3" y="3" width="18" height="18" rx="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="17.2" cy="6.8" r="1.1" fill="white" stroke="none" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            }
          />
        </div>

        <div className="mt-9 flex flex-col items-center gap-5">
          <Button href={ig} variant="dark">
            Seguir en Instagram
          </Button>
          <SocialLinks variant="light" />
        </div>
      </Container>
    </section>
  );
}
