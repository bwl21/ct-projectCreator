# Wireframes für ChurchTools Projektorganisation

## 1. Dashboard / Projektübersicht

```
┌─────────────────────────────────────────────────────────────┐
│ ChurchTools Projektorganisation                    [User] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─ Projektübersicht ──────────────────────────┐ [+ Projekt] │
│ │                                             │             │
│ │ [Suche...] [Filter: Status ▼] [Sortierung ▼] │             │
│ │                                             │             │
│ │ ┌─ Gemeindefest 2024 ──────┐ ┌─ Jugend... ─┐ │             │
│ │ │ [Aktiv]           85% ✓  │ │ [Planung] 45%│ │             │
│ │ │ 3 Teams, 12 Mitglieder  │ │ 2 Teams, 6 M.│ │             │
│ │ │ Leiter: Max Mustermann  │ │ Leiter: Anna │ │             │
│ │ │ Aktualisiert: 20.03.24  │ │ Update: 15.03│ │             │
│ │ └─────────────────────────┘ └──────────────┘ │             │
│ │                                             │             │
│ │ ┌─ Weihnachtsfeier 2023 ───┐ ┌─ [Neues...] ─┐ │             │
│ │ │ [Abgeschlossen]   100% ✓ │ │ Projekt      │ │             │
│ │ │ 1 Team, 4 Mitglieder    │ │ erstellen    │ │             │
│ │ │ Leiter: Maria Lopez     │ │              │ │             │
│ │ │ Abgeschlossen: 20.12.23 │ │              │ │             │
│ │ └─────────────────────────┘ └──────────────┘ │             │
│ └─────────────────────────────────────────────┘             │
└─────────────────────────────────────────────────────────────┘
```

## 2. Projekt-Detailansicht

```
┌─────────────────────────────────────────────────────────────┐
│ Home > Gemeindefest 2024                           [Aktionen▼]│
├─────────────────────────────────────────────────────────────┤
│ # Gemeindefest 2024                            [Aktiv] 85% ✓│
│ Großes Sommerfest der Gemeinde...                           │
│ Leiter: Max Mustermann | Erstellt: 15.01.24 | Update: 20.03│
├─────────────────────────────────────────────────────────────┤
│ [Übersicht] [Setup] [Teams] [Kalender] [Wiki] [Kommunikation]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─ Projekt-Status ──────────┐ ┌─ Schnellaktionen ─────────┐ │
│ │ ● 12 Mitglieder          │ │ [+ Team hinzufügen]       │ │
│ │ ● 3 Teams                │ │ [+ Termin erstellen]      │ │
│ │ ● 85% Setup abgeschlossen│ │ [+ Wiki bearbeiten]       │ │
│ │ ● 2 aktive Kalender      │ │ [+ Ankündigung erstellen] │ │
│ └───────────────────────────┘ └───────────────────────────┘ │
│                                                             │
│ ┌─ Setup-Fortschritt ──────────────────────────────────────┐ │
│ │ ████████████████████████████████████████████████░░░░ 85% │ │
│ │                                                         │ │
│ │ ✓ Projektgruppe angelegt                                │ │
│ │ ✓ Kalender erstellt                                     │ │
│ │ ⏳ Wiki-Struktur anlegen                                │ │
│ │ ⏳ Berechtigungen konfigurieren                         │ │
│ │                                           [Setup öffnen]│ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─ Teams ──────────────────────────────────────────────────┐ │
│ │ ┌─ Catering-Team ─┐ ┌─ Programm-Team ─┐ ┌─ Logistik ──┐ │ │
│ │ │ 4 Mitglieder    │ │ 3 Mitglieder    │ │ 2 Mitglieder│ │ │
│ │ │ Leiter: Anna S. │ │ Leiter: Sarah K.│ │ Leiter: Tom │ │ │
│ │ │ Budget: 1500€   │ │ Budget: 800€    │ │ Budget: 1200│ │ │
│ │ └─────────────────┘ └─────────────────┘ └─────────────┘ │ │
│ │                                         [Alle Teams...] │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 3. Setup-Wizard

```
┌─────────────────────────────────────────────────────────────┐
│ Gemeindefest 2024 > Setup                                   │
├─────────────────────────────────────────────────────────────┤
│ ┌─ Projekt-Einrichtung ──────────────────────┐    ┌─ 85% ─┐ │
│ │ Führen Sie die Schritte aus, um Ihr       │    │ ████░ │ │
│ │ Projekt vollständig einzurichten.         │    │ 4/5   │ │
│ └────────────────────────────────────────────┘    └───────┘ │
│                                                             │
│ ┌─ Setup-Aufgaben ───────────────────────────────────────────┐│
│ │                                                           ││
│ │ ✓ [HOCH] Projektgruppe anlegen                    [Erledigt]││
│ │   Hauptgruppe für alle Projektmitglieder erstellen       ││
│ │   ⏱ 15 Min. | Abgeschlossen: 16.01.24 von Max M.        ││
│ │                                                           ││
│ │ ✓ [MITTEL] Projekt-Kalender erstellen            [Erledigt]││
│ │   Gemeinsamen Kalender für Projekttermine anlegen        ││
│ │   ⏱ 10 Min. | Abhängig von: Projektgruppe               ││
│ │                                                           ││
│ │ ⏳ [MITTEL] Wiki-Struktur anlegen          [🔄 Automatisch]││
│ │   Projekt-Wiki mit Hauptseite und Team-Bereichen         ││
│ │   ⏱ 20 Min. | Abhängig von: Projektgruppe               ││
│ │   [Anweisungen anzeigen ▼]                               ││
│ │                                                           ││
│ │ 🔒 [NIEDRIG] Berechtigungen konfigurieren        [Warten] ││
│ │   Detaillierte Zugriffsrechte für alle Teams             ││
│ │   ⏱ 30 Min. | Abhängig von: Wiki-Struktur               ││
│ │                                                           ││
│ └───────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─ Setup-Hilfe ──────────────────────────────────────────────┐│
│ │ 📋 Nächster Schritt: Wiki-Struktur anlegen               ││
│ │ Erstellt automatisch Wiki-Seiten für alle Teams          ││
│ │                                                           ││
│ │ 💡 Tipp: Nutzen Sie die automatische Ausführung         ││
│ │ für schnellere Einrichtung.                              ││
│ └───────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## 4. Team-Management

```
┌─────────────────────────────────────────────────────────────┐
│ Gemeindefest 2024 > Teams                      [+ Team hinzufügen]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─ Catering-Team ────────────────────────────────────── [⚙]─┐│
│ │ Verpflegung, Getränke und Küchenorganisation           │ │
│ │                                                         │ │
│ │ 👤 Teamleiter: Anna Schmidt                             │ │
│ │ 👥 4 Mitglieder | 💰 Budget: 1.500€                    │ │
│ │                                                         │ │
│ │ 🔗 ChurchTools-Verknüpfungen:                          │ │
│ │    📊 Gruppe: Gemeindefest 2024 - Catering             │ │
│ │    📅 Kalender: Catering-Termine                       │ │
│ │                                                         │ │
│ │ 📋 Aufgabenbereiche:                                    │ │
│ │    [Menüplanung] [Einkauf koordinieren] [Küchenteam]   │ │
│ │    [Getränkestand] [+2 weitere]                        │ │
│ │                                                         │ │
│ │ ┌─ Mitglieder ──────────────────────────────────────────┐ │ │
│ │ │ 👤 Anna Schmidt (Leiter) - seit 15.01.24            │ │ │
│ │ │ 👤 Peter Weber (Mitglied) - seit 16.01.24           │ │ │
│ │ │ 👤 Lisa Müller (Mitglied) - seit 17.01.24           │ │ │
│ │ │ 👤 Tom Fischer (Mitglied) - seit 18.01.24           │ │ │
│ │ │                                    [Mitglieder verwalten]│ │ │
│ │ └────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─ Programm-Team ────────────────────────────────────── [⚙]─┐│
│ │ Bühnenprogramm und Aktivitäten für alle Altersgruppen  │ │
│ │ 👤 Sarah Klein | 👥 3 Mitglieder | 💰 800€             │ │
│ │ 🔗 Gruppe: Gemeindefest 2024 - Programm               │ │
│ │ 📋 [Bühnenprogramm] [Technik] [Moderation] [Kinder]    │ │
│ └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## 5. Projekt-Erstellung Dialog

```
┌─────────────────────────────────────────────────────────────┐
│                    Neues Projekt erstellen                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Projektname *                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Gemeindefest 2024                                       │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Beschreibung (intern)                                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Großes Sommerfest der Gemeinde mit Programm für alle   │ │
│ │ Altersgruppen. Geplant sind Bühnenprogramm, Catering   │ │
│ │ und verschiedene Aktivitäten.                           │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Öffentliche Beschreibung                                    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Herzliche Einladung zum Gemeindefest am 15. Juni 2024! │ │
│ │ Freuen Sie sich auf ein buntes Programm für die ganze  │ │
│ │ Familie.                                                │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Projektleiter *                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Max Mustermann                                        ▼ │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─ Automatische Einrichtung ─────────────────────────────┐ │
│ │ ☑ Projektgruppe automatisch anlegen                   │ │
│ │ ☑ Projekt-Kalender erstellen                          │ │
│ │ ☑ Wiki-Grundstruktur anlegen                          │ │
│ │ ☐ Kommunikationskanäle einrichten                     │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                             │
│                                    [Abbrechen] [Erstellen] │
└─────────────────────────────────────────────────────────────┘
```

Diese Wireframes zeigen die wichtigsten Benutzeroberflächen basierend auf dem Lastenheft.