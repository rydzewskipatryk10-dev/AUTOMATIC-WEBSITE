import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

export type Lang = 'pl' | 'en';

type Dict = typeof translations.pl;

const translations = {
  pl: {
    nav: {
      calc: 'Kalkulator',
      about: 'O nas',
      contact: 'Kontakt',
      book: 'Umów rozmowę',
    },
    langLabel: 'EN',
    hero: {
      title: 'Pełny grafik. Zero pustych foteli.',
      subtitle: 'Koniec z odwołanymi wizytami i chaosem w recepcji. Wdrożymy inteligentną automatyzację i AI skrojoną pod Twoją klinikę stomatologiczną, która zapełni grafik 24/7.',
      cta: 'Sprawdź, ile możesz odzyskać',
      yourClinic: 'Twoja klinika',
      calendarLabel: 'Kalendarz — 9:00–18:00',
      booked: 'Obsadzone',
      noshow: 'No-shows',
      saved: 'Odzyskany czas',
      notify1Title: '',
      notify1Desc: '',
      notify2Title: '',
      notify2Desc: '',
    },
    heroCarousel: {
      slides: [
        {
          type: 'calendar',
          header: 'Kalendarz — 9:00–18:00',
          items: [
            { time: '09:00', label: 'A. Kowalska', status: 'booked' },
            { time: '10:30', label: 'M. Nowak', status: 'booked' },
            { time: '11:00', label: 'Wolne → zajęte', status: 'filled' },
            { time: '12:30', label: 'J. Wiśniewski', status: 'booked' },
            { time: '14:30', label: 'K. Lewandowska', status: 'booked' },
            { time: '15:00', label: 'Rezerwacja online', status: 'filled' },
            { time: '16:30', label: 'P. Zieliński', status: 'booked' },
            { time: '17:00', label: 'Wolne → zajęte', status: 'filled' },
          ],
        },
        {
          type: 'features',
          header: 'Co wprowadzamy',
          items: [
            { icon: 'Calendar', label: 'Samoobsługowa rezerwacja 24/7', desc: 'Pacjenci rezerwują termin na fotelu bez dzwonienia do recepcji.' },
            { icon: 'Bell', label: 'Automatyczne przypomnienia SMS', desc: 'Z opcją szybkiego potwierdzenia lub odwołania wizyty.' },
            { icon: 'Database', label: 'Integracja z kalendarzem', desc: 'Pełna synchronizacja z systemem Twojego gabinetu.' },
            { icon: 'Sparkles', label: 'Inteligentne wypełnianie slotów', desc: 'Zwolnione godziny wypełniają się same oczekującymi.' },
            { icon: 'Clock', label: 'Lista rezerwowa z auto-powiadomieniem', desc: 'Wiadomość o wolnym terminie idzie automatycznie.' },
            { icon: 'Rocket', label: 'Wdrożenie w 14 dni', desc: 'Bez angażowania Twojego personelu.' },
          ],
        },
        {
          type: 'system',
          header: 'Pełny system',
          title: 'Od połączenia do obsadzonego grafiku',
          subtitle: 'Wszystko działa automatycznie — bez Twojej uwagi.',
          nodes: [
            { icon: 'Phone', label: 'Połączenie' },
            { icon: 'Calendar', label: 'Rezerwacja' },
            { icon: 'Bell', label: 'Przypomnienia' },
            { icon: 'Database', label: 'Synchronizacja' },
            { icon: 'Mail', label: 'E-mail' },
            { icon: 'Users', label: 'Lista oczekujących' },
          ],
          footer: '94% obsadzonych slotów · 2% no-shows · 14h odzyskanego czasu / tyg.',
        },
      ],
    },
    socialProof: {
      label: 'Zaufały nam gabinety stomatologiczne w całej Polsce',
    },
    calc: {
      eyebrow: 'Diagnoza Twojego gabinetu',
      title: 'Zobacz, ile czasu i dochodu odzyska Twój gabinet.',
      calculatorTitle: 'Kalkulator automatyzacji',
      calculatorDesc: 'Szacunkowy potencjał odzyskanych dochodów i oszczędności.',
      cancellations: 'Odwołane wizyty miesięcznie',
      staff: 'Osoby w recepcji',
      recoveredRevenue: 'Odzyskane dochody z wizyt / miesiąc',
      savedHours: 'Odzyskany czas / miesiąc',
      savedStaffCost: 'Zaoszczędzone koszty pracy / miesiąc',
      totalPotential: 'Potencjał miesięczny (łącznie)',
      staffHint: 'Osoba w recepcji — 40h, 37 zł/h',
      visitHint: 'Odwołana wizyta — 500 zł',
      diagnosisTitle: 'Diagnoza stanu automatyzacji',
      question: 'Pytanie',
      resultEyebrow: 'Wynik diagnozy',
      resultBase: 'Na podstawie Twoich odpowiedzi i kalkulatora, możesz odzyskać do',
      hoursMonthly: 'h miesięcznie',
      and: 'i',
      plnMonthly: 'zł miesięcznie.',
      bookCta: 'Umów rozmowę',
      noCommit: '15 min, bez zobowiązań',
      q1: 'Ile wizyt miesięcznie jest odwoływanych w Twoim gabinecie?',
      q2: 'Ile średnio "pustych slotów" w grafiku pojawia się w Twoim gabinecie w ciągu miesiąca?',
      q3: 'Jaki procent nowych pacjentów rezygnuje z wizyty przez trudności z zapisem?',
      opt: {
        c0: '0–5 wizyt',
        c1: '6–15 wizyt',
        c2: '16–25 wizyt',
        c3: 'Powyżej 25',
        e1: 'Poniżej 5',
        e2: '5–10',
        e3: 'Powyżej 10',
        d1: 'Nie wiem',
        d2: 'Poniżej 20%',
        d3: 'Powyżej 20%',
      },
      level: {
        high: {
          title: 'Twój gabinet traci znaczną część dochodu.',
          desc: 'Wysoki odsetek odwołań i pustych slotów wskazuje na wyraźną potrzebę automatyzacji recepcji.',
          recs: [
            'Eliminacja pustych slotów w kalendarzu',
            'Pełna automatyzacja przypomnień o wizytach',
            'Samoobsługowa rezerwacja 24/7',
            'Automatyczne przepunktowywanie odwołanych wizyt',
          ],
        },
        mid: {
          title: 'Twój gabinet ma wyraźny potencjał automatyzacji.',
          desc: 'Część wizyt jest odwoływana, a grafik nie jest w pełni obsadzony — to można zautomatyzować.',
          recs: [
            'Eliminacja pustych slotów w kalendarzu',
            'Pełna automatyzacja przypomnień o wizytach',
            'Samoobsługowa rezerwacja 24/7',
          ],
        },
        low: {
          title: 'Twój gabinet działa sprawnie, ale można więcej.',
          desc: 'Automatyzacja pomoże utrzymać obecny poziom i zapobiec problemom w przyszłości.',
          recs: [
            'Pełna automatyzacja przypomnień o wizytach',
            'Samoobsługowa rezerwacja 24/7',
          ],
        },
      },
    },
    system: {
      eyebrow: 'Jak działa system',
      title: 'Od połączenia do obsadzonego grafiku.',
      steps: [
        { title: 'Obsługa pacjenta', text: 'Automatyczne odbieranie połączeń i odpowiedzi na pytania.' },
        { title: 'Rezerwacja wizyty', text: 'Samoobsługowy kalendarz dostępny 24/7.' },
        { title: 'Przypomnienia', text: 'SMS i e-mail redukujące no-shows.' },
        { title: 'Grafik kliniki', text: 'Pełna synchronizacja z systemem gabinetu.' },
      ],
      sms: 'Przypominamy o wizycie jutro 9:00. Odpowiedz TAK.',
      confirmed: 'Pacjent potwierdził wizytę automatycznie.',
      calendar: 'Slot 9:00 obsadzony — 24/7.',
      autoTitle: 'Wszystko dzieje się automatycznie',
      autoText: 'Pacjent dostaje SMS, potwierdza jedną odpowiedzią, a system aktualizuje grafik — bez telefonu od recepcji.',
    },
    miniCta: {
      eyebrow: 'Bezpłatna konsultacja',
      title: 'Odkryj, ile Twój gabinet traci co tydzień.',
      subtitle: 'Krótka rozmowa, podczas której przeanalizujemy Twój grafik i wskażemy konkretne obszary do automatyzacji.',
      cta: 'Umów bezpłatny audyt',
      noCommit: '15 min, bez zobowiązań',
      feature1: 'rozmowy',
      feature2: 'Bez zobowiązań',
      feature2Value: '0 zł',
      feature3: 'Rozmowa online',
      feature3Value: 'Online',
    },
    implementation: {
      eyebrow: 'Jak to wygląda w praktyce',
      title: 'Od audytu do działającego systemu w tydzień.',
      phases: [
        { title: 'Dzień 1–2: Audyt', text: 'Analizujemy Twój obecny grafik, identyfikujemy luki i straty dochodów.' },
        { title: 'Dzień 3–5: Konfiguracja', text: 'Integrujemy system z Twoim kalendarzem, SMS i e-mail. Zero zmian w sprzęcie.' },
        { title: 'Tydzień 1: Działający system', text: 'Przypomnienia, samoobsługowa rezerwacja i auto-obsadzanie działają na żywo.' },
      ],
    },
    beforeAfter: {
      eyebrow: 'Przed / Po',
      title: 'Chaos administracyjny vs. czysty, zautomatyzowany kalendarz.',
      beforeLabel: 'Przed — chaos w grafiku',
      afterLabel: 'Po — zautomatyzowany kalendarz',
      beforeSlots: [
        '??? — brak potwierdzenia',
        'Odwołano — pusty slot',
        'Telefon — pacjent nie odbiera',
        'Notatka na kartce',
        'Puste — brak rezerwacji',
      ],
      afterSlots: [
        'A. Kowalska — potwierdzony SMS',
        'Auto-obsadzone: M. Nowak',
        'Rezerwacja online — potwierdzona',
        'J. Wiśniewski — przypomnienie wysłane',
        'K. Lewandowska — zapis 24/7',
      ],
      noshow: 'No-shows',
    },
    caseStudy: {
      eyebrow: 'Case study',
      title: 'Gabinet Stomatologiczny „Uśmiech"',
      desc: '3 fotele, 6 higienistek, 4 dentystów. Wdrożenie: 14 dni.',
      before: 'Przed wdrożeniem',
      after: 'Po wdrożeniu',
      noshowLabel: 'wskaźnik no-shows',
      timeLabel: 'czas recepcji na telefon i przypomnienia',
      lostLabel: 'stracone zyski / miesiąc (puste sloty)',
      recoveredLabel: 'odzyskane zyski / miesiąc',
      roi: 'Zwrot z inwestycji już w pierwszym miesiącu — 3,2x więcej niż kosztuje',
      quote: '„Przestaliśmy gonić pacjentów telefonem. Teraz to oni rezerwują sami, a my skupiamy się na leczeniu."',
      author: '— Anna K., właścicielka gabinetu „Uśmiech"',
    },
    comparison: {
      eyebrow: 'Porównanie',
      title: 'Dlaczego FullSchedule?',
      pf: 'FullSchedule',
      manual: 'Ręczna obsługa',
      other: 'Typowy system',
      features: [
        'Rezerwacja online 24/7',
        'Automatyczne przypomnienia SMS',
        'Samoobsługowa zmiana terminu',
        'Inteligentne wypełnianie pustych slotów',
        'Lista oczekujących z auto-powiadomieniem',
        'Mniej niż 15 min obsługi / tyg.',
        'Wdrożenie w 14 dni',
      ],
      partial: 'Częściowo',
      manual2: 'Ręcznie',
    },
    testimonials: {
      eyebrow: 'Opinie gabinetów',
      title: 'Co mówią nasi klienci.',
      reviews: [
        {
          quote: 'Od wdrożenia FullSchedule no-shows spadły z 12% do 3%. Recepcja odzyskała kilkanaście godzin tygodniowo.',
          author: 'dr n. med. Anna Kowalczyk',
          role: 'Właścicielka, WhiteSmile Clinic',
          result: 'No-shows: 12% → 3%',
        },
        {
          quote: 'Puste sloty po odwołaniach wypełniają się same. Widzę różnicę w przychodach już po pierwszym miesiącu.',
          author: 'lek. dent. Piotr Zieliński',
          role: 'Dyrektor, OrthoLine',
          result: '+38% przychodów / m-c',
        },
      ],
    },
    founder: {
      eyebrow: 'Notatka założyciela',
      quote: '„Kliniki dentystyczne tracą dochody nie przez brak pacjentów, ale przez procesy, których nikt nie audytuje. Stworzyliśmy FullSchedule, żeby to zmienić — z systemem, który sam wypełnia grafik i odzyskuje Twój czas."',
      name: 'Patryk',
      role: 'Założyciel, FullSchedule',
    },
    about: {
      eyebrow: 'O nas',
      title: 'Pełna kontrola nad grafikiem Twojej kliniki.',
      body: 'FullSchedule powstał z myślą o właścicielach klinik stomatologicznych, którzy chcą pracować przewidywalnie i bez strat. Automatyzacja pozwala nam zmniejszać odwołania, puste godziny i chaos w grafiku nawet o 30–50%.',
      stat1: 'mniej odwołań i pustych godzin',
      stat2: 'samodzielna rezerwacja pacjentów',
      stat3: 'bezpłatny audyt grafiku',
    },
    audit: {
      title: 'Zamów darmową symulację grafiku.',
      desc: 'Krótka rozmowa o tym, gdzie Twój gabinet traci czas, dochody i jak możemy to rozwiązać. Bez zobowiązań.',
      stats: [
        { value: '15 min', label: 'rozmowy' },
        { value: '40h', label: 'odzyskane / m-c' },
        { value: '1 tydzień', label: 'do wdrożenia' },
      ],
      cta: 'Umów audyt grafiku',
      download: 'Pobierz darmowy raport',
      noCommit: '15 min, bez zobowiązań',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Najczęstsze pytania.',
      items: [
        { q: 'Czy muszę zmieniać obecny system rejestracji?', a: 'Nie. FullSchedule integruje się z większością popularnych systemów dla gabinetów stomatologicznych. Konfiguracja trwa 1–2 dni i nie wymaga wymiany sprzętu.' },
        { q: 'Ile trwa wdrożenie?', a: 'Od audytu do działającego systemu mija zwykle tydzień. Pierwsze przypomnienia i samoobsługowa rezerwacja są aktywne już w pierwszych dniach.' },
        { q: 'Czy pacjenci muszą instalować aplikację?', a: 'Nie. Pacjenci korzystają z przypomnień SMS/e-mail oraz linku do rezerwacji online — bez żadnej aplikacji do pobrania.' },
        { q: 'Co jeśli mam pytania po wdrożeniu?', a: 'Oferujemy wsparcie po wdrożeniu. Możesz skontaktować się z nami w każdej chwili — odpowiadamy zwykle tego samego dnia.' },
      ],
    },
    footer: '© 2025 FullSchedule. Automatyzacja dla gabinetów stomatologicznych.',
    exitPopup: {
      eyebrow: 'Zanim odejdziesz',
      title: 'Odbierz Feedback',
      desc: 'Jak twój gabinet traci na ręcznej obsłudze?',
      decline: 'Nie, dziękuję',
      download: 'Pobierz za darmo',
    },
    form: {
      name: 'Imię i nazwisko',
      namePh: 'Imię i nazwisko',
      phone: 'Telefon',
      phonePh: 'Numer telefonu',
      email: 'E-mail',
      emailPh: 'twój@email.pl',
      submit: 'Wyślij',
      bookCta: 'Zamów bezpłatną konsultację',
      bookedSuccess: 'Dziękujemy! Skontaktujemy się z Tobą, aby umówić termin konsultacji.',
      sending: 'Wysyłanie…',
      success: 'Dziękujemy! Skontaktujemy się z Tobą wkrótce.',
      error: 'Coś poszło nie tak. Spróbuj ponownie.',
      invalidEmail: 'Podaj poprawny adres e-mail.',
      required: 'To pole jest wymagane.',
    },
    sticky: 'Umów rozmowę',
  },
  en: {
    nav: {
      calc: 'Calculator',
      about: 'About',
      contact: 'Contact',
      book: 'Book a call',
    },
    langLabel: 'PL',
    hero: {
      title: 'Full schedule. Zero empty chairs.',
      subtitle: 'No more cancelled visits and front-desk chaos. We will implement smart automation and AI tailored for your dental clinic, filling your schedule 24/7.',
      cta: 'See how much you can recover',
      yourClinic: 'Your clinic',
      calendarLabel: 'Schedule — 9:00–18:00',
      booked: 'Booked',
      noshow: 'No-shows',
      saved: 'Time saved',
      notify1Title: '',
      notify1Desc: '',
      notify2Title: '',
      notify2Desc: '',
    },
    heroCarousel: {
      slides: [
        {
          type: 'calendar',
          header: 'Schedule — 9:00–18:00',
          items: [
            { time: '09:00', label: 'A. Kowalska', status: 'booked' },
            { time: '10:30', label: 'M. Nowak', status: 'booked' },
            { time: '11:00', label: 'Empty → filled', status: 'filled' },
            { time: '12:30', label: 'J. Wiśniewski', status: 'booked' },
            { time: '14:30', label: 'K. Lewandowska', status: 'booked' },
            { time: '15:00', label: 'Online booking', status: 'filled' },
            { time: '16:30', label: 'P. Zieliński', status: 'booked' },
            { time: '17:00', label: 'Empty → filled', status: 'filled' },
          ],
        },
        {
          type: 'features',
          header: 'What we deliver',
          items: [
            { icon: 'Calendar', label: 'Self-service booking 24/7', desc: 'Patients book a chair without calling the front desk.' },
            { icon: 'Bell', label: 'Automated SMS reminders', desc: 'With quick confirm or cancel options.' },
            { icon: 'Database', label: 'Calendar integration', desc: 'Fully synced with your clinic scheduling software.' },
            { icon: 'Sparkles', label: 'Smart slot filling', desc: 'Empty hours are automatically offered to the waitlist.' },
            { icon: 'Clock', label: 'Waitlist with auto-notify', desc: 'Alerts are sent out automatically for empty slots.' },
            { icon: 'Rocket', label: 'Deployment in 14 days', desc: 'Without disrupting your staff.' },
          ],
        },
        {
          type: 'system',
          header: 'Full system',
          title: 'From a call to a fully booked schedule',
          subtitle: 'Everything runs automatically — without your attention.',
          nodes: [
            { icon: 'Phone', label: 'Call' },
            { icon: 'Calendar', label: 'Booking' },
            { icon: 'Bell', label: 'Reminders' },
            { icon: 'Database', label: 'Sync' },
            { icon: 'Mail', label: 'Email' },
            { icon: 'Users', label: 'Waiting list' },
          ],
          footer: '94% filled slots · 2% no-shows · 14h recovered time / week',
        },
      ],
    },
    socialProof: {
      label: 'Trusted by dental clinics across Poland',
    },
    calc: {
      eyebrow: 'Your clinic diagnosis',
      title: 'See how much time and revenue your clinic can recover.',
      calculatorTitle: 'Automation calculator',
      calculatorDesc: 'Estimated recovered revenue and savings.',
      cancellations: 'Cancelled visits per month',
      staff: 'Front-desk staff',
      recoveredRevenue: 'Recovered visit revenue / month',
      savedHours: 'Recovered time / month',
      savedStaffCost: 'Saved staff costs / month',
      totalPotential: 'Monthly potential (total)',
      staffHint: 'Front-desk staff — 40h, 37 zł/h',
      visitHint: 'Cancelled visit — 500 zł',
      diagnosisTitle: 'Automation diagnosis',
      question: 'Question',
      resultEyebrow: 'Diagnosis result',
      resultBase: 'Based on your answers and the calculator, you can recover up to',
      hoursMonthly: 'h per month',
      and: 'and',
      plnMonthly: 'zł per month.',
      bookCta: 'Book a call',
      noCommit: '15 min, no commitment',
      q1: 'How many visits are cancelled in your clinic per month?',
      q2: 'How many "empty slots" appear in your schedule on average per month?',
      q3: 'What percentage of new patients give up booking due to difficulty scheduling?',
      opt: {
        c0: '0–5 visits',
        c1: '6–15 visits',
        c2: '16–25 visits',
        c3: 'Over 25',
        e1: 'Under 5',
        e2: '5–10',
        e3: 'Over 10',
        d1: "I don't know",
        d2: 'Under 20%',
        d3: 'Over 20%',
      },
      level: {
        high: {
          title: 'Your clinic is losing a significant share of revenue.',
          desc: 'A high rate of cancellations and empty slots indicates a clear need for front-desk automation.',
          recs: [
            'Eliminate empty schedule slots',
            'Full automation of visit reminders',
            'Self-service booking 24/7',
            'Automatic rebooking of cancelled visits',
          ],
        },
        mid: {
          title: 'Your clinic has clear automation potential.',
          desc: 'Some visits are cancelled and the schedule isn\'t fully booked — this can be automated.',
          recs: [
            'Eliminate empty schedule slots',
            'Full automation of visit reminders',
            'Self-service booking 24/7',
          ],
        },
        low: {
          title: 'Your clinic runs smoothly, but there\'s more to gain.',
          desc: 'Automation helps maintain your current level and prevents future problems.',
          recs: [
            'Full automation of visit reminders',
            'Self-service booking 24/7',
          ],
        },
      },
    },
    system: {
      eyebrow: 'How the system works',
      title: 'From a call to a fully booked schedule.',
      steps: [
        { title: 'Patient handling', text: 'Automatic call answering and question responses.' },
        { title: 'Visit booking', text: 'Self-service calendar available 24/7.' },
        { title: 'Reminders', text: 'SMS and email reducing no-shows.' },
        { title: 'Clinic schedule', text: 'Full synchronization with your clinic system.' },
      ],
      sms: 'Reminder: appointment tomorrow at 9:00. Reply YES.',
      confirmed: 'Patient confirmed the appointment automatically.',
      calendar: '9:00 slot filled — 24/7.',
      autoTitle: 'Everything happens automatically',
      autoText: 'The patient gets an SMS, confirms with one reply, and the system updates the schedule — no front-desk call needed.',
    },
    miniCta: {
      eyebrow: 'Free consultation',
      title: 'Discover how much your clinic loses every week.',
      subtitle: 'A short call where we analyze your schedule and identify specific areas to automate.',
      cta: 'Book a free audit',
      noCommit: '15 min, no commitment',
      feature1: 'call',
      feature2: 'No commitment',
      feature2Value: 'Free',
      feature3: 'Online call',
      feature3Value: 'Online',
    },
    implementation: {
      eyebrow: 'How it works in practice',
      title: 'From audit to a working system in one week.',
      phases: [
        { title: 'Day 1–2: Audit', text: 'We analyze your current schedule, identify gaps and revenue losses.' },
        { title: 'Day 3–5: Setup', text: 'We integrate the system with your calendar, SMS and email. No hardware changes.' },
        { title: 'Week 1: Working system', text: 'Reminders, self-service booking and auto-filling are live.' },
      ],
    },
    beforeAfter: {
      eyebrow: 'Before / After',
      title: 'Administrative chaos vs. a clean, automated schedule.',
      beforeLabel: 'Before — schedule chaos',
      afterLabel: 'After — automated schedule',
      beforeSlots: [
        '??? — no confirmation',
        'Cancelled — empty slot',
        'Phone — patient not answering',
        'Note on paper',
        'Empty — no booking',
      ],
      afterSlots: [
        'A. Kowalska — confirmed via SMS',
        'Auto-filled: M. Nowak',
        'Online booking — confirmed',
        'J. Wiśniewski — reminder sent',
        'K. Lewandowska — booked 24/7',
      ],
      noshow: 'No-shows',
    },
    caseStudy: {
      eyebrow: 'Case study',
      title: 'Dental Clinic "Uśmiech"',
      desc: '3 chairs, 6 hygienists, 4 dentists. Deployment: 14 days.',
      before: 'Before deployment',
      after: 'After deployment',
      noshowLabel: 'no-show rate',
      timeLabel: 'front-desk time on phone and reminders',
      lostLabel: 'lost revenue / month (empty slots)',
      recoveredLabel: 'recovered revenue / month',
      roi: 'Payback in the first month — 3.2x more value than it costs',
      quote: '"We stopped chasing patients by phone. Now they book themselves, and we focus on treatment."',
      author: '— Anna K., owner of "Uśmiech" clinic',
    },
    comparison: {
      eyebrow: 'Comparison',
      title: 'Why FullSchedule?',
      pf: 'FullSchedule',
      manual: 'Manual handling',
      other: 'Typical system',
      features: [
        '24/7 online booking',
        'Automatic SMS reminders',
        'Self-service rescheduling',
        'Smart empty-slot filling',
        'Waiting list with auto-notification',
        'Less than 15 min handling / week',
        'Deployment in 14 days',
      ],
      partial: 'Partial',
      manual2: 'Manual',
    },
    testimonials: {
      eyebrow: 'Clinic reviews',
      title: 'What our clients say.',
      reviews: [
        {
          quote: 'Since deploying FullSchedule, no-shows dropped from 12% to 3%. The front desk recovered dozens of hours weekly.',
          author: 'dr n. med. Anna Kowalczyk',
          role: 'Owner, WhiteSmile Clinic',
          result: 'No-shows: 12% → 3%',
        },
        {
          quote: 'Empty slots after cancellations fill themselves. I see the revenue difference after the first month.',
          author: 'lek. dent. Piotr Zieliński',
          role: 'Director, OrthoLine',
          result: '+38% revenue / month',
        },
      ],
    },
    founder: {
      eyebrow: 'Founder note',
      quote: '"Dental clinics lose revenue not from a lack of patients, but from processes nobody audits. We built FullSchedule to change that — with a system that fills your schedule and recovers your time."',
      name: 'Patryk',
      role: 'Founder, FullSchedule',
    },
    about: {
      eyebrow: 'About us',
      title: 'Full control over your clinic schedule.',
      body: 'FullSchedule was created for owners of dental clinics who want to work predictably and without losses. Automation lets us reduce cancellations, empty hours, and schedule chaos by up to 30–50%.',
      stat1: 'fewer cancellations and empty hours',
      stat2: 'self-service patient booking',
      stat3: 'free schedule audit',
    },
    audit: {
      title: 'Zamów darmową symulację grafiku.',
      desc: 'A short call about where your clinic is losing time and revenue, and how we can solve it. No strings attached.',
      stats: [
        { value: '15 min', label: 'call' },
        { value: '40h', label: 'saved / month' },
        { value: '1 week', label: 'to deploy' },
      ],
      cta: 'Book a schedule audit',
      download: 'Download free report',
      noCommit: '15 min, no commitment',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Frequently asked questions.',
      items: [
        { q: 'Do I need to change my current booking system?', a: 'No. FullSchedule integrates with most popular systems for dental clinics. Setup takes 1–2 days and requires no hardware changes.' },
        { q: 'How long does deployment take?', a: 'From audit to a working system usually takes a week. The first reminders and self-service booking are active within the first few days.' },
        { q: 'Do patients need to install an app?', a: 'No. Patients use SMS/email reminders and an online booking link — no app to download.' },
        { q: 'What if I have questions after deployment?', a: 'We offer post-deployment support. You can contact us anytime — we usually reply the same day.' },
      ],
    },
    footer: '© 2025 FullSchedule. Automation for dental clinics.',
    exitPopup: {
      eyebrow: 'Before you go',
      title: 'Get Feedback',
      desc: 'How your clinic loses money on manual handling.',
      decline: 'No, thanks',
      download: 'Download for free',
    },
    form: {
      name: 'Name',
      namePh: 'Name',
      phone: 'Phone',
      phonePh: 'Phone number',
      email: 'Email',
      emailPh: 'your@email.com',
      submit: 'Send',
      bookCta: 'Book a free consultation',
      bookedSuccess: 'Thank you! We\'ll contact you to schedule your consultation.',
      sending: 'Sending…',
      success: 'Thank you! We\'ll contact you soon.',
      error: 'Something went wrong. Please try again.',
      invalidEmail: 'Please enter a valid email address.',
      required: 'This field is required.',
    },
    sticky: 'Book a call',
  },
} as const;

type I18nContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'pl';
    const stored = window.localStorage.getItem('pf-lang') as Lang | null;
    if (stored === 'pl' || stored === 'en') return stored;
    return window.navigator.language.startsWith('en') ? 'en' : 'pl';
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== 'undefined') window.localStorage.setItem('pf-lang', l);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
