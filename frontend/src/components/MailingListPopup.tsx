import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { config } from '@/lib/config';
import { useLocation } from 'react-router-dom';
import { useContentManagement } from '../hooks/useContentManagement';

type Props = {
  delayMs?: number;            // show after N ms
  hideForDays?: number;        // frequency cap
  placement?: "br" | "bl" | "tr" | "tl";
  triggerOnScroll?: boolean;   // trigger when user scrolls 40% down
  scrollThreshold?: number;    // percentage of page to scroll before showing
};

export default function MailingListPopup({
  delayMs = 1800,
  hideForDays = 7,
  placement = "br",
  triggerOnScroll = true,
  scrollThreshold = 40,
}: Props) {
  const [open, setOpen] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [scrollTriggered, setScrollTriggered] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { getContentByKey } = useContentManagement();

  // Position styles based on placement
  const positionStyles = {
    br: { bottom: "1rem", right: "1rem" },
    bl: { bottom: "1rem", left: "1rem" },
    tr: { top: "1rem", right: "1rem" },
    tl: { top: "1rem", left: "1rem" },
  }[placement];

  useEffect(() => {
    // Only show popup on home page
    if (location.pathname !== '/') {
      return;
    }

    // Always show on refresh (no frequency cap)
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(!!mq.matches);

    if (triggerOnScroll) {
      const handleScroll = () => {
        if (scrollTriggered) return;

        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercent >= scrollThreshold) {
          setScrollTriggered(true);
          setTimeout(() => setOpen(true), delayMs);
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      const t = setTimeout(() => setOpen(true), delayMs);
      return () => clearTimeout(t);
    }
  }, [delayMs, triggerOnScroll, scrollThreshold, scrollTriggered, location.pathname]);

  const handleClose = () => {
    setOpen(false);
    // No frequency cap - popup will show on every refresh
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(`${config.supabase.url}/functions/v1/mailing-list/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.supabase.anonKey}`,
        },
        body: JSON.stringify({ email: email.toLowerCase() }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message || 'Something went wrong. Please try again.');
        setIsSuccess(false);
      } else {
        setMessage(result.message || 'Successfully subscribed! Check your email for a welcome message.');
        setIsSuccess(true);
        setEmail('');
        // Auto-close after success
        setTimeout(() => {
          handleClose();
        }, 3000);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setMessage('Something went wrong. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open]);

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
            aria-label="Mailing list signup"
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: 100, y: 24, scale: 0.98 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: 100, y: 16, scale: 0.98 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontFamily: 'Manrope, sans-serif', padding: '20px' , backgroundColor: '#fdfdfd' }}
            className="bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.12)] border border-gray-200 overflow-hidden"
          >
            {/* Header stripe */}
            <div className="bg-black h-1.5 w-full" />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
              style={{position: 'relative', left: '275px', bottom: '-10px', backgroundColor: '##42414100' }}
            >
              ×
            </button>

            {/* Content */}
            <div className="p-6" style={{margin: '10px'}}>
              <div className="text-xs text-gray-500 mb-2 font-medium">Stay Connected</div>
              <h3 className="text-lg font-semibold text-black mb-2 font-['Manrope']">
                {getContentByKey('mailing_list_popup_title') || 'Join the NEESH Community'}
              </h3>
              <p className="text-sm leading-snug text-gray-600 mb-4 font-['Manrope']" style={{fontSize: '20px', marginTop: '10px', marginBottom: '10px'}}>
                {getContentByKey('mailing_list_popup_subtitle') || 'Get the latest updates on new magazines, features, and indie print news delivered to your inbox.'}
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-['Manrope'] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  disabled={isSubmitting}
                  required
                  style={{padding: '10px'}}
                />
                
                <button
                  type="submit"
                  style={{padding: '10px'}}
                  disabled={isSubmitting || !email.trim()}
                  className="w-full bg-black text-white py-2 px-4 rounded-lg text-sm font-medium font-['Manrope'] hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>

              {message && (
                <div className={`mt-3 text-xs p-2 rounded ${
                  isSuccess 
                    ? 'text-green-700 bg-green-50 border border-green-200' 
                    : 'text-red-700 bg-red-50 border border-red-200'
                } font-['Manrope']`}>
                  {message}
                </div>
              )}

              <div className="mt-4 text-xs text-gray-500 font-['Manrope']" style={{position:'relative', top: '12px', left: '10px', fontSize: 'small'}}>
                We respect your privacy. Unsubscribe at any time.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
