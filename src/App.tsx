import {
  Settings,
  Heart,
  Shield,
  CheckCircle,
  XCircle,
  Map,
  Search,
  Zap,
  ArrowRight,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------
function Nav() {
  return (
    <header className="w-full border-b border-white/5">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="text-lg font-semibold tracking-tight text-white">
          PracticeFlow
        </span>
        <a
          href="#audit"
          className="rounded-full bg-teal-400 px-5 py-2 text-sm font-semibold text-black transition hover:bg-teal-300"
        >
          Request Audit
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
    <section className="px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
            Wypełnij kalendarz. Odzyskaj czas i zyski.
          </h1>
          <p className="mt-6 text-lg text-gray-400">
            Stały napływ pacjentów bez angażowania Twojego zespołu.
          </p>
          <a
            href="#audit"
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
// Perspective — Operational Focus
// ---------------------------------------------------------------------------
function Approach() {
  const items = [
    {
      icon: Settings,
      title: 'System-First Approach',
      text: 'We don\'t just add tools; we simplify your existing workflow.',
    },
    {
      icon: Heart,
      title: 'Patient-Centric Automation',
      text: 'Technology should feel invisible to the patient, but powerful for your staff.',
    },
    {
      icon: Shield,
      title: 'Compliance-Minded',
      text: 'We build with strict data security and privacy protocols at the core.',
    },
  ];

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">
          Our Approach
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-white/5 bg-[#111111] p-8 transition hover:border-white/10"
            >
              <item.icon className="h-6 w-6 text-teal-400" strokeWidth={1.5} />
              <h3 className="mt-5 text-lg font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-gray-400">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Why This Works — Operational Principles
// ---------------------------------------------------------------------------
function Principles() {
  const principles = [
    {
      title: 'Automation only works when it fits the workflow.',
      text: 'Most tools fail because they\'re layered on top of broken processes. We fix the process first.',
    },
    {
      title: 'Staff adoption is the real bottleneck.',
      text: 'A system your team won\'t use is a system that doesn\'t exist. We design for the humans, not the software.',
    },
  ];

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">
          Why This Works
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {principles.map((p) => (
            <div
              key={p.title}
              className="border-l-2 border-teal-400 bg-[#111111] p-8"
            >
              <h3 className="text-xl font-semibold text-white">{p.title}</h3>
              <p className="mt-3 text-sm text-gray-400">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// For / Not For
// ---------------------------------------------------------------------------
function ForNotFor() {
  const forYou = [
    'Established practice with 2+ front desk staff',
    'Losing time to manual scheduling, recalls, or follow-ups',
    'Ready to invest in operational infrastructure',
  ];
  const notForYou = [
    'Seeking a quick-fix or "magic button" solution',
    'Not open to reviewing existing workflows',
    'Looking for unproven experiments on your practice',
  ];

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">
          Is This For You?
        </p>
        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-white/5 bg-white/5 md:grid-cols-2">
          <div className="bg-[#111111] p-8">
            <h3 className="text-lg font-semibold text-teal-400">
              This is for you if…
            </h3>
            <ul className="mt-6 space-y-4">
              {forYou.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-teal-400" strokeWidth={1.5} />
                  <span className="text-sm text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#111111] p-8">
            <h3 className="text-lg font-semibold text-gray-500">
              This is not for you if…
            </h3>
            <ul className="mt-6 space-y-4">
              {notForYou.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-500" strokeWidth={1.5} />
                  <span className="text-sm text-gray-400">{item}</span>
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
// Process — 3 Steps
// ---------------------------------------------------------------------------
function Process() {
  const steps = [
    { icon: Map, title: 'Map your current workflows.' },
    { icon: Search, title: 'Identify operational bottlenecks.' },
    { icon: Zap, title: 'Deploy practical, automated systems.' },
  ];

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">
          How It Works
        </p>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="relative">
              {i < steps.length - 1 && (
                <div className="absolute left-0 top-6 hidden h-px w-full border-t border-dashed border-white/10 md:block" />
              )}
              <div className="relative flex items-start gap-4">
                <span className="text-2xl font-bold text-teal-400">
                  0{i + 1}
                </span>
                <step.icon className="h-6 w-6 text-white" strokeWidth={1.5} />
              </div>
              <p className="mt-4 text-lg font-medium text-white">{step.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// About
// ---------------------------------------------------------------------------
function About() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">
          Who We Are
        </p>
        <p className="mt-8 text-lg leading-relaxed text-gray-300">
          We come from dental operations, not software sales. After years
          working inside practices, we built the systems we wished existed.
          Today, we deploy those same systems for practices ready to scale.
        </p>
        <p className="mt-8 border-l-2 border-teal-400 pl-6 text-xl font-medium text-white">
          Built by operators, for operators.
        </p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Audit Offer — Core CTA
// ---------------------------------------------------------------------------
function AuditOffer() {
  return (
    <section id="audit" className="bg-[#111111] px-6 py-32">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-4xl font-bold text-white sm:text-5xl">
          Get a Free Automation Audit.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-gray-400">
          A diagnostic review of your current practice workflows — we identify
          exactly where you're losing time. No strings attached.
        </p>
        <a
          href="#book"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-teal-400 px-8 py-4 text-base font-semibold text-black transition hover:bg-teal-300"
        >
          Request Your Free Audit
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Next Steps + Calendar Embed
// ---------------------------------------------------------------------------
function NextSteps() {
  const steps = [
    { title: '15-min intro call', text: 'We learn your current setup.' },
    { title: 'We analyze your systems', text: 'Workflow review and bottleneck mapping.' },
    { title: 'You receive a clear, actionable plan', text: 'No fluff, no upsell pressure.' },
  ];

  return (
    <section id="book" className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">
          What To Expect
        </p>
        <ol className="mt-10 space-y-6">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-5">
              <span className="text-2xl font-bold text-teal-400">
                0{i + 1}
              </span>
              <div>
                <p className="text-lg font-semibold text-white">{s.title}</p>
                <p className="mt-1 text-sm text-gray-400">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-14">
          <p className="text-sm font-medium text-gray-300">
            Book your 15-min call directly below.
          </p>
          {/* Calendly / Cal.com embed container — drop embed script here */}
          <div
            className="mt-4 h-[640px] w-full rounded-xl border border-white/5"
            style={{ background: '#0a0a0a' }}
          >
            {/* Placeholder for scheduling widget */}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Closing
// ---------------------------------------------------------------------------
function Closing() {
  return (
    <section className="px-6 py-32 text-center">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-4xl font-bold text-white sm:text-5xl">
          Ready to streamline your practice?
        </h2>
        <a
          href="#book"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-teal-400 px-8 py-4 text-base font-semibold text-black transition hover:bg-teal-300"
        >
          Request Your Audit
          <ArrowRight className="h-4 w-4" />
        </a>
        <p className="mt-20 text-xs text-gray-600">
          © 2025 PracticeFlow. All rights reserved.
        </p>
      </div>
    </section>
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
      <Approach />
      <Principles />
      <ForNotFor />
      <Process />
      <About />
      <AuditOffer />
      <NextSteps />
      <Closing />
    </div>
  );
}

export default App;
