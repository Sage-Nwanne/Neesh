import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  delayMs?: number;            // show after N ms
  hideForDays?: number;        // frequency cap
  placement?: "br" | "bl" | "tr" | "tl";
  triggerOnScroll?: boolean;   // trigger when user scrolls 40% down
  scrollThreshold?: number;    // percentage of page to scroll before showing
};

const TICKETS_URL = "https://casesensitive.show/";
const UTM = "?utm_source=neesh&utm_medium=banner&utm_campaign=casesensitive_2025";
const LEARN_URL = "https://casesensitive.show/";

export default function CaseSensitiveCard({
  delayMs = 1800,
  hideForDays = 7,
  placement = "br",
  triggerOnScroll = true,
  scrollThreshold = 40,
}: Props) {
  const [open, setOpen] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [scrollTriggered, setScrollTriggered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Debug logging
  useEffect(() => {
    console.log('Card state changed:', { open, reduced, scrollTriggered });
  }, [open, reduced, scrollTriggered]);

  useEffect(() => {
    console.log('Component mounted, setting up trigger...');

    const lc = window.localStorage.getItem("cs_card_hidden_until");
    console.log('LocalStorage check:', { lc, now: Date.now(), blocked: lc && Date.now() < Number(lc) });

    // Temporarily disable frequency cap for testing
    // if (lc && Date.now() < Number(lc)) return; // frequency cap

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(!!mq.matches);

    // Simplified: just show the card after delay for testing
    console.log('Setting timeout to show card in', delayMs, 'ms');
    const t = setTimeout(() => {
      console.log('Timeout fired, showing card');
      setOpen(true);
    }, delayMs);

    return () => {
      console.log('Cleaning up timeout');
      clearTimeout(t);
    };
  }, [delayMs]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    console.log('Setting up escape key listener');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        console.log('Escape key pressed, dismissing card');
        dismiss();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      console.log('Removing escape key listener');
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function dismiss() {
    const ms = hideForDays * 24 * 60 * 60 * 1000;
    window.localStorage.setItem("cs_card_hidden_until", String(Date.now() + ms));
    setOpen(false);
  }

  const posClasses = {
    br: "bottom-4 right-4",
    bl: "bottom-4 left-4",
    tr: "top-4 right-4",
    tl: "top-4 left-4",
  }[placement];

  const positionStyles = {
    br: { bottom: '1rem', right: '1rem' },
    bl: { bottom: '1rem', left: '1rem' },
    tr: { top: '1rem', right: '1rem' },
    tl: { top: '1rem', left: '1rem' },
  }[placement];

  // Updated color palette for dark background
  const bg = "bg-[#f8f6f3]";       // surface (from your valueProps background)
  const ink = "text-white";        // white text for dark background
  const muted = "text-[#f0f0f0]";  // light grey for better visibility on dark background
  const track = "bg-[#34354F]";    // deep accent (progress/stripe)
  const accent = "bg-[#E86945]";   // primary brand accent (Case Sensitive orange)
  const accentText = "text-white";
  const border = "border-[#e8e6e3]"; // border color from your gradient

  return (
    <div
      className="fixed z-[60] max-w-[360px] w-[calc(100vw-2rem)]"
      style={positionStyles}
    >
      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            ref={cardRef}
            role="dialog"
            aria-label="Case Sensitive announcement"
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: 100, y: 24, scale: 0.98 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: 100, y: 16, scale: 0.98 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className={`${bg} rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.12)] ${border} border overflow-hidden`}
          >
            {/* Header stripe */}
            <div className={`${track} h-1.5 w-full`} />

            {/* Content */}
            <div className="p-4 relative" style={{ backgroundColor: '#8f2f1df5', padding: '1rem' }}>
              {/* Dismiss button - moved to top right */}
              <button
              style={{ position: 'absolute', top: '0px', right: '-11px' }}
                aria-label="Dismiss"
                onClick={dismiss}
                className="absolute top-3 right-3 rounded-full p-1 hover:bg-white/10 text-white bg-transparent text-lg leading-none"
              >
                ✕
              </button>

              <div className={`text-sm ${muted} mb-1`} style={{fontSize:'12px', }}>Presented by Neesh</div>
              <img
                style={{ width: '325px', height: 'auto' }}
                src="/CaseSensitive-Primary-W_cropped-removebg-preview.png"
                alt="Case Sensitive"
                className="h-12 w-auto mb-2"
              />
              <h3 className={`text-lg font-medium ${ink}`} style={{ color: '#201510', position: 'relative', top: '2px', left: '80px', fontSize:'25px' }}>NYC • Sept 13</h3>
              <p className={`mt-2 text-sm leading-snug text-white`} style={{ color: 'white', padding: 15 }}>
                A new conference shaping the future of print magazines. Panels, workshops, demos, and more.  
              </p>
              <div className="mt-4 flex items-center" style={{ justifyContent: 'space-around' }}>
                <a
                  href={`${TICKETS_URL}${UTM}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: '#000',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none',
                    display: 'inline-block',
                    borderRadius: '10px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  Buy Tickets
                </a>
                <a
                  href={`${LEARN_URL}${UTM}` }
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: '#000',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none',
                    display: 'inline-block',
                    borderRadius: '10px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  Learn More
                </a>
              </div>

              {/* Footnote */}
              <div className={`mt-3 text-xs ${muted}`} style={{ padding: '10px' }}>
                At WSA, 161 Water St, NYC. Powered by The Logical Choice.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
