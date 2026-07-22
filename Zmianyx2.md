# Plan Wdrożenia: Zmianyx2

## 1. Cel i zakres zmian
Ten dokument zawiera plan wdrożenia poprawek UI/UX dla strony, dostosowując ją do branży medycznej (kliniki dentystyczne) oraz poprawiając układ elementów i UX. Zgodnie z prośbą, na tym etapie nie wprowadzono żadnych zmian w kodzie.

## 2. Planowane Zmiany (Checklista)

- [ ] **1. Poprawa sekcji Hero (Wysokość)**
  - Ustawienie wysokości sekcji hero na pełną wysokość ekranu (np. `min-h-screen` lub `h-screen`), aby po otwarciu strony dół kolejnej sekcji nie był widoczny.
- [ ] **2. Dostosowanie telefonu i powiadomień oraz marginesu górnego sekcji Hero**
  - Przerobienie designu telefonu i powiadomień ("Sms wysłany", "Potwierdzono A. Kowalska 9:00"), aby przypominały natywny interfejs iPhone'a (Apple iOS style).
  - Obniżenie zawartości górnej sekcji hero (zwiększenie `padding-top` lub marginesu), aby górny pasek nawigacji nie zasłaniał telefonu ani tekstów.
- [ ] **3. Wprowadzenie "medycznego" designu**
  - Zmiana palety kolorów na kojarzące się z medycyną i stomatologią (np. czyste biele, odcienie niebieskiego, turkusu lub mięty).
  - Wymiana/dostosowanie zdjęć pod kątem branży dentystycznej.
- [ ] **4. Skrócenie tekstu wezwania do działania (CTA)**
  - Zmiana długiego tekstu: *"Zamów bezpłatną 15-minutową symulację grafiku dla Twojego gabinetu."* na krótszą, bardziej zwięzłą wersję (np. *"Zamów darmową symulację grafiku"* lub *"Bezpłatna symulacja dla Twojego gabinetu"*).
- [ ] **5. Redesign sekcji "O nas"**
  - Całkowita przebudowa układu sekcji "O nas", aby wyglądała bardziej profesjonalnie i wzbudzała zaufanie u właścicieli klinik.
- [ ] **6. Wyróżnienie sekcji "Jak to wygląda w praktyce"**
  - Zmiana designu sekcji, aby bardziej przyciągała wzrok (np. poprzez dodanie wyraźnego tła, ikon kroków, czytelnej osi czasu), **bez użycia** nadmiernych lub krzykliwych animacji. Zachowanie profesjonalnego tonu.
- [ ] **7. Optymalizacja wyskakującego powiadomienia (Popup)**
  - Zmiana logiki wyświetlania popupu "Pobierz za darmo":
    - Opóźnienie wyświetlenia do 25 sekund.
    - Ograniczenie wyświetlania do jednego razu na sesję/użytkownika (np. przy użyciu `localStorage` lub `sessionStorage`).

## 3. Pytania Otwarte / Do decyzji
- Czy masz preferencje co do konkretnych odcieni niebieskiego/turkusu (np. ciemniejszy granat dla zaufania czy jasny błękit dla czystości)?
- Na jaki konkretnie tekst chcesz zamienić CTA z punktu 4? Czy moja propozycja *"Zamów darmową symulację grafiku"* Ci odpowiada?

---
*Zgodnie z prośbą, utworzono jedynie ten plan. Gdy go zaakceptujesz i będziesz gotowy, daj znać, a rozpocznę wdrażanie kodu punkt po punkcie.*
