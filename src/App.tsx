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
  Clock,
  Video,
  Database,
  Sparkles,
  Star,
  Quote,
  Plus,
  Minus,
  Wrench,
  Rocket,
  ShieldCheck,
  X,
  Loader2,
  Languages,
  Stethoscope,
} from 'lucide-react';
import { I18nProvider, useI18n, type Lang } from './lib/i18n';
import { LeadForm } from './lib/LeadForm';

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
// Language toggle button
// ---------------------------------------------------------------------------
function LanguageToggle({ className = '' }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  const next: Lang = lang === 'pl' ? 'en' : 'pl';
  return (
    <button
      onClick={() => setLang(next)}
      aria-label={lang === 'pl' ? 'Switch to English' : 'Przełącz na polski'}
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-2 text-xs font-bold text-gray-300 transition hover:border-cyan-400/50 hover:text-white ${className}`}
    >
      <Languages className="h-3.5 w-3.5" strokeWidth={1.5} />
      {t.langLabel}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Exit-intent popup — appears after 15 seconds, offers a free report download
// ---------------------------------------------------------------------------
function ExitIntentPopup() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed || sessionStorage.getItem('popupShown')) return;
    const timer = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem('popupShown', 'true');
    }, 25000);
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
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 text-gray-500 transition hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <img
            src="/logo-fullschedule.svg"
            alt="FullSchedule"
            className="mb-5 h-14 w-auto"
          />
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/15">
            <CalendarClock className="h-7 w-7 text-cyan-400" strokeWidth={1.5} />
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-cyan-400">
            {t.exitPopup.eyebrow}
          </p>
          <h3 className="mt-3 text-xl font-bold text-white">
            {t.exitPopup.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-gray-400">
            {t.exitPopup.desc}
          </p>
          <a
            href="/practiceflow-przewodnik.pdf"
            download
            id="exit-pdf-link"
            onClick={close}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sky-500 px-6 py-3.5 text-base font-semibold text-black transition hover:bg-sky-400"
          >
            {t.exitPopup.download}
            <ArrowRight className="h-4 w-4" />
          </a>
          <button
            onClick={close}
            className="mt-3 text-xs text-gray-500 transition hover:text-gray-300"
          >
            {t.exitPopup.decline}
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
  const { t } = useI18n();
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
        href="#book"
        className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-8 py-4 text-base font-bold text-black shadow-lg shadow-cyan-500/40"
      >
        {t.sticky}
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sticky Navigation (appears after scrolling past hero)
// ---------------------------------------------------------------------------
function Nav() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#0a1628]/80 backdrop-blur-md transition-transform duration-300 ease-out ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="#top"
          className="flex items-center"
        >
          <img
            src="/logo-fullschedule.svg"
            alt="FullSchedule"
            className="h-10 w-auto"
          />
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          <a href="#diagnoza" className="text-sm font-medium text-gray-300 transition hover:text-cyan-300">{t.nav.calc}</a>
          <a href="#onas" className="text-sm font-medium text-gray-300 transition hover:text-cyan-300">{t.nav.about}</a>
          <a href="#kontakt" className="text-sm font-medium text-gray-300 transition hover:text-cyan-300">{t.nav.contact}</a>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <a
            href="#book"
            className="rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-7 py-3 text-base font-bold text-black shadow-lg shadow-cyan-500/40 transition hover:bg-cyan-400"
          >
            {t.nav.book}
          </a>
        </div>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// [Removed: CaseStudy]
// ---------------------------------------------------------------------------
function _CaseStudy_REMOVED() {
  const { t } = useI18n();
  return (
    <section id="case-study" className="bg-[#f7f7f5] px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-600">
            {t.caseStudy.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
            {t.caseStudy.title}
          </h2>
          <p className="mt-4 text-gray-600">
            {t.caseStudy.desc}
          </p>
        </div>

        {/* Clinic photo */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
          <img
            src="https://images.pexels.com/photos/6812532/pexels-photo-6812532.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Dental clinic"
            className="h-64 w-full object-cover sm:h-80"
            loading="lazy"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Before */}
          <div className="rounded-2xl border border-red-500/20 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-red-600">{t.caseStudy.before}</p>
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-3xl font-bold text-gray-900">12%</p>
                <p className="text-sm text-gray-600">{t.caseStudy.noshowLabel}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">12h/tyg.</p>
                <p className="text-sm text-gray-600">{t.caseStudy.timeLabel}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">~14 000 zł</p>
                <p className="text-sm text-gray-600">{t.caseStudy.lostLabel}</p>
              </div>
            </div>
          </div>

          {/* After */}
          <div className="rounded-2xl border border-cyan-500/20 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-cyan-600">{t.caseStudy.after}</p>
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  <StatCounter value={3} suffix="%" />
                </p>
                <p className="text-sm text-gray-600">{t.caseStudy.noshowLabel}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  <StatCounter value={4} suffix="h/tyg." />
                </p>
                <p className="text-sm text-gray-600">{t.caseStudy.timeLabel}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  <StatCounter value={21000} suffix=" zł" />
                </p>
                <p className="text-sm text-gray-600">{t.caseStudy.recoveredLabel}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <p className="text-lg font-semibold text-gray-900">
            {t.caseStudy.roi}
          </p>
          <p className="mt-2 text-sm text-gray-600">
            {t.caseStudy.quote}
          </p>
          <p className="mt-3 text-xs text-gray-500">{t.caseStudy.author}</p>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Comparison Table — [Removed]
// ---------------------------------------------------------------------------
function _ComparisonTable_REMOVED() {
  const { t } = useI18n();
  const features = [
    { pf: true, manual: false },
    { pf: true, manual: false },
    { pf: true, manual: false },
    { pf: true, manual: false },
    { pf: true, manual: t.comparison.manual2 },
    { pf: true, manual: false },
    { pf: true, manual: false },
  ];

  const renderCell = (val: boolean | string) => {
    if (val === true)
      return <CheckCircle className="mx-auto h-5 w-5 text-cyan-600" />;
    if (val === false) return <XCircle className="mx-auto h-5 w-5 text-gray-300" />;
    return <span className="text-xs text-gray-500">{val}</span>;
  };

  return (
    <section className="bg-[#f7f7f5] px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-600">
            {t.comparison.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
            {t.comparison.title}
          </h2>
        </div>

        {/* Desktop: table */}
        <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm sm:block">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="py-5 pl-6 pr-4 text-left text-sm font-medium text-gray-500" />
                <th className="py-5 px-6 text-center text-sm font-bold text-cyan-600">
                  {t.comparison.pf}
                </th>
                <th className="py-5 px-6 text-center text-sm font-medium text-gray-500">
                  {t.comparison.manual}
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <tr
                  key={i}
                  className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-gray-50/50' : ''}`}
                >
                  <td className="py-5 pl-6 pr-4 text-left text-sm text-gray-900">{t.comparison.features[i]}</td>
                  <td className="py-5 px-6 text-center">{renderCell(f.pf)}</td>
                  <td className="py-5 px-6 text-center">{renderCell(f.manual)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: cards */}
        <div className="space-y-3 sm:hidden">
          {features.map((f, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-gray-900">{t.comparison.features[i]}</p>
              <div className="mt-3 flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  {renderCell(f.pf)}
                  <span className="text-xs font-medium text-cyan-600">{t.comparison.pf}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {renderCell(f.manual)}
                  <span className="text-xs text-gray-500">{t.comparison.manual}</span>
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
// About Section
// ---------------------------------------------------------------------------
function AboutSection() {
  const { t } = useI18n();

  return (
    <section id="onas" className="bg-[#f7f7f5] px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-600">
          {t.about.eyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
          {t.about.title}
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-gray-600">
          {t.about.body}
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <p className="text-4xl font-bold text-cyan-600">30–50%</p>
            <p className="mt-2 text-sm text-gray-600">{t.about.stat1}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <p className="text-4xl font-bold text-cyan-600">24/7</p>
            <p className="mt-2 text-sm text-gray-600">{t.about.stat2}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <p className="text-4xl font-bold text-cyan-600">0 zł</p>
            <p className="mt-2 text-sm text-gray-600">{t.about.stat3}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Hero — asymmetric, with dashboard mockup on the right
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Hero Carousel — rotating dashboard views with smooth crossfade
// ---------------------------------------------------------------------------
function HeroCarousel() {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const slides = t.heroCarousel.slides;

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative hidden md:flex items-center justify-center lg:mr-auto lg:justify-self-start lg:ml-10">
      
      {/* Phone Mockup */}
      <div className="relative mt-12 w-[334px] h-[710px] overflow-hidden rounded-[3.5rem] border border-slate-900/80 bg-[#04050d] shadow-[0_35px_80px_rgba(0,0,0,0.6)]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070d] via-[#07101a] to-[#06101a]" />

        {/* Notch */}
        <div className="absolute inset-x-0 top-0 z-20 flex justify-center pt-4">
          <div className="h-10 w-[180px] rounded-b-[26px] bg-[#04050d]/95 shadow-inner shadow-black/40" />
        </div>

        {/* Status bar */}
        <div className="absolute inset-x-0 top-5 z-30 px-5 text-white/80">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold">9:41</span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                <span className="h-1.5 w-5 rounded-full border border-white/70" />
              </div>
              <span className="text-[10px]">LTE</span>
              <div className="flex items-center gap-1">
                <span className="flex h-4 w-7 items-center justify-end rounded-[10px] border border-white/70 px-0.5">
                  <span className="h-2.5 w-4 rounded-[8px] bg-white ml-[1px]" />
                </span>
                <span className="text-[10px]">86%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 top-16 bottom-7 px-3">
          <div className="relative h-full overflow-hidden rounded-[2.2rem] border border-white/10 bg-[#08131f]/95 shadow-inner shadow-black/40 backdrop-blur-xl">
            {slides.map((slide, i) => (
              <div
                key={i}
                className={`absolute inset-0 px-4 pt-5 transition-all duration-1000 ease-in-out ${
                  i === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.35em] text-sky-300">
                  <span>{slide.header}</span>
                  <span className="text-white/60">Dziś</span>
                </div>

                <div className="mt-4 h-[calc(100%-1.5rem)] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#06101a]/95 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                  {slide.type === 'calendar' && <CalendarSlide slide={slide} />}
                  {slide.type === 'features' && <FeaturesSlide slide={slide} />}
                  {slide.type === 'system' && <SystemSlide slide={slide} />}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 z-30 h-1.5 w-20 -translate-x-1/2 rounded-full bg-white/15" />
      </div>
    </div>
  );
}

function CalendarSlide({ slide }: { slide: { items: { time: string; label: string; status: string }[]; footer: { booked: string; noshow: string; saved: string } } }) {
  const { t } = useI18n();
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between text-sm font-semibold text-white">
          <span>Wtorek, 21 lip</span>
          <span className="text-xs text-sky-300">9:00–18:00</span>
        </div>
        <div className="mt-4 space-y-2">
          {slide.items.slice(0, 6).map((slot, i) => (
            <div
              key={i}
              className={`flex items-center justify-between gap-3 rounded-2xl border px-3 py-2 text-xs ${
                slot.status === 'filled'
                  ? 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100'
                  : slot.status === 'reminder'
                  ? 'border-sky-400/20 bg-sky-500/10 text-sky-100'
                  : 'border-white/10 bg-slate-950/60 text-white'
              }`}
            >
              <span className="w-14 font-mono text-xs font-semibold">{slot.time}</span>
              <span className="min-w-0 flex-1 truncate text-[11px] font-medium">{slot.label}</span>
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-slate-300">
                {slot.status === 'reminder' ? 'Przypomnienie' : slot.status === 'filled' ? 'Wypełnione' : 'Potwierdzone'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-[10px]">
        <div className="rounded-2xl bg-white/5 p-3 text-center">
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">{t.hero.booked}</p>
          <p className="mt-2 text-sm font-semibold text-cyan-300">94%</p>
        </div>
        <div className="rounded-2xl bg-white/5 p-3 text-center">
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">{t.hero.noshow}</p>
          <p className="mt-2 text-sm font-semibold text-sky-300">2%</p>
        </div>
        <div className="rounded-2xl bg-white/5 p-3 text-center">
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">{t.hero.saved}</p>
          <p className="mt-2 text-sm font-semibold text-white">14h</p>
        </div>
      </div>
    </div>
  );
}

function FeaturesSlide({ slide }: { slide: { items: { icon: string; label: string; desc: string }[] } }) {
  const iconMap: Record<string, typeof Calendar> = {
    Calendar,
    Bell,
    Users,
    Sparkles,
    Clock,
    Rocket,
    ShieldCheck,
    Database,
  };
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
        <p className="text-sm font-semibold text-white">Aplikacje w jednym miejscu</p>
        <p className="mt-2 text-xs text-slate-400">Wszystko, co potrzebne do zarządzania wizytami.</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {slide.items.slice(0, 4).map((item, i) => {
            const Icon = iconMap[item.icon] ?? CheckCircle;
            return (
              <div key={i} className="rounded-3xl border border-white/10 bg-[#06101a]/90 p-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-cyan-400/10 text-cyan-300">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <p className="mt-3 text-xs font-semibold text-white">{item.label}</p>
                <p className="mt-1 text-[10px] leading-tight text-slate-400">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-[10px]">
        {slide.items.slice(4).map((item, i) => {
          const Icon = iconMap[item.icon] ?? CheckCircle;
          return (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-950/60 text-cyan-300">
                <Icon className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <p className="mt-3 text-[10px] font-medium text-white">{item.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SystemSlide({ slide }: { slide: { title: string; subtitle: string; nodes: { icon: string; label: string }[]; footer: string } }) {
  const iconMap: Record<string, typeof Phone> = {
    Phone,
    Calendar,
    Bell,
    Database,
    Mail,
    Users,
  };
  return (
    <div className="flex h-full flex-col justify-between gap-4">
      <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
        <p className="text-sm font-semibold text-white">{slide.title}</p>
        <p className="mt-2 text-xs text-slate-400">{slide.subtitle}</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {slide.nodes.map((node, i) => {
            const Icon = iconMap[node.icon] ?? CheckCircle;
            return (
              <div key={i} className="rounded-3xl border border-white/10 bg-[#06101a]/90 p-3 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-3xl bg-cyan-400/10 text-cyan-300">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <p className="mt-3 text-xs font-medium text-white">{node.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Status</p>
          <p className="mt-2 text-sm font-semibold text-white">{slide.footer}</p>
        </div>
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-3 text-[10px] text-slate-400">
          <p className="font-semibold text-white">Dock</p>
          <div className="mt-3 flex items-center justify-between gap-2">
            {slide.nodes.slice(0, 4).map((node, i) => {
              const Icon = iconMap[node.icon] ?? CheckCircle;
              return (
                <div key={i} className="flex h-12 min-w-[2.5rem] flex-1 items-center justify-center rounded-2xl bg-slate-950/70 text-cyan-300">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hero — asymmetric, with rotating dashboard carousel on the right
// ---------------------------------------------------------------------------
function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-20 min-h-screen">
      {/* Hero background — clean gradient, no photo */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#08111f] via-[#0a1628] to-[#0c1e35]" />
      <div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-purple-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-[400px] w-[400px] rounded-full bg-pink-500/5 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="max-w-xl text-left">
          <h1 className="pf-hero-fade-in text-4xl font-bold leading-tight text-white sm:text-5xl md:text-7xl">
            {t.hero.title.split(' ').map((word, i) => (
              <span
                key={i}
                className={`pf-hero-word ${i === 0 ? 'pf-hero-word-1' : i === 1 ? 'pf-hero-word-2' : 'pf-hero-word-3'}`}
              >
                {word}
              </span>
            )).reduce<ReactNode[]>((acc, el, i) => {
              if (i > 0) acc.push(' ');
              acc.push(el);
              return acc;
            }, [])}
          </h1>
          <p className="pf-hero-fade-in-delayed mt-6 text-xl text-gray-300">
            {t.hero.subtitle}
          </p>
          <a
            href="#diagnoza"
            className="pf-hero-fade-in-delayed-2 mt-10 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-10 py-6 text-xl font-bold text-black shadow-xl shadow-cyan-500/40 transition hover:bg-cyan-400"
          >
            {t.hero.cta}
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>

        {/* Rotating dashboard carousel */}
        <HeroCarousel />
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

const AVG_REVENUE_PER_VISIT = 500;
const REVENUE_PER_STAFF_MONTHLY = 1480;
const HOURS_SAVED_PER_STAFF_MONTHLY = 40;

function RangeSlider({ value, min, max, onChange }: { value: number; min: number; max: number; onChange: (v: number) => void }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="pf-range mt-3 w-full"
      style={{ '--pf-pct': `${pct}%` } as React.CSSProperties}
    />
  );
}

function AnimatedNumber({ value, formatFn }: { value: number; formatFn?: (val: number) => string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 600;
    const startValue = displayValue;
    const change = value - startValue;

    if (change === 0) return;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(startValue + change * easeOutQuart);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };
    window.requestAnimationFrame(step);
  }, [value]);

  const display = Math.round(displayValue);
  return <span className="tabular-nums">{formatFn ? formatFn(display) : display}</span>;
}

function Calculator() {
  const { t } = useI18n();
  const [cancellations, setCancellations] = useState(1);
  const [staff, setStaff] = useState(1);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<DiagnosisAnswers>({
    cancellations: '',
    emptySlots: '',
    dropOff: '',
  });

  const [showResult, setShowResult] = useState(false);
  const recoveredRevenueMonthly = cancellations * AVG_REVENUE_PER_VISIT;
  const savedHoursMonthly = staff * HOURS_SAVED_PER_STAFF_MONTHLY;
  const staffCostMonthly = staff * REVENUE_PER_STAFF_MONTHLY;
  const totalMonthly = recoveredRevenueMonthly + staffCostMonthly;

  const diagnosisScore =
    (answers.cancellations === '6-15' ? 1 : answers.cancellations === '16-25' ? 2 : answers.cancellations === '>25' ? 3 : 0) +
    (answers.emptySlots === '<5' ? 1 : answers.emptySlots === '5-10' ? 2 : answers.emptySlots === '>10' ? 3 : 0) +
    (answers.dropOff === '>20%' ? 2 : answers.dropOff === '<20%' ? 1 : 0);

  const diagnosisLevel =
    diagnosisScore >= 6 ? t.calc.level.high : diagnosisScore >= 3 ? t.calc.level.mid : t.calc.level.low;

  const questions = [
    {
      key: 'cancellations' as const,
      icon: Phone,
      title: t.calc.q1,
      options: [
        { value: '0-5', label: t.calc.opt.c0 },
        { value: '6-15', label: t.calc.opt.c1 },
        { value: '16-25', label: t.calc.opt.c2 },
        { value: '>25', label: t.calc.opt.c3 },
      ],
    },
    {
      key: 'emptySlots' as const,
      icon: CalendarClock,
      title: t.calc.q2,
      options: [
        { value: '<5', label: t.calc.opt.e1 },
        { value: '5-10', label: t.calc.opt.e2 },
        { value: '>10', label: t.calc.opt.e3 },
      ],
    },
    {
      key: 'dropOff' as const,
      icon: TrendingUp,
      title: t.calc.q3,
      options: [
        { value: 'unknown', label: t.calc.opt.d1 },
        { value: '<20%', label: t.calc.opt.d2 },
        { value: '>20%', label: t.calc.opt.d3 },
      ],
    },
  ];

  const handleAnswer = (key: keyof DiagnosisAnswers, value: string) => {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);

    if (key === 'cancellations') {
      if (value === '0-5') setCancellations(3);
      else if (value === '6-15') setCancellations(10);
      else if (value === '16-25') setCancellations(20);
      else if (value === '>25') setCancellations(28);
    }
    if (key === 'emptySlots') {
      if (value === '<5') setCancellations((c) => Math.max(c, 10));
      else if (value === '5-10') setCancellations((c) => Math.max(c, 16));
      else if (value === '>10') setCancellations((c) => Math.max(c, 24));
    }

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setShowResult(true);
    }
  };

  return (
    /* ROI Calculator Section */
    <section id="calculator" className="relative px-6 py-32 bg-[#08111f] overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/5 blur-[120px]" />
      
      <div className="relative mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
          {t.calc.eyebrow}
        </p>
        <h2 className="mt-4 max-w-2xl text-3xl font-bold text-white sm:text-4xl">
          {t.calc.title}
        </h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* Calculator */}
          <div className="rounded-2xl border border-white/15 bg-[#0d1a2e] p-6">
            <h3 className="text-lg font-semibold text-white">
              {t.calc.calculatorTitle}
            </h3>
            <p className="mt-2 text-sm text-gray-300">
              {t.calc.calculatorDesc}
            </p>

            <div className="mt-8 space-y-8">
              <div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-100">
                    <CalendarClock className="h-4 w-4 text-cyan-400" />
                    {t.calc.cancellations}
                  </label>
                  <span className="text-lg font-bold text-cyan-300">{cancellations}</span>
                </div>
                <RangeSlider value={cancellations} min={1} max={30} onChange={setCancellations} />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-100">
                    <Users className="h-4 w-4 text-cyan-400" />
                    {t.calc.staff}
                  </label>
                  <span className="text-lg font-bold text-cyan-300">{staff}</span>
                </div>
                <RangeSlider value={staff} min={1} max={10} onChange={setStaff} />
              </div>
            </div>

            <div className="mt-10 space-y-4 border-t border-white/15 pt-8">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-gray-300">{t.calc.recoveredRevenue}</span>
                <span className="text-xl font-bold tabular-nums text-white whitespace-nowrap">
                  {recoveredRevenueMonthly.toLocaleString('pl-PL')} zł
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-gray-300">{t.calc.savedHours}</span>
                <span className="text-xl font-bold tabular-nums text-white whitespace-nowrap">{savedHoursMonthly}h</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-gray-300">{t.calc.savedStaffCost}</span>
                <span className="text-xl font-bold tabular-nums text-white whitespace-nowrap">
                  {staffCostMonthly.toLocaleString('pl-PL')} zł
                </span>
              </div>
              <div className="rounded-lg bg-cyan-400/10 px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-cyan-200">
                    {t.calc.totalPotential}
                  </span>
                  <span className="text-2xl font-bold tabular-nums text-cyan-200 whitespace-nowrap">
                    {totalMonthly.toLocaleString('pl-PL')} zł
                  </span>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-400">
                <span>{t.calc.staffHint}</span>
                <span>{t.calc.visitHint}</span>
              </div>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="rounded-2xl border border-white/15 bg-[#0d1a2e] p-6">
            {!showResult ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    {t.calc.diagnosisTitle}
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
                      {t.calc.question} {step + 1}
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
                    {t.calc.resultEyebrow}
                  </span>
                </div>
                <h3 className="mt-4 text-2xl font-bold text-white">
                  {diagnosisLevel.title}
                </h3>
                <p className="mt-3 text-sm text-gray-300">
                  {diagnosisLevel.desc} {t.calc.resultBase}{' '}
                  <span className="font-semibold text-cyan-200">{savedHoursMonthly}{t.calc.hoursMonthly}</span>{' '}
                  {t.calc.and}{' '}
                  <span className="font-semibold text-cyan-200">{totalMonthly.toLocaleString('pl-PL')} {t.calc.plnMonthly}</span>
                </p>

                <div className="mt-6 space-y-3">
                  {diagnosisLevel.recs.map((goal) => (
                    <div key={goal} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 flex-shrink-0 text-cyan-400" strokeWidth={1.5} />
                      <span className="text-sm text-gray-200">{goal}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-8">
                  <a
                    href="#book"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-8 py-4 text-lg font-bold text-black shadow-xl shadow-cyan-500/40 transition hover:bg-cyan-400"
                  >
                    {t.calc.bookCta}
                    <ArrowRight className="h-5 w-5" />
                  </a>
                  <p className="mt-3 text-xs text-gray-400">{t.calc.noCommit}</p>
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
// [Removed: SystemDiagram]
// ---------------------------------------------------------------------------
function _SystemDiagram_REMOVED() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visibleSteps, setVisibleSteps] = useState(0);

  const steps = t.system.steps;

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
  }, [t]);

  return (
    <section id="system" ref={sectionRef} className="bg-[#f7f7f5] px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-600">
          {t.system.eyebrow}
        </p>
        <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
          {t.system.title}
        </h2>

        <div className="relative mt-14">
          {/* Horizontal progress line behind icons (desktop) */}
          <div className="absolute left-0 right-0 top-8 hidden h-0.5 bg-gray-200 md:block">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-1000 ease-out"
              style={{ width: `${(visibleSteps / steps.length) * 100}%` }}
            />
          </div>


          <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-4">
            {steps.map((step, i) => (
              <div key={step.title} className="relative flex flex-1 flex-col items-center pl-0 text-center md:items-center">
                <div
                  className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#f7f7f5] transition-all duration-500 ${
                    visibleSteps > i
                      ? 'bg-cyan-500 scale-100'
                      : 'bg-white border-gray-200 scale-90'
                  }`}
                >
                  <StepIcon index={i} visible={visibleSteps > i} />
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
                <p className="mt-1.5 text-xs text-gray-300">{t.system.sms}</p>
              </div>
              <div className="rounded-xl border border-green-400/30 bg-green-400/10 p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-green-400" strokeWidth={1.5} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-green-400">✓</span>
                </div>
                <p className="mt-1.5 text-xs text-gray-300">{t.system.confirmed}</p>
              </div>
              <div className="rounded-xl border border-sky-400/30 bg-sky-400/10 p-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-sky-400" strokeWidth={1.5} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">📅</span>
                </div>
                <p className="mt-1.5 text-xs text-gray-300">{t.system.calendar}</p>
              </div>
            </div>
          </div>
          <div className="max-w-xs text-center sm:text-left">
            <p className="text-sm font-semibold text-gray-900">{t.system.autoTitle}</p>
            <p className="mt-2 text-sm text-gray-600">{t.system.autoText}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function _StepIcon_REMOVED({ index, visible }: { index: number; visible: boolean }) {
  const icons = [Phone, Calendar, Bell, Database];
  const Icon = icons[index];
  return (
    <Icon
      className={`h-7 w-7 transition-colors duration-500 ${visible ? 'text-white' : 'text-gray-400'}`}
      strokeWidth={1.5}
    />
  );
}

// ---------------------------------------------------------------------------
// Before / After Comparison — realistic calendar mockups
// ---------------------------------------------------------------------------
function BeforeAfter() {
  const { t } = useI18n();
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

  const beforeSlots = t.beforeAfter.beforeSlots.map((label, i) => ({
    time: ['09:00', '09:30', '10:00', '10:30', '11:00'][i],
    label,
  }));
  const afterSlots = t.beforeAfter.afterSlots.map((label, i) => ({
    time: ['09:00', '09:30', '10:00', '10:30', '11:00'][i],
    label,
  }));

  return (
    <section ref={sectionRef} className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
          {t.beforeAfter.eyebrow}
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          {t.beforeAfter.title}
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
                {t.beforeAfter.beforeLabel}
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
                <span className="text-xs text-red-400/60">{t.beforeAfter.noshow}</span>
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
                {t.beforeAfter.afterLabel}
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
                <span className="text-xs text-cyan-300/70">{t.beforeAfter.noshow}</span>
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
  const { t } = useI18n();
  const icons = [Wrench, Rocket, ShieldCheck];
  return (
    <section className="bg-[#0d1a2e] px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
          {t.implementation.eyebrow}
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          {t.implementation.title}
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {t.implementation.phases.map((phase, i) => {
            const Icon = icons[i];
            return (
              <div
                key={phase.title}
                className="rounded-xl border border-white/10 bg-[#0d1a2e] p-6 transition hover:border-cyan-400/30"
              >
                <Icon className="h-6 w-6 text-cyan-400" strokeWidth={1.5} />
                <h3 className="mt-4 text-base font-semibold text-white">
                  {phase.title}
                </h3>
                <p className="mt-2 text-sm text-gray-300">{phase.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// [Removed: Testimonials]
// ---------------------------------------------------------------------------
function _Testimonials_REMOVED() {
  const { t } = useI18n();
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
          {t.testimonials.eyebrow}
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          {t.testimonials.title}
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {t.testimonials.reviews.map((review) => (
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
// [Removed: FounderNote]
// ---------------------------------------------------------------------------
function _FounderNote_REMOVED() {
  const { t } = useI18n();
  return (
    <section className="bg-[#f7f7f5] px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-gray-200 bg-white p-10 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-600">
            {t.founder.eyebrow}
          </p>
          <p className="mt-6 text-lg leading-relaxed text-gray-700">
            {t.founder.quote}
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600/10 text-sm font-bold text-cyan-700">
              P
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{t.founder.name}</p>
              <p className="text-xs text-gray-500">{t.founder.role}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Mini CTA — compact booking prompt
// ---------------------------------------------------------------------------
function MiniCta() {
  const { t } = useI18n();
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-50 ring-1 ring-cyan-100">
            <Stethoscope className="h-8 w-8 text-cyan-600" strokeWidth={1.5} />
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600">
            {t.miniCta.eyebrow}
          </p>
          <h3 className="mx-auto mt-4 max-w-2xl text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
            {t.miniCta.title}
          </h3>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-500">
            {t.miniCta.subtitle}
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
          {[
            { icon: Clock, value: '15 min', label: t.miniCta.feature1 },
            { icon: ShieldCheck, value: t.miniCta.feature2Value, label: t.miniCta.feature2 },
            { icon: Video, value: t.miniCta.feature3Value, label: t.miniCta.feature3 },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 text-center"
            >
              <item.icon className="mx-auto h-7 w-7 text-cyan-600" strokeWidth={1.5} />
              <p className="mt-3 text-lg font-bold text-slate-900">{item.value}</p>
              <p className="mt-1 text-sm text-slate-500">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#book"
            className="group inline-flex items-center gap-3 rounded-xl bg-cyan-600 px-10 py-4 text-base font-bold text-white shadow-lg shadow-cyan-600/20 transition hover:bg-cyan-700"
          >
            {t.miniCta.cta}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>
          <p className="mt-4 text-sm text-slate-400">{t.miniCta.noCommit}</p>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Audit CTA + Booking
// ---------------------------------------------------------------------------
function AuditCta() {
  const { t } = useI18n();
  return (
    <section id="kontakt" className="relative overflow-hidden bg-[#0d1a2e] px-6 py-32">
      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="text-5xl font-bold text-white sm:text-6xl">
          {t.audit.title}
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-xl text-gray-300">
          {t.audit.desc}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3">
          <div className="flex items-center gap-2 text-base text-gray-300">
            <Clock className="h-5 w-5 text-cyan-400" strokeWidth={1.5} />
            <span>15 min</span>
          </div>
          <div className="flex items-center gap-2 text-base text-gray-300">
            <Video className="h-5 w-5 text-cyan-400" strokeWidth={1.5} />
            <span>Online</span>
          </div>
          <div className="flex items-center gap-2 text-base text-gray-300">
            <ShieldCheck className="h-5 w-5 text-cyan-400" strokeWidth={1.5} />
            <span>Bez zobowiązań</span>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-xl rounded-2xl border border-white/10 bg-[#0a1628]/60 p-8 text-left backdrop-blur-sm sm:p-10">
          <LeadForm source="audit-cta" variant="booking" />
        </div>
        <p className="mt-5 text-base text-gray-400">{t.audit.noCommit}</p>

        <p className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
          <Mail className="h-4 w-4" />
          kontakt@fullschedule.pl
        </p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------
function FAQ() {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400">
          {t.faq.eyebrow}
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          {t.faq.title}
        </h2>
        <div className="mt-10 space-y-3">
          {t.faq.items.map((faq, i) => (
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
// Footer
// ---------------------------------------------------------------------------
function Footer() {
  const { t } = useI18n();
  return (
    <footer className="px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <img
          src="/logo-fullschedule.svg"
          alt="FullSchedule"
          className="h-9 w-auto"
        />
        <p className="text-xs text-gray-600">
          {t.footer}
        </p>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
function AppContent() {
  return (
    <div id="top" className="min-h-screen bg-[#0a1628] text-white antialiased">
      <Nav />
      <Hero />
      <Reveal>
        <Calculator />
      </Reveal>
      <Reveal>
        <MiniCta />
      </Reveal>
      <Reveal>
        <Implementation />
      </Reveal>
      <Reveal>
        <BeforeAfter />
      </Reveal>
      <Reveal>
        <AboutSection />
      </Reveal>
      <Reveal>
        <FAQ />
      </Reveal>
      <Reveal>
        <AuditCta />
      </Reveal>
      <Footer />

      <StickyMobileCta />
      <ExitIntentPopup />
    </div>
  );
}

function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}

export default App;
