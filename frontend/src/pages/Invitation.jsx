import { useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { Sparkles, ExternalLink, Moon, ArrowUpRight, Loader2, RotateCcw } from "lucide-react";

const TELEGRAM_BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.REACT_APP_TELEGRAM_CHAT_ID;

const HERO_IMAGE = "/hero.jpg";

const INTRO =
  "Da er vi klare for å sette kursen mot Göteborg. Helgen er satt av til å nyte god mat, kikke på folkelivet, gå hånd i hånd og rett og slett bli enda bedre kjent.";

const CHOICES = [
  {
    code: "A",
    title: "JA. Jeg pakker ullsokkene og gleder meg",
    testid: "btn-accept",
    variant: "primary",
    emoji: "🥂",
  },
];

const SUCCESS_COPY = {
  A: {
    title: "Herlig!",
    body: "Takk, Anne Lise ❤️ — jeg gleder meg allerede veldig mye til dette. 💋",
  },
};

const DAYS = [
  {
    label: "Tirsdag",
    date: "9. juni",
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
    label: "Onsdag",
    date: "10. juni",
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
    label: "Torsdag",
    date: "11. juni",
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
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [selected, setSelected] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChoice = async (code) => {
    if (status === "loading") return;
    setSelected(code);
    setStatus("loading");
    setErrorMsg("");

    const choice = CHOICES.find((c) => c.code === code);
    const now = new Date().toLocaleString("nb-NO", {
      timeZone: "Europe/Oslo",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const text =
      `${choice.emoji} <b>Anne Lise har svart!</b>\n\n` +
      `<b>Valg ${code} — ${choice.title}</b>\n\n` +
      `🗓 Göteborg · 9. – 11. juni 2026\n` +
      `🕒 Svart ${now}`;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.info("[Test-modus] Telegram ikke konfigurert. Ville sendt:", text);
      setTimeout(() => setStatus("success"), 600);
      return;
    }

    try {
      const res = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text,
            parse_mode: "HTML",
          }),
        }
      );
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.description || "Telegram API feilet");
      }
      setStatus("success");
    } catch (err) {
      console.error(err);
      setErrorMsg("Kunne ikke sende svaret. Prøv igjen om litt.");
      setStatus("error");
    }
  };

  const reset = () => {
    setSelected(null);
    setStatus("idle");
    setErrorMsg("");
  };

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
            style={{ aspectRatio: "5 / 4" }}
          >
            <motion.img
              src={HERO_IMAGE}
              alt="Göteborg"
              className="absolute inset-0 h-full w-full object-cover object-top"
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
                9. – 11. juni 2026
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

            {/* Response section */}
            <motion.div
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.5, duration: 0.65, ease: "easeOut" }}
              className="mt-10"
            >
              <AnimatePresence mode="wait">
                {status !== "success" ? (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <p className="text-center font-sans text-[12px] tracking-[0.28em] uppercase text-[#D4AF37]">
                      Si fra
                    </p>
                    <div className="mt-4 flex flex-col gap-3">
                      {CHOICES.map((c) => (
                        <ResponseButton
                          key={c.code}
                          choice={c}
                          onClick={() => handleChoice(c.code)}
                          loading={status === "loading" && selected === c.code}
                          disabled={status === "loading"}
                        />
                      ))}
                    </div>
                    {status === "error" && (
                      <p
                        className="mt-3 text-xs text-rose-300/90 text-center"
                        data-testid="error-message"
                      >
                        {errorMsg}
                      </p>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ y: 16 }}
                    animate={{ y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    className="flex flex-col items-start gap-3 p-6 bg-white/[0.04] border border-white/10 rounded-lg"
                    data-testid="success-message"
                  >
                    <div className="flex items-center gap-2 text-[#D4AF37]">
                      <Sparkles size={12} strokeWidth={1.5} />
                      <span className="font-sans text-[10px] tracking-[0.32em] uppercase">
                        Svar mottatt
                      </span>
                    </div>
                    <h2
                      className="font-serif font-medium tracking-tight leading-tight text-[#FAF9F6]"
                      style={{ fontSize: "clamp(1.625rem, 7vw, 2rem)" }}
                    >
                      {SUCCESS_COPY[selected]?.title}
                    </h2>
                    <p className="font-sans text-[14px] font-light text-[#B8B1A8] leading-relaxed">
                      {SUCCESS_COPY[selected]?.body}
                    </p>
                    <button
                      onClick={reset}
                      className="mt-2 inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.28em] uppercase text-[#B8B1A8] active:text-[#FAF9F6] transition-colors"
                      data-testid="btn-reset"
                    >
                      <RotateCcw size={12} strokeWidth={1.7} />
                      Endre svar
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
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


function ResponseButton({ choice, onClick, loading, disabled }) {
  const isPrimary = choice.variant === "primary";

  const style = isPrimary
    ? "bg-[#D4AF37] text-[#0A0A0A] shadow-[0_10px_28px_-10px_rgba(212,175,55,0.55)] active:bg-[#E6C255] disabled:opacity-70"
    : "bg-white/[0.06] border border-white/15 text-[#FAF9F6] backdrop-blur-md active:bg-white/[0.12] disabled:opacity-60";

  const codeColor = isPrimary ? "text-[#0A0A0A]/55" : "text-[#D4AF37]";

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      data-testid={choice.testid}
      className={`group relative w-full rounded-lg px-5 py-4 flex items-center gap-3 text-left transition-colors duration-300 disabled:cursor-not-allowed touch-manipulation select-none ${style}`}
      style={{ minHeight: 60 }}
    >
      <span className={`font-serif text-[22px] italic leading-none ${codeColor}`}>
        {choice.code}
      </span>
      <span className="flex-1 font-sans text-[14px] font-semibold tracking-tight">
        {choice.title}
      </span>
      <span className="shrink-0">
        {loading ? (
          <Loader2 size={16} className="animate-spin opacity-80" />
        ) : (
          <ArrowUpRight size={16} className="opacity-80" />
        )}
      </span>
    </motion.button>
  );
}
