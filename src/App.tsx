import {
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import {
  ArrowRight,
  Calendar,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  CalendarClock,
  Bell,
  Database,
  Workflow,
  Sparkles,
  ChevronDown,
  Star,
  Quote,
  Plus,
  Minus,
  Wrench,
  Rocket,
  ShieldCheck,
  X,
  Gift,
} from 'lucide-react';

// Path to the downloadable PDF guide (place the file in /public)
const GUIDE_PDF_PATH = '/practiceflow-przewodnik.pdf';

// ---------------------------------------------------------------------------
// Typewriter hook — reveals text character by character
// ---------------------------------------------------------------------------
function useTypewriter(text: string, speed = 45, startDelay = 400) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;

    const start = setTimeout(() => {
      const tick = () => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i += 1;
          timer = setTimeout(tick, speed);
        } else {
          setDone(true);
        }
      };
      tick();
    }, startDelay);

    return () => {
      clearTimeout(start);
      clearTimeout(timer);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

// ---------------------------------------------------------------------------
// Scroll-reveal hook — fades children in when they enter the viewport
// ---------------------------------------------------------------------------
function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Animated counter — counts up from 0 to target when scrolled into view
// ---------------------------------------------------------------------------
function useCountUp(target: number, duration = 1600, startDelay = 200) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          setTimeout(() => {
            const startTime = performance.now();
            const tick = (now: number) => {
              const progress = Math.min((now - startTime) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setValue(Math.round(target * eased));
              if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }, startDelay);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, startDelay]);

  return { ref, value };
}

function StatCounter({
  value,
  suffix = '',
  prefix = '',
  className = '',
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const { ref, value: display } = useCountUp(value);
  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString('pl-PL')}
      {suffix}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Magnetic button — subtly attracts toward the cursor
// ---------------------------------------------------------------------------
function MagneticButton({
  children,
  href,
  className = '',
}: {
  children: ReactNode;
  href: string;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = 'translate(0, 0)';
  };

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`inline-flex items-center gap-2 transition-transform duration-200 ease-out ${className}`}
    >
      {children}
    </a>
  );
}

// ---------------------------------------------------------------------------
// Lead Magnet Modal — centered overlay shown on first page load
// ---------------------------------------------------------------------------
function LeadMagnetModal() {
  const [open, setOpen] = useState(true);

  const close = () => setOpen(false);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center px-6 transition-all duration-300 ${
        open ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={close}
      />
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-2xl border border-teal-400/20 bg-[#111111] p-8 shadow-2xl shadow-black/60 transition-all duration-300 ${
          open ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        <button
          onClick={close}
          aria-label="Zamknij"
          className="absolute right-4 top-4 text-gray-500 transition hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/15">
            <Gift className="h-7 w-7 text-amber-400" strokeWidth={1.5} />
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-teal-400">
            Darmowy przewodnik
          </p>
          <h3 className="mt-3 text-xl font-bold text-white">
            5 sygnałów, że Twój gabinet traci na ręcznej obsłudze
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-gray-400">
            Krótki przewodnik, który pokaże Ci, gdzie uciekają zyski — i jak je
            odzyskać automatyzacją. Pobierz za darmo — bez podawania e-maila.
          </p>
          <a
            href={GUIDE_PDF_PATH}
            download
            onClick={close}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3.5 text-base font-semibold text-black transition hover:bg-amber-300"
          >
            Pobierz darmowy przewodnik
            <ArrowRight className="h-4 w-4" />
          </a>
          <button
            onClick={close}
            className="mt-3 text-xs text-gray-500 transition hover:text-gray-300"
          >
            Nie, dziękuję — przejdź do strony
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exit-intent popup — shows when cursor leaves the top of the page
// ---------------------------------------------------------------------------
function ExitIntentPopup() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setOpen(true);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [dismissed]);

  const close = () => {
    setOpen(false);
    setDismissed(true);
  };

  return (
    <div
      className={`fixed inset-0 z-[90] flex items-center justify-center px-6 transition-all duration-300 ${
        open && !dismissed
          ? 'opacity-100'
          : 'pointer-events-none opacity-0'
      }`}
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={close}
      />
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-2xl border border-teal-400/20 bg-[#111111] p-8 shadow-2xl shadow-black/60 transition-all duration-300 ${
          open ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        <button
          onClick={close}
          aria-label="Zamknij"
          className="absolute right-4 top-4 text-gray-500 transition hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-400/15">
            <CalendarClock className="h-7 w-7 text-teal-400" strokeWidth={1.5} />
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-teal-400">
            Zanim odejdziesz
          </p>
          <h3 className="mt-3 text-xl font-bold text-white">
            Pobierz darmowy przewodnik
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-gray-400">
            Zanim odejdziesz — zabierz krótki przewodnik: 5 sygnałów, że Twój
            gabinet traci na ręcznej obsłudze. PDF, bez podawania e-maila.
          </p>
          <a
            href={GUIDE_PDF_PATH}
            download
            onClick={close}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3.5 text-base font-semibold text-black transition hover:bg-amber-300"
          >
            Pobierz darmowy przewodnik
            <ArrowRight className="h-4 w-4" />
          </a>
          <button
            onClick={close}
            className="mt-3 text-xs text-gray-500 transition hover:text-gray-300"
          >
            Nie, dziękuję
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sticky mobile CTA bar
// ---------------------------------------------------------------------------
function StickyMobileCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0a0a0a]/95 px-4 py-3 backdrop-blur-md transition-transform duration-300 md:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <a
        href="#diagnoza"
        className="flex items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-black"
      >
        Umów rozmowę
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sticky Navigation (appears after scrolling past hero)
// ---------------------------------------------------------------------------
function Nav() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="text-base font-semibold tracking-tight text-white">
          PracticeFlow
        </span>
        <a
          href="#diagnoza"
          className="rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-black transition hover:bg-amber-300"
        >
          Umów rozmowę
        </a>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Typewriter headline — reveals the hero headline char by char with a caret
// ---------------------------------------------------------------------------
function TypewriterHeadline({ text }: { text: string }) {
  const { displayed, done } = useTypewriter(text, 42, 500);
  return (
    <>
      {displayed}
      <span
        className={`inline-block w-[3px] -mb-1 ml-1 self-stretch bg-teal-400 transition-opacity ${
          done ? 'animate-pulse' : 'opacity-100'
        }`}
        style={{ height: '0.9em', opacity: done ? 0.6 : 1 }}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Case Study — concrete before/after with numbers
// ---------------------------------------------------------------------------
function CaseStudy() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">
            Case study
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Gabinet Stomatologiczny „Uśmiech"
          </h2>
          <p className="mt-4 text-gray-400">
            3 fotele, 6 higienistek, 4 dentystów. Wdrożenie: 14 dni.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Before */}
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8">
            <p className="text-sm font-semibold text-red-400">Przed wdrożeniem</p>
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-3xl font-bold text-white">12%</p>
                <p className="text-sm text-gray-400">wskaźnik no-shows</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">18h/tyg.</p>
                <p className="text-sm text-gray-400">czas recepcji na telefon i przypomnienia</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">~14 000 zł</p>
                <p className="text-sm text-gray-400">stracone zyski / miesiąc (puste sloty)</p>
              </div>
            </div>
          </div>

          {/* After */}
          <div className="rounded-2xl border border-teal-400/20 bg-teal-400/5 p-8">
            <p className="text-sm font-semibold text-teal-400">Po wdrożeniu</p>
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-3xl font-bold text-white">
                  <StatCounter value={3} suffix="%" />
                </p>
                <p className="text-sm text-gray-400">wskaźnik no-shows</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">
                  <StatCounter value={4} suffix="h/tyg." />
                </p>
                <p className="text-sm text-gray-400">czas recepcji na telefon i przypomnienia</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">
                  <StatCounter value={21000} suffix=" zł" />
                </p>
                <p className="text-sm text-gray-400">odzyskane zyski / miesiąc</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
          <p className="text-lg font-semibold text-white">
            ROI wdrożenia: <span className="text-teal-400">3,2x</span> w pierwszym miesiącu
          </p>
          <p className="mt-2 text-sm text-gray-400">
            „Przestaliśmy gonić pacjentów telefonem. Teraz to oni rezerwują sami, a my skupiamy się na leczeniu."
          </p>
          <p className="mt-3 text-xs text-gray-500">— Anna K., właścicielka gabinetu „Uśmiech"</p>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Comparison Table — PracticeFlow vs. ręczna obsługa vs. typowy system
// ---------------------------------------------------------------------------
function ComparisonTable() {
  const features = [
    { label: 'Rezerwacja online 24/7', pf: true, manual: false, other: true },
    { label: 'Automatyczne przypomnienia SMS', pf: true, manual: false, other: 'Częściowo' },
    { label: 'Samoobsługowa zmiana terminu', pf: true, manual: false, other: false },
    { label: 'Inteligentne wypełnianie pustych slotów', pf: true, manual: false, other: false },
    { label: 'Lista oczekujących z auto-powiadomieniem', pf: true, manual: false, other: 'Ręcznie' },
    { label: 'Mniej niż 15 min obsługi / tyg.', pf: true, manual: false, other: false },
    { label: 'Wdrożenie w 14 dni', pf: true, manual: false, other: false },
  ];

  const renderCell = (val: boolean | string) => {
    if (val === true)
      return <CheckCircle className="mx-auto h-5 w-5 text-teal-400" />;
    if (val === false) return <XCircle className="mx-auto h-5 w-5 text-gray-600" />;
    return <span className="text-xs text-gray-400">{val}</span>;
  };

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">
            Porównanie
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Dlaczego PracticeFlow?
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-4 text-left text-sm font-medium text-gray-400" />
                <th className="py-4 px-4 text-center text-sm font-bold text-teal-400">
                  PracticeFlow
                </th>
                <th className="py-4 px-4 text-center text-sm font-medium text-gray-400">
                  Ręczna obsługa
                </th>
                <th className="py-4 px-4 text-center text-sm font-medium text-gray-400">
                  Typowy system
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <tr
                  key={f.label}
                  className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}
                >
                  <td className="py-4 text-left text-sm text-white">{f.label}</td>
                  <td className="py-4 px-4 text-center">{renderCell(f.pf)}</td>
                  <td className="py-4 px-4 text-center">{renderCell(f.manual)}</td>
                  <td className="py-4 px-4 text-center">{renderCell(f.other)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Hero — asymmetric, with dashboard mockup on the right
// ---------------------------------------------------------------------------
function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="relative overflow-hidden px-6 py-32">
      {/* Subtle radial glow */}
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #2dd4bf 0%, transparent 70%)' }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
            <TypewriterHeadline text="Twoja klinika traci zyski przy każdym wolnym slocie." />
          </h1>
          <p className="mt-6 text-lg text-gray-400">
            Stały napływ pacjentów przy minimalnym zaangażowaniu zespołu.
            Automatyzujemy stomatologię, odzyskując Twój czas i pieniądze.
          </p>
          <MagneticButton
            href="#diagnoza"
            className="mt-10 rounded-full bg-amber-400 px-7 py-3.5 text-base font-semibold text-black transition hover:bg-amber-300"
          >
            Sprawdź potencjał swoich zysków
            <ArrowRight className="h-4 w-4" />
          </MagneticButton>
        </div>

        {/* Dashboard mockup */}
        <div
          className="relative hidden lg:block"
          style={{ transform: `translateY(${scrollY * 0.08}px)` }}
        >
          <div className="rounded-2xl border border-white/10 bg-[#111111] p-5 shadow-2xl shadow-black/50">
            {/* Mock header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400/60" />
                <div className="h-3 w-3 rounded-full bg-amber-400/60" />
                <div className="h-3 w-3 rounded-full bg-teal-400/60" />
              </div>
              <span className="text-xs font-medium text-gray-500">
                Kalendarz — 9:00–14:00
              </span>
            </div>
            {/* Mock calendar grid */}
            <div className="mt-4 space-y-2">
              {[
                { time: '09:00', label: 'A. Kowalska — Kontrola', status: 'booked' },
                { time: '09:30', label: 'M. Nowak — Higienizacja', status: 'booked' },
                { time: '10:00', label: 'Wolny slot — auto-obsadzone', status: 'filled' },
                { time: '10:30', label: 'J. Wiśniewski — Leczenie', status: 'booked' },
                { time: '11:00', label: 'Przypomnienie SMS wysłane', status: 'reminder' },
                { time: '11:30', label: 'K. Lewandowska — Konsultacja', status: 'booked' },
                { time: '12:00', label: 'Rezerwacja online — 24/7', status: 'filled' },
              ].map((slot, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-xs transition ${
                    slot.status === 'filled'
                      ? 'border-teal-400/30 bg-teal-400/10'
                      : slot.status === 'reminder'
                      ? 'border-amber-400/30 bg-amber-400/5'
                      : 'border-white/5 bg-[#0a0a0a]'
                  }`}
                >
                  <span className="w-12 font-mono text-gray-500">{slot.time}</span>
                  <span
                    className={`flex-1 font-medium ${
                      slot.status === 'filled'
                        ? 'text-teal-300'
                        : slot.status === 'reminder'
                        ? 'text-amber-300'
                        : 'text-gray-300'
                    }`}
                  >
                    {slot.label}
                  </span>
                  {slot.status === 'booked' && (
                    <CheckCircle className="h-3.5 w-3.5 text-teal-400/70" strokeWidth={1.5} />
                  )}
                  {slot.status === 'filled' && (
                    <Sparkles className="h-3.5 w-3.5 text-teal-400" strokeWidth={1.5} />
                  )}
                  {slot.status === 'reminder' && (
                    <Bell className="h-3.5 w-3.5 text-amber-400" strokeWidth={1.5} />
                  )}
                </div>
              ))}
            </div>
            {/* Mock footer stats */}
            <div className="mt-4 grid grid-cols-3 gap-3 border-t border-white/5 pt-4">
              <div>
                <p className="text-xs text-gray-500">Obsadzone</p>
                <p className="text-sm font-bold text-teal-300">94%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">No-shows</p>
                <p className="text-sm font-bold text-amber-300">2%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Odzyskany czas</p>
                <p className="text-sm font-bold text-white">18h</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Social Proof — logos strip
// ---------------------------------------------------------------------------
function SocialProof() {
  return (
    <section className="border-y border-white/5 bg-[#0c0c0c] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-500">
          Zaufały nam gabinety stomatologiczne w całej Polsce
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {['DentalCare', 'WhiteSmile', 'OrthoLine', 'MediDent', 'SmilePro'].map((name) => (
            <span
              key={name}
              className="text-lg font-bold tracking-tight text-gray-600 transition hover:text-gray-400"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Automation Calculator + 3-question Diagnosis
// ---------------------------------------------------------------------------
type DiagnosisAnswers = {
  cancellations: string;
  emptySlots: string;
  dropOff: string;
};

const DIAGNOSIS_OPTIONS = {
  cancellations: [
    { value: '0-2', label: '0–2 wizyty' },
    { value: '3-5', label: '3–5 wizyt' },
    { value: '>5', label: 'Powyżej 5' },
  ],
  emptySlots: [
    { value: '0', label: 'Brak' },
    { value: '1-3', label: '1–3' },
    { value: '>3', label: 'Powyżej 3' },
  ],
  dropOff: [
    { value: 'unknown', label: 'Nie wiem' },
    { value: '<20%', label: 'Poniżej 20%' },
    { value: '>20%', label: 'Powyżej 20%' },
  ],
};

// Stałe wartości kalkulatora
const AVG_REVENUE_PER_VISIT = 500; // zł — średni zysk z wizyty
const HOURS_SAVED_PER_STAFF = 10; // h/tydzień — oszczędność czasu na jedną osobę
const HOURLY_COST = 37; // zł brutto — koszt godziny pracy
const WEEKS_PER_MONTH = 4.33;

function Calculator() {
  const [cancellations, setCancellations] = useState(3);
  const [staff, setStaff] = useState(2);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<DiagnosisAnswers>({
    cancellations: '',
    emptySlots: '',
    dropOff: '',
  });
  const [showResult, setShowResult] = useState(false);

  // Wyniki kalkulatora
  const recoveredRevenuePLN = cancellations * AVG_REVENUE_PER_VISIT; // /tydzień
  const recoveredRevenueMonthly = Math.round(recoveredRevenuePLN * WEEKS_PER_MONTH);
  const savedHoursWeekly = staff * HOURS_SAVED_PER_STAFF;
  const savedCostWeekly = savedHoursWeekly * HOURLY_COST;
  const savedCostMonthly = Math.round(savedCostWeekly * WEEKS_PER_MONTH);
  const totalMonthly = recoveredRevenueMonthly + savedCostMonthly;

  const questions = [
    {
      key: 'cancellations' as const,
      icon: Phone,
      title: 'Ile wizyt tygodniowo jest odwoływanych w Twoim gabinecie?',
      options: DIAGNOSIS_OPTIONS.cancellations,
    },
    {
      key: 'emptySlots' as const,
      icon: CalendarClock,
      title: 'Ile średnio "pustych slotów" w grafiku pojawia się w Twoim gabinecie w ciągu tygodnia?',
      options: DIAGNOSIS_OPTIONS.emptySlots,
    },
    {
      key: 'dropOff' as const,
      icon: TrendingUp,
      title: 'Jaki procent nowych pacjentów rezygnuje z wizyty przez trudności z zapisem?',
      options: DIAGNOSIS_OPTIONS.dropOff,
    },
  ];

  const handleAnswer = (key: keyof DiagnosisAnswers, value: string) => {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);

    // Predefiniuj suwaki na podstawie odpowiedzi diagnozy (realistyczne mapowanie)
    if (key === 'cancellations') {
      if (value === '0-2') setCancellations(2);
      else if (value === '3-5') setCancellations(4);
      else if (value === '>5') setCancellations(7);
    }
    if (key === 'emptySlots') {
      if (value === '0') setCancellations((c) => Math.max(c, 1));
      else if (value === '1-3') setCancellations((c) => Math.max(c, 3));
      else if (value === '>3') setCancellations((c) => Math.max(c, 5));
    }

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setShowResult(true);
    }
  };

  return (
    <section id="diagnoza" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">
          Diagnoza Twojego gabinetu
        </p>
        <h2 className="mt-4 max-w-2xl text-3xl font-bold text-white sm:text-4xl">
          Zobacz, ile czasu i zysków odzyska Twój gabinet.
        </h2>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Calculator */}
          <div className="rounded-2xl border border-white/5 bg-[#111111] p-8">
            <h3 className="text-lg font-semibold text-white">
              Kalkulator automatyzacji
            </h3>
            <p className="mt-2 text-sm text-gray-400">
              Suwaki pokazują szacunkowy potencjał odzyskanych dochodów i oszczędności.
            </p>

            <div className="mt-8 space-y-8">
              <div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <CalendarClock className="h-4 w-4 text-teal-400" />
                    Odwołane wizyty tygodniowo
                  </label>
                  <span className="text-lg font-bold text-teal-400">{cancellations}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={cancellations}
                  onChange={(e) => setCancellations(Number(e.target.value))}
                  className="mt-3 w-full accent-teal-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <Users className="h-4 w-4 text-teal-400" />
                    Osoby w recepcji
                  </label>
                  <span className="text-lg font-bold text-teal-400">{staff}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={staff}
                  onChange={(e) => setStaff(Number(e.target.value))}
                  className="mt-3 w-full accent-teal-400"
                />
              </div>
            </div>

            <div className="mt-10 space-y-4 border-t border-white/5 pt-8">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Odzyskane dochody z wizyt / tydzień</span>
                <span className="text-xl font-bold text-white">
                  <StatCounter value={recoveredRevenuePLN} suffix=" zł" />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Oszczędność na recepcji / tydzień</span>
                <span className="text-xl font-bold text-white">
                  <StatCounter value={savedCostWeekly} suffix=" zł" />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Odzyskany czas / tydzień</span>
                <span className="text-xl font-bold text-white">{savedHoursWeekly}h</span>
              </div>
              <div className="rounded-lg bg-teal-400/10 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-teal-300">
                    Potencjał tygodniowy (łącznie)
                  </span>
                  <span className="text-lg font-bold text-teal-300">
                    {(recoveredRevenuePLN + savedCostWeekly).toLocaleString('pl-PL')} zł
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-teal-400/20 pt-2">
                  <span className="text-sm font-medium text-teal-300">
                    Potencjał miesięczny (łącznie)
                  </span>
                  <span className="text-2xl font-bold text-teal-300">
                    <StatCounter value={totalMonthly} suffix=" zł" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="rounded-2xl border border-white/5 bg-[#111111] p-8">
            {!showResult ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    Diagnoza stanu automatyzacji
                  </h3>
                  <span className="text-sm text-gray-500">
                    {step + 1} / {questions.length}
                  </span>
                </div>

                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full bg-teal-400 transition-all duration-300"
                    style={{ width: `${((step + 1) / questions.length) * 100}%` }}
                  />
                </div>

                <div className="mt-8">
                  <div className="flex items-center gap-2 text-teal-400">
                    {(() => {
                      const Icon = questions[step].icon;
                      return <Icon className="h-5 w-5" strokeWidth={1.5} />;
                    })()}
                    <span className="text-xs font-semibold uppercase tracking-widest">
                      Pytanie {step + 1}
                    </span>
                  </div>
                  <p className="mt-3 text-base font-medium text-white">
                    {questions[step].title}
                  </p>

                  <div className="mt-6 grid gap-3">
                    {questions[step].options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleAnswer(questions[step].key, opt.value)}
                        className="flex items-center justify-between rounded-xl border border-white/5 bg-[#0a0a0a] px-5 py-4 text-left text-sm font-medium text-gray-300 transition hover:border-teal-400/40 hover:text-white"
                      >
                        {opt.label}
                        <ArrowRight className="h-4 w-4 text-gray-600" />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col">
                <div className="flex items-center gap-2 text-teal-400">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-xs font-semibold uppercase tracking-widest">
                    Wynik diagnozy
                  </span>
                </div>
                <h3 className="mt-4 text-2xl font-bold text-white">
                  Twój gabinet ma wyraźny potencjał automatyzacji.
                </h3>
                <p className="mt-3 text-sm text-gray-400">
                  Na podstawie Twoich odpowiedzi i kalkulatora, możesz odzyskać
                  do <span className="font-semibold text-teal-300">{savedHoursWeekly}h tygodniowo</span> i
                  <span className="font-semibold text-teal-300"> {totalMonthly.toLocaleString('pl-PL')} zł miesięcznie</span> —
                  z odzyskanych wizyt i oszczędności na recepcji.
                </p>

                <div className="mt-6 space-y-3">
                  {[
                    'Eliminacja pustych slotów w kalendarzu',
                    'Pełna automatyzacja przypomnień o wizytach',
                    'Samoobsługowa rezerwacja 24/7',
                  ].map((goal) => (
                    <div key={goal} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 flex-shrink-0 text-teal-400" strokeWidth={1.5} />
                      <span className="text-sm text-gray-300">{goal}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-8">
                  <MagneticButton
                    href="#book"
                    className="rounded-full bg-amber-400 px-7 py-3.5 text-base font-semibold text-black transition hover:bg-amber-300"
                  >
                    Umów rozmowę
                    <ArrowRight className="h-4 w-4" />
                  </MagneticButton>
                  <p className="mt-3 text-xs text-gray-500">15 min, bez zobowiązań</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Why Automation in Dentistry — light section with Pexels image
// ---------------------------------------------------------------------------
function WhyAutomation() {
  return (
    <section className="bg-[#f7f7f5] px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">
          Dlaczego automatyzacja w stomatologii?
        </p>
        <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
          Systemy odzyskujące twoje dochody
        </h2>
        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6 text-lg leading-relaxed text-gray-700">
            <p>
              Projektujemy systemy dla klinik dentystycznych, które automatycznie
              zapełniają Twój grafik i usuwają puste fotele, eliminując potrzebę
              ręcznej obsługi recepcji.
            </p>
            <p className="text-base text-gray-500">
              Od zapełniania grafiku po samoobsługową rezerwację — bez zatrudniania dodatkowych osób.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
            <img
              src="https://images.pexels.com/photos/6627562/pexels-photo-6627562.jpeg?auto=compress&cs=tinysrgb&w=900"
              alt="Nowoczesny gabinet stomatologiczny"
              className="h-64 w-full object-cover lg:h-80"
              loading="lazy"
            />
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: CalendarClock,
              title: 'Eliminacja pustych slotów',
              text: 'Inteligentne wypełnianie grafiku i automatyczne obsadzanie odwołań.',
            },
            {
              icon: Bell,
              title: 'Automatyczne przypomnienia',
              text: 'SMS i e-mail, które redukują no-shows bez udziału recepcji.',
            },
            {
              icon: Workflow,
              title: 'Samoobsługowa rezerwacja',
              text: 'Pacjenci umawiają wizyty 24/7 bez telefonu do gabinetu.',
            },
          ].map((goal) => (
            <div
              key={goal.title}
              className="rounded-xl border border-gray-200 bg-white p-6 transition hover:border-teal-300 hover:shadow-md"
            >
              <goal.icon className="h-6 w-6 text-teal-600" strokeWidth={1.5} />
              <h3 className="mt-4 text-base font-semibold text-gray-900">
                {goal.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{goal.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// System Diagram (scroll-reveal)
// ---------------------------------------------------------------------------
function SystemDiagram() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visibleSteps, setVisibleSteps] = useState(0);

  const steps = [
    { icon: Phone, title: 'Obsługa pacjenta', text: 'Automatyczne odbieranie połączeń i odpowiedzi na pytania.' },
    { icon: Calendar, title: 'Rezerwacja wizyty', text: 'Samoobsługowy kalendarz dostępny 24/7.' },
    { icon: Bell, title: 'Przypomnienia', text: 'SMS i e-mail redukujące no-shows.' },
    { icon: Database, title: 'Grafik kliniki', text: 'Pełna synchronizacja z systemem gabinetu.' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          steps.forEach((_, i) => {
            setTimeout(() => setVisibleSteps(i + 1), i * 250);
          });
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section ref={sectionRef} className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">
          Jak działa system
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          Od połączenia do obsadzonego grafiku.
        </h2>

        <div className="mt-14 flex flex-col gap-6 md:flex-row md:items-stretch">
          {steps.map((step, i) => (
            <div key={step.title} className="flex flex-1 flex-col items-center text-center">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl border transition-all duration-500 ${
                  visibleSteps > i
                    ? 'border-teal-400/40 bg-teal-400/10 opacity-100'
                    : 'border-white/5 bg-[#111111] opacity-30'
                }`}
              >
                <step.icon
                  className={`h-7 w-7 transition-colors duration-500 ${
                    visibleSteps > i ? 'text-teal-400' : 'text-gray-600'
                  }`}
                  strokeWidth={1.5}
                />
              </div>
              <h3
                className={`mt-4 text-base font-semibold transition-colors duration-500 ${
                  visibleSteps > i ? 'text-white' : 'text-gray-600'
                }`}
              >
                {step.title}
              </h3>
              <p
                className={`mt-2 text-sm transition-colors duration-500 ${
                  visibleSteps > i ? 'text-gray-400' : 'text-gray-700'
                }`}
              >
                {step.text}
              </p>
              {i < steps.length - 1 && (
                <div className="mt-4 hidden h-8 w-px bg-gradient-to-b from-teal-400/40 to-transparent md:block md:h-px md:w-full md:bg-gradient-to-r md:from-teal-400/40 md:to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Before / After Comparison — realistic calendar mockups
// ---------------------------------------------------------------------------
function BeforeAfter() {
  const [position, setPosition] = useState(50);

  const beforeSlots = [
    { time: '09:00', label: '??? — brak potwierdzenia', gap: true },
    { time: '09:30', label: 'Odwołano — pusty slot', gap: true },
    { time: '10:00', label: 'Telefon — pacjent nie odbiera', warn: true },
    { time: '10:30', label: 'Notatka na kartce', warn: true },
    { time: '11:00', label: 'Puste — brak rezerwacji', gap: true },
  ];
  const afterSlots = [
    { time: '09:00', label: 'A. Kowalska — potwierdzony SMS' },
    { time: '09:30', label: 'Auto-obsadzone: M. Nowak' },
    { time: '10:00', label: 'Rezerwacja online — potwierdzona' },
    { time: '10:30', label: 'J. Wiśniewski — przypomnienie wysłane' },
    { time: '11:00', label: 'K. Lewandowska — zapis 24/7' },
  ];

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">
          Przed / Po
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          Chaos administracyjny vs. czysty, zautomatyzowany kalendarz.
        </h2>

        {/* Slider visual — realistic calendar mockups */}
        <div className="relative mt-12 h-80 overflow-hidden rounded-2xl border border-white/5">
          {/* Before (left) — chaotic calendar */}
          <div className="absolute inset-0 flex flex-col bg-[#1a1410]">
            <div className="flex items-center gap-2 border-b border-red-400/10 px-4 py-3">
              <XCircle className="h-4 w-4 text-red-400/60" strokeWidth={1.5} />
              <span className="text-xs font-semibold uppercase tracking-widest text-red-400/70">
                Przed — chaos w grafiku
              </span>
            </div>
            <div className="flex-1 space-y-1.5 overflow-hidden p-3">
              {beforeSlots.map((slot, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-xs ${
                    slot.gap
                      ? 'border-red-400/20 bg-red-400/5'
                      : 'border-amber-400/20 bg-amber-400/5'
                  }`}
                >
                  <span className="w-12 font-mono text-gray-500">{slot.time}</span>
                  <span
                    className={`flex-1 font-medium ${
                      slot.gap ? 'text-red-300/70' : 'text-amber-300/70'
                    }`}
                  >
                    {slot.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* After (right) — clean calendar, clipped by slider */}
          <div
            className="absolute inset-0 flex flex-col overflow-hidden bg-[#0a1a18]"
            style={{ clipPath: `inset(0 0 0 ${position}%)` }}
          >
            <div className="flex items-center gap-2 border-b border-teal-400/10 px-4 py-3">
              <CheckCircle className="h-4 w-4 text-teal-400" strokeWidth={1.5} />
              <span className="text-xs font-semibold uppercase tracking-widest text-teal-400">
                Po — zautomatyzowany kalendarz
              </span>
            </div>
            <div className="flex-1 space-y-1.5 overflow-hidden p-3">
              {afterSlots.map((slot, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border border-teal-400/20 bg-teal-400/5 px-3 py-2.5 text-xs"
                >
                  <span className="w-12 font-mono text-gray-500">{slot.time}</span>
                  <span className="flex-1 font-medium text-teal-300">{slot.label}</span>
                  <CheckCircle className="h-3.5 w-3.5 text-teal-400/70" strokeWidth={1.5} />
                </div>
              ))}
            </div>
          </div>
          {/* Divider handle */}
          <div
            className="absolute top-0 z-10 h-full w-0.5 bg-teal-400"
            style={{ left: `${position}%` }}
          >
            <div className="absolute top-1/2 left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-teal-400 bg-[#0a0a0a]">
              <ChevronDown className="h-4 w-4 rotate-90 text-teal-400" />
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={position}
            onChange={(e) => setPosition(Number(e.target.value))}
            className="absolute inset-0 z-20 w-full cursor-ew-resize opacity-0"
          />
        </div>

        {/* Lists */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-red-400/10 bg-[#1a1410]/40 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-red-400/70">
              Przed
            </h3>
            <ul className="mt-4 space-y-3">
              {[
                'Ręczne potwierdzanie wizyt telefonicznie',
                'Papierowe grafiki i notatki',
                'Przepełniona skrzynka mailowa',
                'Puste sloty po odwołaniach',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400/50" strokeWidth={1.5} />
                  <span className="text-sm text-gray-400">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-teal-400/10 bg-[#0a1a18]/40 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-teal-400">
              Po
            </h3>
            <ul className="mt-4 space-y-3">
              {[
                'Automatyczne przypomnienia SMS i e-mail',
                'Cyfrowy kalendarz zsynchronizowany 24/7',
                'Samoobsługowa rezerwacja pacjenta',
                'Inteligentne obsadzanie wolnych slotów',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-teal-400" strokeWidth={1.5} />
                  <span className="text-sm text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Implementation — how it works in practice (1 week to working system)
// ---------------------------------------------------------------------------
function Implementation() {
  const phases = [
    {
      icon: Wrench,
      title: 'Dzień 1–2: Audyt',
      text: 'Analizujemy Twój obecny grafik, identyfikujemy luki i straty dochodów.',
    },
    {
      icon: Rocket,
      title: 'Dzień 3–5: Konfiguracja',
      text: 'Integrujemy system z Twoim kalendarzem, SMS i e-mail. Zero zmian w sprzęcie.',
    },
    {
      icon: ShieldCheck,
      title: 'Tydzień 1: Działający system',
      text: 'Przypomnienia, samoobsługowa rezerwacja i auto-obsadzanie działają na żywo.',
    },
  ];

  return (
    <section className="bg-[#0c0c0c] px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">
          Jak to wygląda w praktyce
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          Od audytu do działającego systemu w tydzień.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {phases.map((phase) => (
            <div
              key={phase.title}
              className="rounded-xl border border-white/5 bg-[#111111] p-6 transition hover:border-teal-400/30"
            >
              <phase.icon className="h-6 w-6 text-teal-400" strokeWidth={1.5} />
              <h3 className="mt-4 text-base font-semibold text-white">
                {phase.title}
              </h3>
              <p className="mt-2 text-sm text-gray-400">{phase.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------
function Testimonials() {
  const reviews = [
    {
      quote:
        'Od wdrożenia PracticeFlow no-shows spadły z 12% do 3%. Recepcja odzyskała kilkanaście godzin tygodniowo.',
      author: 'dr n. med. Anna Kowalczyk',
      role: 'Właścicielka, WhiteSmile Clinic',
    },
    {
      quote:
        'Puste sloty po odwołaniach wypełniają się same. Widzę różnicę w przychodach już po pierwszym miesiącu.',
      author: 'lek. dent. Piotr Zieliński',
      role: 'Dyrektor, OrthoLine',
    },
  ];

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">
          Opinie gabinetów
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          Co mówią nasi klienci.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {reviews.map((review) => (
            <div
              key={review.author}
              className="rounded-2xl border border-white/5 bg-[#111111] p-8"
            >
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400" strokeWidth={0} />
                ))}
              </div>
              <Quote className="mt-4 h-6 w-6 text-teal-400/40" strokeWidth={1.5} />
              <p className="mt-4 text-base leading-relaxed text-gray-300">
                {review.quote}
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-400/10 text-sm font-bold text-teal-300">
                  {review.author.split(' ').slice(-1)[0][0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{review.author}</p>
                  <p className="text-xs text-gray-500">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Founder Note — light section
// ---------------------------------------------------------------------------
function FounderNote() {
  return (
    <section className="bg-[#f7f7f5] px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-gray-200 bg-white p-10 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">
            Notatka założyciela
          </p>
          <p className="mt-6 text-lg leading-relaxed text-gray-700">
            "Kliniki dentystyczne tracą dochody nie przez brak pacjentów, ale
            przez procesy, których nikt nie audytuje. Stworzyliśmy PracticeFlow,
            żeby to zmienić — z systemem, który sam wypełnia grafik i odzyskuje
            Twój czas."
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600/10 text-sm font-bold text-teal-700">
              PF
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Założyciel, PracticeFlow</p>
              <p className="text-xs text-gray-500">Inżynier systemów automatyzacji</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------
function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Czy muszę zmieniać obecny system rejestracji?',
      a: 'Nie. PracticeFlow integruje się z większością popularnych systemów dla gabinetów stomatologicznych. Konfiguracja trwa 1–2 dni i nie wymaga wymiany sprzętu.',
    },
    {
      q: 'Ile trwa wdrożenie?',
      a: 'Od audytu do działającego systemu mija zwykle tydzień. Pierwsze przypomnienia i samoobsługowa rezerwacja są aktywne już w pierwszych dniach.',
    },
    {
      q: 'Czy pacjenci muszą instalować aplikację?',
      a: 'Nie. Pacjenci korzystają z przypomnień SMS/e-mail oraz linku do rezerwacji online — bez żadnej aplikacji do pobrania.',
    },
    {
      q: 'Co jeśli mam pytania po wdrożeniu?',
      a: 'Oferujemy wsparcie po wdrożeniu. Możesz skontaktować się z nami w każdej chwili — odpowiadamy zwykle tego samego dnia.',
    },
  ];

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">
          FAQ
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          Najczęstsze pytania.
        </h2>
        <div className="mt-10 space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/5 bg-[#111111] overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-[#161616]"
              >
                <span className="text-sm font-semibold text-white">{faq.q}</span>
                {open === i ? (
                  <Minus className="h-4 w-4 flex-shrink-0 text-teal-400" strokeWidth={2} />
                ) : (
                  <Plus className="h-4 w-4 flex-shrink-0 text-gray-500" strokeWidth={2} />
                )}
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-sm leading-relaxed text-gray-400">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Audit CTA + Booking
// ---------------------------------------------------------------------------
function AuditCta() {
  return (
    <section id="book" className="relative overflow-hidden bg-[#111111] px-6 py-32">
      {/* Gradient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(ellipse, #fbbf24 0%, transparent 70%)' }}
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="text-4xl font-bold text-white sm:text-5xl">
          Porozmawiajmy o Twoim grafiku.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-gray-400">
          Krótka rozmowa o tym, gdzie Twój gabinet traci czas i dochody — i jak
          możemy to zautomatyzować. Bez zobowiązań.
        </p>

        <a
          href="mailto:kontakt@practiceflow.pl?subject=Pro%C5%9Bba%20o%20audyt%20grafiku"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-amber-400 px-8 py-4 text-base font-semibold text-black transition hover:bg-amber-300"
        >
          Umów audyt grafiku
          <ArrowRight className="h-4 w-4" />
        </a>
        <p className="mt-3 text-sm text-gray-500">15 min, bez zobowiązań</p>

        <p className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
          <Mail className="h-4 w-4" />
          kontakt@practiceflow.pl
        </p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
function Footer() {
  return (
    <footer className="px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <span className="text-sm font-semibold text-white">PracticeFlow</span>
        <p className="text-xs text-gray-600">
          © 2025 PracticeFlow. Automatyzacja dla gabinetów stomatologicznych.
        </p>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white antialiased">
      <Nav />
      <Hero />
      <Reveal>
        <SocialProof />
      </Reveal>
      <Reveal>
        <Calculator />
      </Reveal>
      <Reveal>
        <WhyAutomation />
      </Reveal>
      <Reveal>
        <SystemDiagram />
      </Reveal>
      <Reveal>
        <BeforeAfter />
      </Reveal>
      <Reveal>
        <CaseStudy />
      </Reveal>
      <Reveal>
        <ComparisonTable />
      </Reveal>
      <Reveal>
        <Implementation />
      </Reveal>
      <Reveal>
        <Testimonials />
      </Reveal>
      <Reveal>
        <FounderNote />
      </Reveal>
      <Reveal>
        <FAQ />
      </Reveal>
      <Reveal>
        <AuditCta />
      </Reveal>
      <Footer />
      <LeadMagnetModal />
      <ExitIntentPopup />
      <StickyMobileCta />
    </div>
  );
}

export default App;
