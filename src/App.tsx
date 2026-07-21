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
  Star,
  Quote,
  Plus,
  Minus,
  Wrench,
  Rocket,
  ShieldCheck,
  X,
} from 'lucide-react';

// Path to the downloadable PDF guide (place the file in /public)
const GUIDE_PDF_PATH = '/practiceflow-przewodnik.pdf';

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
    <span ref={ref} translate="no" className={`notranslate ${className}`}>
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
// Exit-intent popup — single popup, appears after 10 seconds
// ---------------------------------------------------------------------------
function ExitIntentPopup() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const timer = setTimeout(() => setOpen(true), 15000);
    return () => clearTimeout(timer);
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
        className={`relative w-full max-w-md overflow-hidden rounded-2xl border border-cyan-400/20 bg-[#0d1a2e] p-8 shadow-2xl shadow-black/60 transition-all duration-300 ${
          open ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        translate="no"
      >
        <button
          onClick={close}
          aria-label="Zamknij"
          className="absolute right-4 top-4 text-gray-500 transition hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center notranslate" translate="no">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/15">
            <CalendarClock className="h-7 w-7 text-cyan-400" strokeWidth={1.5} />
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-cyan-400">
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
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sky-500 px-6 py-3.5 text-base font-semibold text-black transition hover:bg-sky-400"
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
      className={`fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0a1628]/95 px-4 py-3 backdrop-blur-md transition-transform duration-300 md:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <a
        href="#diagnoza"
        className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-8 py-4 text-base font-bold text-black shadow-lg shadow-cyan-500/40"
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
      className={`fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#0a1628]/80 backdrop-blur-md transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="text-base font-semibold tracking-tight text-white">
          PracticeFlow
        </span>
        <a
          href="#diagnoza"
          className="rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-7 py-3 text-base font-bold text-black shadow-lg shadow-cyan-500/40 transition hover:scale-105 hover:shadow-xl hover:shadow-cyan-400/50"
        >
          Umów rozmowę
        </a>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Case Study — concrete before/after with numbers
// ---------------------------------------------------------------------------
function CaseStudy() {
  return (
    <section className="bg-[#f7f7f5] px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-600">
            Case study
          </p>
          <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
            Gabinet Stomatologiczny „Uśmiech"
          </h2>
          <p className="mt-4 text-gray-600">
            3 fotele, 6 higienistek, 4 dentystów. Wdrożenie: 14 dni.
          </p>
        </div>

        {/* Clinic photo */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
          <img
            src="https://images.pexels.com/photos/6812532/pexels-photo-6812532.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Dentysta pracujący z pacjentem w nowoczesnej klinice"
            className="h-64 w-full object-cover sm:h-80"
            loading="lazy"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Before */}
          <div className="rounded-2xl border border-red-500/20 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-red-600">Przed wdrożeniem</p>
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-3xl font-bold text-gray-900">12%</p>
                <p className="text-sm text-gray-600">wskaźnik no-shows</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">12h/tyg.</p>
                <p className="text-sm text-gray-600">czas recepcji na telefon i przypomnienia</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">~14 000 zł</p>
                <p className="text-sm text-gray-600">stracone zyski / miesiąc (puste sloty)</p>
              </div>
            </div>
          </div>

          {/* After */}
          <div className="rounded-2xl border border-cyan-500/20 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-cyan-600">Po wdrożeniu</p>
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  <StatCounter value={3} suffix="%" />
                </p>
                <p className="text-sm text-gray-600">wskaźnik no-shows</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  <StatCounter value={4} suffix="h/tyg." />
                </p>
                <p className="text-sm text-gray-600">czas recepcji na telefon i przypomnienia</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  <StatCounter value={21000} suffix=" zł" />
                </p>
                <p className="text-sm text-gray-600">odzyskane zyski / miesiąc</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <p className="text-lg font-semibold text-gray-900">
            ROI wdrożenia: <span className="text-cyan-600">3,2x</span> w pierwszym miesiącu
          </p>
          <p className="mt-2 text-sm text-gray-600">
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
      return <CheckCircle className="mx-auto h-5 w-5 text-cyan-600" />;
    if (val === false) return <XCircle className="mx-auto h-5 w-5 text-gray-300" />;
    return <span className="text-xs text-gray-500">{val}</span>;
  };

  return (
    <section className="bg-[#f7f7f5] px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-600">
            Porównanie
          </p>
          <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
            Dlaczego PracticeFlow?
          </h2>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="py-5 pl-6 pr-4 text-left text-sm font-medium text-gray-500" />
                <th className="py-5 px-6 text-center text-sm font-bold text-cyan-600">
                  PracticeFlow
                </th>
                <th className="py-5 px-6 text-center text-sm font-medium text-gray-500">
                  Ręczna obsługa
                </th>
                <th className="py-5 px-6 text-center text-sm font-medium text-gray-500">
                  Typowy system
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <tr
                  key={f.label}
                  className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-gray-50/50' : ''}`}
                >
                  <td className="py-5 pl-6 pr-4 text-left text-sm text-gray-900">{f.label}</td>
                  <td className="py-5 px-6 text-center">{renderCell(f.pf)}</td>
                  <td className="py-5 px-6 text-center">{renderCell(f.manual)}</td>
                  <td className="py-5 px-6 text-center">{renderCell(f.other)}</td>
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
        style={{ background: 'radial-gradient(circle, #22d3ee 0%, transparent 70%)' }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
            Puste fotele codziennie palą Twoje pieniądze.
          </h1>
          <p className="mt-6 text-lg text-gray-300">
            Automatycznie wypełnimy każdą dziurę w grafiku, zanim stracisz tysiące złotych.
          </p>
          <MagneticButton
            href="#diagnoza"
            className="mt-10 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-9 py-5 text-lg font-bold text-black shadow-xl shadow-cyan-500/40 transition hover:scale-105 hover:shadow-2xl hover:shadow-cyan-400/50"
          >
            Sprawdź potencjał swoich zysków
            <ArrowRight className="h-5 w-5" />
          </MagneticButton>
        </div>

        {/* Dashboard mockup with clinic photo */}
        <div
          className="relative hidden md:block"
          style={{ transform: `translateY(${scrollY * 0.08}px)` }}
        >
          {/* Floating clinic photo card */}
          <div className="absolute -right-6 -top-8 z-10 w-44 overflow-hidden rounded-xl border border-white/15 shadow-2xl shadow-black/60 transition-transform duration-500 hover:scale-105">
            <img
              src="https://images.pexels.com/photos/6812532/pexels-photo-6812532.jpeg?auto=compress&cs=tinysrgb&w=400"
              alt="Nowoczesna klinika dentystyczna"
              className="h-28 w-full object-cover"
              loading="lazy"
            />
            <div className="bg-[#0d1a2e] px-2 py-1.5">
              <p className="text-[10px] font-semibold text-cyan-400">Twoja klinika</p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/15 bg-[#0d1a2e] p-5 shadow-2xl shadow-black/50">
            {/* Mock header */}
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400/60" />
                <div className="h-3 w-3 rounded-full bg-sky-500/60" />
                <div className="h-3 w-3 rounded-full bg-cyan-400/60" />
              </div>
              <span className="text-xs font-medium text-gray-400">
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
                      ? 'border-cyan-400/30 bg-cyan-400/10'
                      : slot.status === 'reminder'
                      ? 'border-sky-400/30 bg-sky-500/5'
                      : 'border-white/10 bg-[#0a1628]'
                  }`}
                >
                  <span className="w-12 font-mono text-gray-400">{slot.time}</span>
                  <span
                    className={`flex-1 font-medium ${
                      slot.status === 'filled'
                        ? 'text-cyan-300'
                        : slot.status === 'reminder'
                        ? 'text-sky-300'
                        : 'text-gray-300'
                    }`}
                  >
                    {slot.label}
                  </span>
                  {slot.status === 'booked' && (
                    <CheckCircle className="h-3.5 w-3.5 text-cyan-400/70" strokeWidth={1.5} />
                  )}
                  {slot.status === 'filled' && (
                    <Sparkles className="h-3.5 w-3.5 text-cyan-400" strokeWidth={1.5} />
                  )}
                  {slot.status === 'reminder' && (
                    <Bell className="h-3.5 w-3.5 text-sky-400" strokeWidth={1.5} />
                  )}
                </div>
              ))}
            </div>
            {/* Mock footer stats */}
            <div className="mt-4 grid grid-cols-3 gap-3 border-t border-white/15 pt-4">
              <div>
                <p className="text-xs text-gray-400">Obsadzone</p>
                <p className="text-sm font-bold text-cyan-300">94%</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">No-shows</p>
                <p className="text-sm font-bold text-sky-300">2%</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Odzyskany czas</p>
                <p className="text-sm font-bold text-white">14h</p>
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
    <section className="border-y border-white/10 bg-[#0d1a2e] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400">
          Zaufały nam gabinety stomatologiczne w całej Polsce
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {['DentalCare', 'WhiteSmile', 'OrthoLine', 'MediDent', 'SmilePro'].map((name) => (
            <span
              key={name}
              className="text-lg font-bold tracking-tight text-gray-500 transition hover:text-gray-300"
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
const AVG_REVENUE_PER_VISIT = 500; // zł — średni zysk z jednej odwołanej wizyty
const REVENUE_PER_STAFF_MONTHLY = 1480; // zł/miesiąc — odzyskane dochody z jednej osoby w recepcji
const HOURS_SAVED_PER_STAFF_MONTHLY = 40; // h/miesiąc — odzyskany czas z jednej osoby w recepcji

function RangeSlider({ value, min, max, onChange }: { value: number; min: number; max: number; onChange: (v: number) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pct = ((value - min) / (max - min)) * 100;

  const setFromClientX = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    onChange(Math.round(min + ratio * (max - min)));
  };

  return (
    <div
      ref={trackRef}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.buttons !== 1) return;
        setFromClientX(e.clientX);
      }}
      className="mt-3 flex h-6 cursor-pointer touch-none items-center"
    >
      <div className="relative h-2 w-full rounded-full bg-white/10">
        <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400" style={{ width: `${pct}%` }} />
        <div
          className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-400 bg-white shadow-lg shadow-cyan-500/40"
          style={{ left: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Calculator() {
  const [cancellations, setCancellations] = useState(10);
  const [staff, setStaff] = useState(2);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<DiagnosisAnswers>({
    cancellations: '',
    emptySlots: '',
    dropOff: '',
  });

  const [showResult, setShowResult] = useState(false);
  const recoveredRevenueMonthly = cancellations * AVG_REVENUE_PER_VISIT + staff * REVENUE_PER_STAFF_MONTHLY;
  const savedHoursMonthly = staff * HOURS_SAVED_PER_STAFF_MONTHLY;
  const totalMonthly = recoveredRevenueMonthly;

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
      if (value === '0-2') setCancellations(5);
      else if (value === '3-5') setCancellations(10);
      else if (value === '>5') setCancellations(18);
    }
    if (key === 'emptySlots') {
      if (value === '0') setCancellations((c) => Math.max(c, 5));
      else if (value === '1-3') setCancellations((c) => Math.max(c, 8));
      else if (value === '>3') setCancellations((c) => Math.max(c, 12));
    }

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setShowResult(true);
    }
  };

  return (
    <section id="diagnoza" className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
          Diagnoza Twojego gabinetu
        </p>
        <h2 className="mt-4 max-w-2xl text-3xl font-bold text-white sm:text-4xl">
          Zobacz, ile czasu i dochodu odzyska Twój gabinet.
        </h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* Calculator */}
          <div className="rounded-2xl border border-white/15 bg-[#0d1a2e] p-6">
            <h3 className="text-lg font-semibold text-white">
              Kalkulator automatyzacji
            </h3>
            <p className="mt-2 text-sm text-gray-300">
              Szacunkowy potencjał odzyskanych dochodów i oszczędności.
            </p>

            <div className="mt-8 space-y-8">
              <div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-100">
                    <CalendarClock className="h-4 w-4 text-cyan-400" />
                    Odwołane wizyty miesięcznie
                  </label>
                  <span className="text-lg font-bold text-cyan-300">{cancellations}</span>
                </div>
                <RangeSlider value={cancellations} min={10} max={30} onChange={setCancellations} />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-100">
                    <Users className="h-4 w-4 text-cyan-400" />
                    Osoby w recepcji
                  </label>
                  <span className="text-lg font-bold text-cyan-300">{staff}</span>
                </div>
                <RangeSlider value={staff} min={1} max={10} onChange={setStaff} />
              </div>
            </div>

            <div className="mt-10 space-y-4 border-t border-white/15 pt-8">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Odzyskane dochody z wizyt / miesiąc</span>
                <span className="text-xl font-bold text-white">
                  <StatCounter value={recoveredRevenueMonthly} suffix=" zł" />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Odzyskany czas / miesiąc</span>
                <span className="text-xl font-bold text-white">{savedHoursMonthly}h</span>
              </div>
              <div className="rounded-lg bg-cyan-400/10 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-cyan-200">
                    Potencjał miesięczny (łącznie)
                  </span>
                  <span className="text-2xl font-bold text-cyan-200">
                    <StatCounter value={totalMonthly} suffix=" zł" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="rounded-2xl border border-white/15 bg-[#0d1a2e] p-6">
            {!showResult ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    Diagnoza stanu automatyzacji
                  </h3>
                  <span className="text-sm text-gray-400">
                    {step + 1} / {questions.length}
                  </span>
                </div>

                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-300"
                    style={{ width: `${((step + 1) / questions.length) * 100}%` }}
                  />
                </div>

                <div className="mt-8">
                  <div className="flex items-center gap-2 text-cyan-400">
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
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0a1628] px-5 py-4 text-left text-sm font-medium text-gray-200 transition hover:border-cyan-400/40 hover:text-white"
                      >
                        {opt.label}
                        <ArrowRight className="h-4 w-4 text-gray-500" />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-xs font-semibold uppercase tracking-widest">
                    Wynik diagnozy
                  </span>
                </div>
                <h3 className="mt-4 text-2xl font-bold text-white">
                  Twój gabinet ma wyraźny potencjał automatyzacji.
                </h3>
                <p className="mt-3 text-sm text-gray-300">
                  Na podstawie Twoich odpowiedzi i kalkulatora, możesz odzyskać
                  do <span className="font-semibold text-cyan-200">{savedHoursMonthly}h miesięcznie</span> i
                  <span className="font-semibold text-cyan-200"> {totalMonthly.toLocaleString('pl-PL')} zł miesięcznie</span> —
                  z odzyskanych wizyt i oszczędności na recepcji.
                </p>

                <div className="mt-6 space-y-3">
                  {[
                    'Eliminacja pustych slotów w kalendarzu',
                    'Pełna automatyzacja przypomnień o wizytach',
                    'Samoobsługowa rezerwacja 24/7',
                  ].map((goal) => (
                    <div key={goal} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 flex-shrink-0 text-cyan-400" strokeWidth={1.5} />
                      <span className="text-sm text-gray-200">{goal}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-8">
                  <MagneticButton
                    href="#book"
                    className="rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-8 py-4 text-lg font-bold text-black shadow-xl shadow-cyan-500/40 transition hover:scale-105 hover:shadow-2xl hover:shadow-cyan-400/50"
                  >
                    Umów rozmowę
                    <ArrowRight className="h-5 w-5" />
                  </MagneticButton>
                  <p className="mt-3 text-xs text-gray-400">15 min, bez zobowiązań</p>
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
// System Diagram (scroll-reveal) — light section
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
    <section ref={sectionRef} className="bg-[#f7f7f5] px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-600">
          Jak działa system
        </p>
        <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
          Od połączenia do obsadzonego grafiku.
        </h2>

        <div className="relative mt-14">
          {/* Horizontal progress line behind icons (desktop) */}
          <div className="absolute left-0 right-0 top-8 hidden h-0.5 bg-gray-200 md:block">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-1000 ease-out"
              style={{ width: `${(visibleSteps / steps.length) * 100}%` }}
            />
          </div>
          {/* Vertical progress line (mobile) */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 md:hidden">
            <div
              className="w-full bg-gradient-to-b from-cyan-500 to-cyan-400 transition-all duration-1000 ease-out"
              style={{ height: `${(visibleSteps / steps.length) * 100}%` }}
            />
          </div>

          <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-4">
            {steps.map((step, i) => (
              <div key={step.title} className="relative flex flex-1 flex-col items-center text-center md:items-center">
                <div
                  className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#f7f7f5] transition-all duration-500 ${
                    visibleSteps > i
                      ? 'bg-cyan-500 scale-100'
                      : 'bg-white border-gray-200 scale-90'
                  }`}
                >
                  <step.icon
                    className={`h-7 w-7 transition-colors duration-500 ${
                      visibleSteps > i ? 'text-white' : 'text-gray-400'
                    }`}
                    strokeWidth={1.5}
                  />
                </div>
                <h3
                  className={`mt-4 text-base font-semibold transition-colors duration-500 ${
                    visibleSteps > i ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`mt-2 max-w-[14rem] text-sm transition-colors duration-500 ${
                    visibleSteps > i ? 'text-gray-600' : 'text-gray-400'
                  }`}
                >
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Phone mockup — system in action */}
        <div className="mt-16 flex flex-col items-center gap-8 sm:flex-row sm:justify-center">
          <div className="relative w-64 rounded-[2rem] border-[6px] border-gray-800 bg-[#0d1a2e] p-3 shadow-2xl">
            <div className="absolute left-1/2 top-1.5 h-1 w-12 -translate-x-1/2 rounded-full bg-gray-700" />
            <div className="mt-5 space-y-2">
              <div className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-3">
                <div className="flex items-center gap-2">
                  <Bell className="h-3.5 w-3.5 text-cyan-400" strokeWidth={1.5} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">SMS</span>
                </div>
                <p className="mt-1.5 text-xs text-gray-300">Przypominamy o wizycie jutro 9:00. Odpowiedz TAK.</p>
              </div>
              <div className="rounded-xl border border-green-400/30 bg-green-400/10 p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-green-400" strokeWidth={1.5} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-green-400">Potwierdzone</span>
                </div>
                <p className="mt-1.5 text-xs text-gray-300">Pacjent potwierdził wizytę automatycznie.</p>
              </div>
              <div className="rounded-xl border border-sky-400/30 bg-sky-400/10 p-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-sky-400" strokeWidth={1.5} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">Kalendarz</span>
                </div>
                <p className="mt-1.5 text-xs text-gray-300">Slot 9:00 obsadzony — 24/7.</p>
              </div>
            </div>
          </div>
          <div className="max-w-xs text-center sm:text-left">
            <p className="text-sm font-semibold text-gray-900">Wszystko dzieje się automatycznie</p>
            <p className="mt-2 text-sm text-gray-600">Pacjent dostaje SMS, potwierdza jedną odpowiedzią, a system aktualizuje grafik — bez telefonu od recepcji.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Before / After Comparison — realistic calendar mockups
// ---------------------------------------------------------------------------
function BeforeAfter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

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
    <section ref={sectionRef} className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
          Przed / Po
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          Chaos administracyjny vs. czysty, zautomatyzowany kalendarz.
        </h2>

        <div className="relative mt-12 grid items-stretch gap-6 md:grid-cols-2">
          {/* VS divider */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 md:block">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-[#0a1628] text-xs font-bold text-gray-400 shadow-lg">
              VS
            </div>
          </div>

          {/* Before — chaotic calendar */}
          <div
            className={`rounded-2xl border border-red-500/20 bg-[#1a0e0e] p-6 transition-all duration-700 ${
              visible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
            }`}
          >
            <div className="flex items-center gap-2 border-b border-red-500/15 pb-3">
              <XCircle className="h-4 w-4 text-red-400" strokeWidth={1.5} />
              <span className="text-xs font-semibold uppercase tracking-widest text-red-400/80">
                Przed — chaos w grafiku
              </span>
            </div>
            <div className="mt-4 space-y-2">
              {beforeSlots.map((slot, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border border-red-500/10 bg-red-500/[0.03] px-3 py-2.5 text-xs"
                >
                  <span className="w-12 font-mono text-gray-500">{slot.time}</span>
                  <span className="flex-1 font-medium text-red-300/60 line-through decoration-red-800">
                    {slot.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 border-t border-red-500/15 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-red-400/60">No-shows</span>
                <span className="text-lg font-bold text-red-400">12%</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <div className="h-full w-[12%] rounded-full bg-red-500" />
              </div>
            </div>
          </div>

          {/* After — clean calendar */}
          <div
            className={`relative overflow-hidden rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-[#0a1a18] to-[#0d1a2e] p-6 shadow-lg shadow-cyan-500/10 transition-all delay-150 duration-700 ${
              visible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
            }`}
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-400/10 blur-2xl" />
            <div className="relative flex items-center gap-2 border-b border-cyan-400/20 pb-3">
              <CheckCircle className="h-4 w-4 text-cyan-400" strokeWidth={1.5} />
              <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
                Po — zautomatyzowany kalendarz
              </span>
            </div>
            <div className="relative mt-4 space-y-2">
              {afterSlots.map((slot, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5 text-xs transition-transform hover:translate-x-1"
                >
                  <span className="w-12 font-mono text-gray-400">{slot.time}</span>
                  <span className="flex-1 font-medium text-white">{slot.label}</span>
                  <CheckCircle className="h-3.5 w-3.5 text-cyan-400/70" strokeWidth={1.5} />
                </div>
              ))}
            </div>
            <div className="relative mt-5 border-t border-cyan-400/20 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-cyan-300/70">No-shows</span>
                <span className="text-lg font-bold text-cyan-300">3%</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <div className="h-full w-[3%] rounded-full bg-cyan-400" />
              </div>
            </div>
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
    <section className="bg-[#0d1a2e] px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
          Jak to wygląda w praktyce
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          Od audytu do działającego systemu w tydzień.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {phases.map((phase) => (
            <div
              key={phase.title}
              className="rounded-xl border border-white/10 bg-[#0d1a2e] p-6 transition hover:border-cyan-400/30"
            >
              <phase.icon className="h-6 w-6 text-cyan-400" strokeWidth={1.5} />
              <h3 className="mt-4 text-base font-semibold text-white">
                {phase.title}
              </h3>
              <p className="mt-2 text-sm text-gray-300">{phase.text}</p>
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
      result: 'No-shows: 12% → 3%',
    },
    {
      quote:
        'Puste sloty po odwołaniach wypełniają się same. Widzę różnicę w przychodach już po pierwszym miesiącu.',
      author: 'lek. dent. Piotr Zieliński',
      role: 'Dyrektor, OrthoLine',
      result: '+38% przychodów / m-c',
    },
  ];

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
          Opinie gabinetów
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          Co mówią nasi klienci.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {reviews.map((review) => (
            <div
              key={review.author}
              className="rounded-2xl border border-white/10 bg-[#0d1a2e] p-8"
            >
              <div className="flex items-center gap-1 text-sky-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-sky-400" strokeWidth={0} />
                ))}
              </div>
              <Quote className="mt-4 h-6 w-6 text-cyan-400/40" strokeWidth={1.5} />
              <p className="mt-4 text-base leading-relaxed text-gray-300">
                {review.quote}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-3 py-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-cyan-400" strokeWidth={1.5} />
                <span className="text-xs font-semibold text-cyan-300">{review.result}</span>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400/10 text-sm font-bold text-cyan-300">
                  {review.author.split(' ').slice(-1)[0][0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{review.author}</p>
                  <p className="text-xs text-gray-400">{review.role}</p>
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
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-600">
            Notatka założyciela
          </p>
          <p className="mt-6 text-lg leading-relaxed text-gray-700">
            "Kliniki dentystyczne tracą dochody nie przez brak pacjentów, ale
            przez procesy, których nikt nie audytuje. Stworzyliśmy PracticeFlow,
            żeby to zmienić — z systemem, który sam wypełnia grafik i odzyskuje
            Twój czas."
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600/10 text-sm font-bold text-cyan-700">
              P
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Patryk</p>
              <p className="text-xs text-gray-500">Założyciel, PracticeFlow</p>
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
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
          FAQ
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          Najczęstsze pytania.
        </h2>
        <div className="mt-10 space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 bg-[#0d1a2e] overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-[#102338]"
              >
                <span className="text-sm font-semibold text-white">{faq.q}</span>
                {open === i ? (
                  <Minus className="h-4 w-4 flex-shrink-0 text-cyan-400" strokeWidth={2} />
                ) : (
                  <Plus className="h-4 w-4 flex-shrink-0 text-gray-400" strokeWidth={2} />
                )}
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-sm leading-relaxed text-gray-300">
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
// Mini CTA — compact booking prompt with sweeping light animation
// ---------------------------------------------------------------------------
function MiniCta() {
  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl border-2 border-cyan-500/40 bg-gradient-to-br from-[#0d1a2e] via-[#0d1a2e] to-[#102540] p-12 text-center shadow-2xl shadow-cyan-500/20 sm:p-16">
          {/* Soft ambient glow */}
          <div
            className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl"
            style={{ animation: 'pulse 6s ease-in-out infinite' }}
          />
          <div
            className="pointer-events-none absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-sky-400/15 blur-3xl"
            style={{ animation: 'pulse 8s ease-in-out 2s infinite' }}
          />
          {/* Top accent bar */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          <div className="relative">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/20 ring-1 ring-cyan-400/40 transition-transform duration-500 hover:scale-110">
              <CalendarClock className="h-8 w-8 text-cyan-400" strokeWidth={1.5} />
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Bezpłatna konsultacja
            </p>
            <h3 className="mx-auto mt-3 max-w-xl text-3xl font-bold text-white sm:text-4xl">
              Odkryj, ile Twój gabinet traci co tydzień.
            </h3>

            <a
              href="mailto:kontakt@practiceflow.pl?subject=Pro%C5%9Bba%20o%20audyt%20grafiku"
              className="group mt-10 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-12 py-5 text-lg font-bold text-black shadow-xl shadow-cyan-500/40 transition hover:scale-105 hover:shadow-2xl hover:shadow-cyan-400/50"
            >
              Umów bezpłatny audyt
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
            <p className="mt-4 text-sm text-gray-400">15 min, bez zobowiązań</p>
          </div>
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
    <section id="book" className="relative overflow-hidden bg-[#0d1a2e] px-6 py-32">
      {/* Gradient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(ellipse, #0ea5e9 0%, transparent 70%)' }}
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="text-4xl font-bold text-white sm:text-5xl">
          Porozmawiajmy o Twoim grafiku.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-gray-300">
          Krótka rozmowa o tym, gdzie Twój gabinet traci czas i dochody — i jak
          możemy to zautomatyzować. Bez zobowiązań.
        </p>

        <div className="mx-auto mt-10 flex max-w-lg flex-wrap items-center justify-center gap-4">
          {[
            { value: '15 min', label: 'rozmowy' },
            { value: '12h', label: 'odzyskane / m-c' },
            { value: '1 tydzień', label: 'do wdrożenia' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3"
            >
              <span className="text-xl font-bold text-cyan-300">{stat.value}</span>
              <span className="text-xs text-gray-400">{stat.label}</span>
            </div>
          ))}
        </div>

        <a
          href="mailto:kontakt@practiceflow.pl?subject=Pro%C5%9Bba%20o%20audyt%20grafiku"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-8 py-4 text-base font-bold text-black shadow-xl shadow-cyan-500/40 transition hover:scale-105 hover:shadow-2xl hover:shadow-cyan-400/50"
        >
          Umów audyt grafiku
          <ArrowRight className="h-4 w-4" />
        </a>
        <p className="mt-3 text-sm text-gray-400">15 min, bez zobowiązań</p>

        <p className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
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
    <div className="min-h-screen bg-[#0a1628] text-white antialiased">
      <Nav />
      <Hero />
      <Reveal>
        <SocialProof />
      </Reveal>
      <Reveal>
        <SystemDiagram />
      </Reveal>
      <Reveal>
        <MiniCta />
      </Reveal>
      <Reveal>
        <Calculator />
      </Reveal>
      <Reveal>
        <Implementation />
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
        <Testimonials />
      </Reveal>
      <Reveal>
        <FounderNote />
      </Reveal>
      <Reveal>
        <AuditCta />
      </Reveal>
      <Reveal>
        <FAQ />
      </Reveal>
      <Footer />

      <StickyMobileCta />
      <ExitIntentPopup />
    </div>
  );
}

export default App;
