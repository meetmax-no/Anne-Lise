import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Sparkles, Loader2 } from "lucide-react";

const TELEGRAM_BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.REACT_APP_TELEGRAM_CHAT_ID;

const HERO_IMAGE =
  "https://static.prod-images.emergentagent.com/jobs/d29af1d1-c3d2-4925-a32b-92d1b9a4f5d3/images/d848fc92bed7f80fd4c8ddfa6bc322329bd30e40829c30fb64f3df5ec08ebf01.png";

const CHOICES = [
  {
    code: "A",
    label: "Ja, gleder meg!",
    testid: "btn-accept",
    variant: "primary",
  },
  {
    code: "B",
    label: "Kanskje, fortell meg mer",
    testid: "btn-maybe",
    variant: "secondary",
  },
  {
    code: "C",
    label: "Nei takk",
    testid: "btn-decline",
    variant: "tertiary",
  },
];

const SUCCESS_COPY = {
  A: {
    title: "Så fint!",
    body: "Svaret er sendt. Jeg sier ifra om tid og sted snart.",
  },
  B: {
    title: "Greit, jeg forteller mer.",
    body: "Svaret er sendt. Jeg melder fra med flere detaljer.",
  },
  C: {
    title: "Takk for ærligheten.",
    body: "Svaret er sendt. Ha en fin kveld likevel.",
  },
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

    const labels = {
      A: "Ja, gleder meg!",
      B: "Kanskje, fortell meg mer",
      C: "Nei takk",
    };
    const emoji = { A: "🥂", B: "🤔", C: "🙅" }[code] || "✉️";
    const text =
      `${emoji} <b>Nytt svar på date-invitasjonen</b>\n\n` +
      `Valg: <b>${code}</b> — ${labels[code]}\n` +
      `Tidspunkt: ${new Date().toLocaleString("nb-NO")}`;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      setErrorMsg("Telegram er ikke konfigurert ennå.");
      setStatus("error");
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
    <div
      className="relative h-[100dvh] w-full overflow-hidden bg-[#0A0A0A] text-[#FAF9F6]"
      data-testid="invitation-root"
    >
      {/* Hero background */}
      <motion.img
        src={HERO_IMAGE}
        alt="Eksklusiv sushi-bar"
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
        draggable={false}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0.85) 35%, rgba(10,10,10,0.45) 65%, rgba(10,10,10,0.25) 100%)",
        }}
      />

      {/* Top corner mark */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="absolute top-6 left-6 sm:top-10 sm:left-12 z-10 flex items-center gap-2 text-[#D4AF37]"
      >
        <Sparkles size={14} strokeWidth={1.5} />
        <span className="font-sans text-xs tracking-[0.3em] uppercase opacity-90">
          En invitasjon
        </span>
      </motion.div>

      {/* Content block bottom-left */}
      <div className="relative z-10 flex h-full w-full flex-col justify-end p-6 sm:p-12 pb-12 sm:pb-16">
        <div className="max-w-xl">
          <AnimatePresence mode="wait">
            {status !== "success" ? (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.6 }}
              >
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.9, ease: "easeOut" }}
                  className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.05] tracking-tight text-[#FAF9F6] drop-shadow"
                  data-testid="invitation-heading"
                >
                  Her kommer det <em className="italic text-[#D4AF37] font-normal">en invitasjon</em>.
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65, duration: 0.8, ease: "easeOut" }}
                  className="mt-5 sm:mt-6 max-w-md font-sans text-base sm:text-lg font-light tracking-wide text-[#B8B1A8] leading-relaxed"
                  data-testid="invitation-subheading"
                >
                  Tenk deg stearinlys, lavmælt jazz og noe utsøkt sushi.
                  Detaljene kommer — men først, hva sier du?
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.85, duration: 0.8, ease: "easeOut" }}
                  className="mt-8 sm:mt-10 flex flex-col gap-3"
                >
                  {CHOICES.map((c, idx) => (
                    <ChoiceButton
                      key={c.code}
                      choice={c}
                      index={idx}
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
                    className="mt-4 text-sm text-rose-300/90"
                    data-testid="error-message"
                  >
                    {errorMsg}
                  </motion.p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="flex flex-col items-start gap-4 p-6 sm:p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-sm"
                data-testid="success-message"
              >
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <Sparkles size={14} strokeWidth={1.5} />
                  <span className="font-sans text-xs tracking-[0.3em] uppercase">
                    Svar mottatt
                  </span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight leading-tight text-[#FAF9F6]">
                  {SUCCESS_COPY[selected]?.title}
                </h2>
                <p className="font-sans text-base font-light text-[#B8B1A8] leading-relaxed">
                  {SUCCESS_COPY[selected]?.body}
                </p>
                <button
                  onClick={reset}
                  className="mt-2 font-sans text-xs tracking-[0.25em] uppercase text-[#B8B1A8] hover:text-[#FAF9F6] transition-colors"
                  data-testid="btn-reset"
                >
                  Endre svar
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ChoiceButton({ choice, index, onClick, loading, disabled }) {
  const base =
    "group relative w-full rounded-sm py-4 px-5 sm:px-6 flex items-center justify-between transition-all duration-300 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-[#D4AF37] text-[#0A0A0A] shadow-[0_0_24px_rgba(212,175,55,0.25)] hover:bg-[#E6C255] hover:-translate-y-0.5 disabled:opacity-70",
    secondary:
      "bg-transparent border border-[#FAF9F6]/20 text-[#FAF9F6] backdrop-blur-md hover:bg-[#FAF9F6]/10 hover:-translate-y-0.5 disabled:opacity-60",
    tertiary:
      "bg-white/[0.04] border border-white/5 text-[#B8B1A8] hover:text-[#FAF9F6] hover:bg-white/[0.08] disabled:opacity-60",
  };

  const labelClass =
    choice.variant === "primary"
      ? "font-sans text-sm sm:text-base font-semibold tracking-[0.12em] uppercase"
      : choice.variant === "secondary"
      ? "font-sans text-sm font-medium tracking-wide"
      : "font-sans text-sm font-medium tracking-wide";

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      data-testid={choice.testid}
      className={`${base} ${variants[choice.variant]}`}
    >
      <span className="flex items-center gap-3">
        <span
          className={`font-serif text-lg italic ${
            choice.variant === "primary" ? "text-[#0A0A0A]/70" : "text-[#D4AF37]"
          }`}
        >
          {choice.code}.
        </span>
        <span className={labelClass}>{choice.label}</span>
      </span>
      {loading ? (
        <Loader2 size={18} className="animate-spin opacity-80" />
      ) : (
        <ArrowUpRight
          size={18}
          className="opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
        />
      )}
    </motion.button>
  );
}
