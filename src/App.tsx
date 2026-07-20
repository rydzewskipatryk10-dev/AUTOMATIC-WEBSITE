import {
  useState,
  useEffect,
  useRef,
} from 'react';
import {
  ArrowRight,
  Calendar,
  Clock,
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
} from 'lucide-react';

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
          className="rounded-full bg-teal-400 px-5 py-2 text-sm font-semibold text-black transition hover:bg-teal-300"
        >
          Umów rozmowę
        </a>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------
function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-32">
      {/* Subtle radial glow */}
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #2dd4bf 0%, transparent 70%)' }}
      />
      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
            Wypełnij kalendarz.
            <br />
            Odzyskaj czas i dochody.
          </h1>
          <p className="mt-6 text-lg text-gray-400">
            Stały napływ pacjentów przy minimalnym zaangażowaniu zespołu.
            Automatyzujemy stomatologię, odzyskując Twój czas i pieniądze.
          </p>
          <a
            href="#diagnoza"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-teal-400 px-7 py-3.5 text-base font-semibold text-black transition hover:bg-teal-300"
          >
            Sprawdź potencjał swoich zysków
            <ArrowRight className="h-4 w-4" />
          </a>
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
const WORKING_WEEKS = 48; // tygodnie robocze w roku

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
  const recoveredRevenueAnnual = recoveredRevenuePLN * WORKING_WEEKS;
  const savedHoursWeekly = staff * HOURS_SAVED_PER_STAFF;
  const savedCostWeekly = savedHoursWeekly * HOURLY_COST;
  const savedCostAnnual = savedCostWeekly * WORKING_WEEKS;
  const totalAnnual = recoveredRevenueAnnual + savedCostAnnual;

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
                  {recoveredRevenuePLN.toLocaleString('pl-PL')} zł
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Oszczędność na recepcji / tydzień</span>
                <span className="text-xl font-bold text-white">
                  {savedCostWeekly.toLocaleString('pl-PL')} zł
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Odzyskany czas / tydzień</span>
                <span className="text-xl font-bold text-white">{savedHoursWeekly}h</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-teal-400/10 px-4 py-3">
                <span className="text-sm font-medium text-teal-300">
                  Potencjał roczny (łącznie)
                </span>
                <span className="text-2xl font-bold text-teal-300">
                  {totalAnnual.toLocaleString('pl-PL')} zł
                </span>
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
                  <span className="font-semibold text-teal-300"> {totalAnnual.toLocaleString('pl-PL')} zł rocznie</span> —
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
                  <a
                    href="#book"
                    className="inline-flex items-center gap-2 rounded-full bg-teal-400 px-7 py-3.5 text-base font-semibold text-black transition hover:bg-teal-300"
                  >
                    Umów rozmowę
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <p className="mt-3 text-xs text-gray-500">30 min, bez zobowiązań</p>
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
// Why Automation in Dentistry
// ---------------------------------------------------------------------------
function WhyAutomation() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">
          Dlaczego automatyzacja w stomatologii?
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          Systemy odzyskujące twoje dochody
        </h2>
        <div className="mt-8 space-y-6 text-lg leading-relaxed text-gray-300">
          <p>
            Projektujemy systemy dla klinik dentystycznych, które automatycznie
            zapełniają Twój grafik i usuwają puste fotele, eliminując potrzebę
            ręcznej obsługi recepcji.
          </p>
        </div>
        <p className="mt-6 text-base text-gray-500">
          Od zapełniania grafiku po samoobsługową rezerwację — bez zatrudniania dodatkowych osób.
        </p>

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
              className="rounded-xl border border-white/5 bg-[#111111] p-6 transition hover:border-white/10"
            >
              <goal.icon className="h-6 w-6 text-teal-400" strokeWidth={1.5} />
              <h3 className="mt-4 text-base font-semibold text-white">
                {goal.title}
              </h3>
              <p className="mt-2 text-sm text-gray-400">{goal.text}</p>
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
// Before / After Comparison
// ---------------------------------------------------------------------------
function BeforeAfter() {
  const [position, setPosition] = useState(50);

  const beforeItems = [
    'Ręczne potwierdzanie wizyt telefonicznie',
    'Papierowe grafiki i notatki',
    'Przepełnona skrzynka mailowa',
    'Puste sloty po odwołaniach',
  ];
  const afterItems = [
    'Automatyczne przypomnienia SMS i e-mail',
    'Cyfrowy kalendarz zsynchronizowany 24/7',
    'Samoobsługowa rezerwacja pacjenta',
    'Inteligentne obsadzanie wolnych slotów',
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

        {/* Slider visual */}
        <div className="relative mt-12 h-64 overflow-hidden rounded-2xl border border-white/5 sm:h-80">
          {/* Before (left) */}
          <div className="absolute inset-0 flex items-center justify-center bg-[#1a0f0f]">
            <div className="px-6 text-center">
              <XCircle className="mx-auto h-8 w-8 text-red-400/60" strokeWidth={1.5} />
              <p className="mt-3 text-sm font-medium text-red-300/80">
                Chaos w papierowych grafikach
              </p>
            </div>
          </div>
          {/* After (right) — clipped by slider position */}
          <div
            className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[#0a1a18]"
            style={{ clipPath: `inset(0 0 0 ${position}%)` }}
          >
            <div className="px-6 text-center">
              <CheckCircle className="mx-auto h-8 w-8 text-teal-400" strokeWidth={1.5} />
              <p className="mt-3 text-sm font-medium text-teal-300">
                Czysty, zautomatyzowany kalendarz
              </p>
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
          <div className="rounded-xl border border-red-400/10 bg-[#1a0f0f]/40 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-red-400/70">
              Przed
            </h3>
            <ul className="mt-4 space-y-3">
              {beforeItems.map((item) => (
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
              {afterItems.map((item) => (
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
// Founder Note
// ---------------------------------------------------------------------------
function FounderNote() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-white/5 bg-[#111111] p-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">
            Notatka założyciela
          </p>
          <p className="mt-6 text-lg leading-relaxed text-gray-300">
            "Kliniki dentystyczne tracą dochody nie przez brak pacjentów, ale
            przez procesy, których nikt nie audytuje. Stworzyliśmy PracticeFlow,
            żeby to zmienić — z systemem, który sam wypełnia grafik i odzyskuje
            Twój czas."
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-400/10 text-sm font-bold text-teal-300">
              PF
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Założyciel, PracticeFlow</p>
              <p className="text-xs text-gray-500">Inżynier systemów automatyzacji</p>
            </div>
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
    <section id="book" className="bg-[#111111] px-6 py-32">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-4xl font-bold text-white sm:text-5xl">
          Porozmawiajmy o Twoim grafiku.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-gray-400">
          Krótka rozmowa o tym, gdzie Twój gabinet traci czas i dochody — i jak
          możemy to zautomatyzować. Bez zobowiązań.
        </p>
        <a
          href="mailto:kontakt@practiceflow.pl"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-teal-400 px-8 py-4 text-base font-semibold text-black transition hover:bg-teal-300"
        >
          Umów rozmowę
          <ArrowRight className="h-4 w-4" />
        </a>
        <p className="mt-3 text-sm text-gray-500">30 min, bez zobowiązań</p>
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
      <Calculator />
      <WhyAutomation />
      <SystemDiagram />
      <BeforeAfter />
      <FounderNote />
      <AuditCta />
      <Footer />
    </div>
  );
}

export default App;
