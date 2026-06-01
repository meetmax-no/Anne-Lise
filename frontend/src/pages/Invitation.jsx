import { motion, MotionConfig } from "framer-motion";
import { Sparkles, ExternalLink, Moon } from "lucide-react";

const HERO_IMAGE = "/hero.jpg";

const INTRO =
  "Da er vi klare for å sette kursen mot Göteborg. Helgen er satt av til å nyte god mat, kikke på folkelivet, gå hånd i hånd og rett og slett bli enda bedre kjent.";

const DAYS = [
  {
    label: "Fredag",
    date: "29. mai",
    items: [
      { time: "08:00", text: "Avreise fra Hammerskogbakken" },
      {
        time: "09:00",
        text: "Innsjekk av Max på Standal Hundehotell — deretter setter vi kursen sørover",
      },
      { time: "12:00", text: "Kaffepause og lading av bil" },
      { time: "13:00", text: "Forventet ankomst Göteborg" },
      {
        time: "19:15",
        text: "Middag på Bord 27",
        link: { label: "bord27.se", href: "https://www.bord27.se/" },
      },
      { time: "00–08", text: "Sove (med ullsokker på)", muted: true },
    ],
  },
  {
    label: "Lørdag",
    date: "30. mai",
    items: [
      { time: "08:00", text: "Frokost" },
      {
        time: "19:15",
        text: "Middag på Restaurang 2112",
        link: { label: "restaurang2112.com", href: "https://www.restaurang2112.com/" },
      },
      { time: "00–08", text: "Sove (med ullsokker på)", muted: true },
    ],
  },
  {
    label: "Søndag",
    date: "31. mai",
    items: [
      { time: "08:00", text: "Frokost" },
      { time: "11:30", text: "Utsjekk og avreise retur Oslo" },
      { time: "14:30", text: "Stopp på Nordby for eventuell grensehandel" },
      { time: "17:00", text: "Hente Max på Standal Hundehotell" },
      { time: "18:00", text: "Hjemme igjen" },
    ],
  },
];

export default function Invitation() {
  return (
    <MotionConfig reducedMotion="never">
      <div
        className="relative min-h-[100dvh] w-full bg-[#0A0A0A] text-[#FAF9F6] flex justify-center"
        data-testid="invitation-root"
      >
        <div className="relative w-full max-w-[480px] flex flex-col">
          {/* HERO */}
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: "4 / 5" }}
          >
            <motion.img
              src={HERO_IMAGE}
              alt="Göteborg"
              className="absolute inset-0 h-full w-full object-cover object-center"
              initial={{ scale: 1.06 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.6, ease: "easeOut" }}
              draggable={false}
            />
            <motion.div
              initial={{ y: -4 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="absolute left-0 right-0 flex items-center justify-center gap-2 text-[#D4AF37]"
              style={{ top: "calc(env(safe-area-inset-top, 0px) + 22px)" }}
            >
              <Sparkles size={12} strokeWidth={1.5} />
              <span className="font-sans text-[10px] tracking-[0.32em] uppercase opacity-95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                Helgetur · Göteborg
              </span>
            </motion.div>
          </div>

          {/* CONTENT */}
          <div className="px-6 pt-8 pb-6">
            {/* Greeting */}
            <motion.h1
              initial={{ y: 14 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.15, duration: 0.7, ease: "easeOut" }}
              className="text-center font-serif italic font-medium leading-[1.05] tracking-tight text-[#FAF9F6]"
              style={{ fontSize: "clamp(1.875rem, 8.5vw, 2.375rem)" }}
              data-testid="invitation-heading"
            >
              Kjære <span className="text-[#D4AF37]">Anne Lise</span>,
            </motion.h1>

            {/* Date range line */}
            <motion.div
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.22, duration: 0.6, ease: "easeOut" }}
              className="mt-5 flex items-center justify-center gap-3"
            >
              <span className="h-px w-6 bg-[#D4AF37]/60" />
              <span className="font-sans text-[11px] tracking-[0.28em] uppercase text-[#FAF9F6]">
                29. – 31. mai 2026
              </span>
              <span className="h-px w-6 bg-[#D4AF37]/60" />
            </motion.div>

            {/* Intro */}
            <motion.p
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
              className="mt-5 text-center font-sans text-[14px] font-light tracking-wide text-[#B8B1A8] leading-relaxed"
            >
              {INTRO}
            </motion.p>

            {/* Days */}
            <motion.div
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.4, duration: 0.65, ease: "easeOut" }}
              className="mt-9 flex flex-col gap-6"
            >
              {DAYS.map((day, idx) => (
                <DayBlock key={day.label} day={day} index={idx} />
              ))}
            </motion.div>

            {/* Closing flourish */}
            <motion.div
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.55, duration: 0.6, ease: "easeOut" }}
              className="mt-10 flex items-center justify-center gap-3 text-[#D4AF37]"
            >
              <span className="h-px w-8 bg-[#D4AF37]/60" />
              <Sparkles size={12} strokeWidth={1.5} />
              <span className="h-px w-8 bg-[#D4AF37]/60" />
            </motion.div>
          </div>

          {/* Footer */}
          <footer
            className="px-6 text-center font-sans text-[10px] tracking-[0.28em] uppercase text-[#FAF9F6]/80"
            style={{
              paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 18px)",
              paddingTop: "8px",
            }}
            data-testid="footer"
          >
            Ko | Do · Consult © 2026
          </footer>
        </div>
      </div>
    </MotionConfig>
  );
}

function DayBlock({ day }) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.03] backdrop-blur-md p-5">
      <header className="flex items-baseline justify-between mb-4">
        <h2 className="font-serif italic text-[22px] text-[#D4AF37] leading-none">
          {day.label}
        </h2>
        <span className="font-sans text-[10px] tracking-[0.28em] uppercase text-[#B8B1A8]">
          {day.date}
        </span>
      </header>
      <ul className="flex flex-col gap-3">
        {day.items.map((item, i) => (
          <li key={i} className="flex gap-4 items-start">
            <span
              className={`shrink-0 w-14 pt-0.5 font-sans text-[12px] tabular-nums tracking-wider ${
                item.muted ? "text-[#B8B1A8]/55" : "text-[#D4AF37]"
              }`}
            >
              {item.time}
            </span>
            <span
              className={`flex-1 font-sans text-[14px] font-light leading-relaxed ${
                item.muted ? "text-[#B8B1A8]/65 italic" : "text-[#FAF9F6]"
              }`}
            >
              {item.muted && (
                <Moon
                  size={12}
                  strokeWidth={1.6}
                  className="inline-block mr-1.5 -mt-0.5 opacity-70"
                />
              )}
              {item.text}
              {item.link && (
                <a
                  href={item.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 inline-flex items-center gap-1 text-[#D4AF37] underline-offset-4 hover:underline active:underline"
                >
                  <ExternalLink size={12} strokeWidth={1.8} />
                  <span className="font-sans text-[12px] tracking-wide">
                    {item.link.label}
                  </span>
                </a>
              )}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
