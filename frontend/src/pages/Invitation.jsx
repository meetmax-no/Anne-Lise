import { useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { ArrowUpRight, Sparkles, Loader2, RotateCcw } from "lucide-react";

const TELEGRAM_BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.REACT_APP_TELEGRAM_CHAT_ID;

const HERO_IMAGE =
  "https://customer-assets.emergentagent.com/job_date-decision/artifacts/fbbrzk35_AlexSushi.jpg";

const CHOICES = [
  {
    code: "A",
    title: "Jeg er optimist!",
    body: "Du henter meg, og så drar vi rett på en skikkelig date sammen.",
    testid: "btn-accept",
    variant: "primary",
  },
  {
    code: "B",
    title: "Den pragmatiske",
    body: "Jeg skal inn til Oslo på onsdag for å hente Max. Vi møtes på Kadettangen for en rusletur. Stemmer kjemien, tar vi en ordentlig date dagen etter.",
    testid: "btn-maybe",
    variant: "secondary",
  },
  {
    code: "C",
    title: "Angreknappen",
    body: "Ikke helt sikker, jeg må tenke litt — sorry! (Helt innafor, null stress.)",
    testid: "btn-decline",
    variant: "tertiary",
  },
];

const SUCCESS_COPY = {
  A: { title: "Takk, Anne Lise.", body: "Herlig — gleder meg!" },
  B: { title: "Takk, Anne Lise.", body: "Supert. Vi sees på onsdag og krysser fingrene." },
  C: { title: "Takk, Anne Lise.", body: "Jeg setter pris på at du er ærlig." },
};

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
    const emoji = { A: "🥂", B: "🤝", C: "🤔" }[code] || "✉️";
    const now = new Date().toLocaleString("nb-NO", {
      timeZone: "Europe/Oslo",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const text =
      `${emoji} <b>Anne Lise har svart!</b>\n\n` +
      `<b>Valg ${code} — ${choice.title}</b>\n` +
      `<i>"${choice.body}"</i>\n\n` +
      `🗓 Torsdag 28. mai · kl 18.30\n` +
      `🕒 Svart ${now}`;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      // Test-modus: viser kvittering uten å sende
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
      {/* Content frame */}
      <div className="relative w-full max-w-[480px] flex flex-col">
        {/* HERO IMAGE — top of page, visible */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4 / 5" }}>
          <motion.img
            src={HERO_IMAGE}
            alt="Sushi-restaurant"
            className="absolute inset-0 h-full w-full object-cover object-center"
            initial={{ scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            draggable={false}
          />
          {/* Top mark */}
          <motion.div
            initial={{ y: -4 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="absolute left-0 right-0 flex items-center justify-center gap-2 text-[#D4AF37]"
            style={{ top: "calc(env(safe-area-inset-top, 0px) + 22px)" }}
          >
            <Sparkles size={12} strokeWidth={1.5} />
            <span className="font-sans text-[10px] tracking-[0.32em] uppercase opacity-95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              En invitasjon
            </span>
          </motion.div>
        </div>

        {/* Content block — below image */}
        <div
          className="px-6 pt-7"
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 32px)",
          }}
        >
          <AnimatePresence mode="wait">
            {status !== "success" ? (
              <motion.div
                key="idle"
                initial={{ y: 8 }}
                animate={{ y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                <motion.h1
                  initial={{ y: 14 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.15, duration: 0.7, ease: "easeOut" }}
                  className="text-center font-serif font-medium leading-[1.05] tracking-tight text-[#FAF9F6]"
                  style={{ fontSize: "clamp(1.75rem, 8vw, 2.25rem)" }}
                  data-testid="invitation-heading"
                >
                  Jeg har lyst til å invitere deg på{" "}
                  <em className="italic text-[#D4AF37] font-normal">
                    en date
                  </em>
                  .
                </motion.h1>

                <motion.div
                  initial={{ y: 10 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.22, duration: 0.6, ease: "easeOut" }}
                  className="mt-4 flex items-center justify-center gap-3"
                  data-testid="invitation-datetime"
                >
                  <span className="h-px w-6 bg-[#D4AF37]/60" />
                  <span className="font-sans text-[11px] tracking-[0.28em] uppercase text-[#D4AF37]">
                    Torsdag 28. mai · kl 18.30
                  </span>
                  <span className="h-px w-6 bg-[#D4AF37]/60" />
                </motion.div>

                <motion.p
                  initial={{ y: 10 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                  className="mt-3 text-center font-sans text-[14px] font-light tracking-wide text-[#B8B1A8] leading-relaxed"
                  data-testid="invitation-subheading"
                >
                  <span className="text-[#FAF9F6] font-normal">Anne Lise</span> — for å gjøre det lekende lett, har jeg satt opp en liten meny for veien videre. Du bestemmer:
                </motion.p>

                <motion.div
                  initial={{ y: 10 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
                  className="mt-5 flex flex-col gap-3"
                >
                  {CHOICES.map((c) => (
                    <ChoiceCard
                      key={c.code}
                      choice={c}
                      onClick={() => handleChoice(c.code)}
                      loading={status === "loading" && selected === c.code}
                      disabled={status === "loading"}
                    />
                  ))}
                </motion.div>

                {status === "error" && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 text-xs text-rose-300/90 text-center"
                    data-testid="error-message"
                  >
                    {errorMsg}
                  </motion.p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ y: 16 }}
                animate={{ y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="mt-4 flex flex-col items-start gap-3 p-6 bg-white/[0.04] border border-white/10 rounded-lg"
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
        </div>
      </div>
    </div>
    </MotionConfig>
  );
}

function ChoiceCard({ choice, onClick, loading, disabled }) {
  const isPrimary = choice.variant === "primary";
  const isSecondary = choice.variant === "secondary";

  const cardBg = isPrimary
    ? "bg-black/55 border border-[#D4AF37]/40"
    : isSecondary
    ? "bg-black/45 border border-white/12"
    : "bg-black/35 border border-white/8";

  const codeColor = isPrimary
    ? "text-[#D4AF37]"
    : isSecondary
    ? "text-[#D4AF37]/85"
    : "text-[#B8B1A8]";

  const titleColor = "text-[#FAF9F6]";

  const bodyColor = isPrimary
    ? "text-[#FAF9F6]/85"
    : isSecondary
    ? "text-[#B8B1A8]"
    : "text-[#B8B1A8]/85";

  const btnStyle = isPrimary
    ? "bg-[#D4AF37] text-[#0A0A0A] active:bg-[#E6C255] shadow-[0_6px_22px_-8px_rgba(212,175,55,0.55)]"
    : isSecondary
    ? "bg-white/[0.08] border border-white/15 text-[#FAF9F6] active:bg-white/[0.15]"
    : "bg-white/[0.04] border border-white/[0.08] text-[#B8B1A8] active:text-[#FAF9F6] active:bg-white/[0.08]";

  const btnLabel = isPrimary
    ? "Velg dette"
    : isSecondary
    ? "Velg dette"
    : "Velg dette";

  return (
    <div
      className={`relative w-full rounded-lg p-5 backdrop-blur-md ${cardBg}`}
    >
      <div className="flex items-baseline gap-3">
        <span
          className={`font-serif text-[26px] italic leading-none ${codeColor}`}
        >
          {choice.code}
        </span>
        <h3
          className={`font-sans text-[16px] font-semibold tracking-tight ${titleColor}`}
        >
          {choice.title}
        </h3>
      </div>
      <p
        className={`mt-3 font-sans text-[14px] font-light leading-relaxed ${bodyColor}`}
      >
        {choice.body}
      </p>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        disabled={disabled}
        data-testid={choice.testid}
        className={`mt-4 inline-flex items-center gap-2 rounded-full py-2 px-4 transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60 touch-manipulation select-none self-start ${btnStyle}`}
      >
        {loading ? (
          <>
            <Loader2 size={13} className="animate-spin" />
            <span className="font-sans text-[11px] font-semibold tracking-[0.16em] uppercase">
              Sender
            </span>
          </>
        ) : (
          <>
            <span className="font-sans text-[11px] font-semibold tracking-[0.16em] uppercase">
              {btnLabel}
            </span>
            <ArrowUpRight size={13} className="opacity-80" />
          </>
        )}
      </motion.button>
    </div>
  );
}
