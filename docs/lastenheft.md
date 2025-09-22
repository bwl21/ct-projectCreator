# Lastenheft und Pflichtenheft ChurchTools-Erweiterung zur Projektorganisation

---

## Lastenheft

### 1. Zielsetzung  
Ziel ist die Entwicklung einer Erweiterung (Extension) für ChurchTools, welche die strukturierte Organisation von Projekten innerhalb der Plattform unterstützt. Die Erweiterung soll vorhandene ChurchTools-Funktionen (Gruppen, Wiki, Kalender, Events, Dienste) zielgerichtet verbinden und erweitern, um Projekte mit mehreren Arbeitsbereichen und Teams übersichtlich und effizient zu verwalten.

### 2. Anwendungsbereich  
Die Erweiterung richtet sich an Gemeinden und Organisationen, die komplexe Projekte mit vielen beteiligten Personen und verschiedenen Aufgabenbereichen planen und durchführen. Sie soll Projektleitern und Teams helfen, Kommunikation, Terminplanung, Dokumentation und Dienstplanung zu koordinieren.

### 3. Funktionale Anforderungen

#### 3.1 Projektanlage und -verwaltung  
- Möglichkeit zur Anlage neuer Projekte mit eindeutigen Projektnamen  
- Definition von Projektbeschreibung (intern und extern)  
- Einteilung in Arbeitsbereiche / Teams (z.B. Leitung, Programm, Catering, Logistik) mit Zuordnung von Mitgliedern  

#### 3.2 Gruppenmanagement  
- Automatisches Anlegen und Verknüpfen folgender Gruppen:  
  - Projektgruppe (PG) mit allen Projektmitgliedern  
  - Kommunikationsgruppe (CG) für Projektgespräche  
  - Teams und ggf. Unterteams für Arbeitsbereiche  
- Verwaltung der Gruppenmitgliedschaften und Zugriffsrechte  

#### 3.3 Wiki-Integration  
- Projekt-Wiki mit Hauptseite und verschachtelten Unterseiten zur Dokumentation  
- Rechteverwaltung für Leser und Bearbeiter aus Projektgruppen  
- Links zwischen Wiki und zugehörigen Gruppen/Teams  

#### 3.4 Kalender- und Eventmanagement  
- Gruppenkalender für projektbezogene Termine  
- Möglichkeit, Events einzustellen (z.B. Besprechungen, Deadlines)  
- Verknüpfung der Dienste mit Kalender und Events  

#### 3.5 Kommunikation  
- Beitragssystem für offizielle Ankündigungen im Projekt  
- Chatfunktion für informellen Austausch im Projekt und Teams  
- Benachrichtigungen über neue Beiträge und Events  

#### 3.6 Dienstplanung  
- Kategorisierung von Diensten nach Projekten und Arbeitsbereichen  
- Übersichtliche Anzeige von Diensten in Zusammenhang mit Kalenderterminen  

### 4. Nicht-funktionale Anforderungen

- Einfache und intuitive Benutzeroberfläche  
- Kompatibilität mit aktuellen ChurchTools-Versionen  
- Skalierbarkeit für kleine und große Projekte  
- Einhaltung von Datenschutz und rollenbasierten Zugriffen  
- Gute Performance auch bei vielen Nutzern und Daten  

### 5. Abgrenzungen  

- Keine eigenständige Benutzerverwaltung, Nutzung nur der bestehenden ChurchTools-Benutzer und Gruppen  
- Keine autonome Kalender- oder Dienstverwaltungssoftware, sondern Integration und Erweiterung bestehender Module  

### 6. Rechtliche und organisatorische Vorgaben  

- Einhaltung der DSGVO für personenbezogene Daten  
- Dokumentation und Support durch ChurchTools-Standardkanäle  

### 7. Zielgruppen  

- Projektleiter und Mitarbeiter in Gemeinden  
- Ehrenamtliche Koordinatoren für Veranstaltungen und Programme  

### 8. Erfolgskriterien  

- Schnelle und einfache Konfiguration von Projekten  
- Transparente und übersichtliche Darstellung aller projektbezogenen Informationen  
- Reduzierung des manuellen Verwaltungsaufwands bei Projekten  
- Hohe Nutzerzufriedenheit und Akzeptanz  

### 9. Erweiterbarkeit und Schrittweise Einrichtung

- Die Projektstruktur soll flexibel erweiterbar sein, Arbeitsbereiche können jederzeit hinzugefügt werden.  
- Gruppen, Kalender, Wikis werden bei Bedarf angelegt, nicht zwingend bei Projektstart.  
- Nach Projekterfassung wird eine ToDo-Liste mit Einrichtungsschritten generiert, die per Button ausgeführt werden können, um Strukturen anzulegen.  
- Nutzer können so modular und bedarfsgerecht die Projektstruktur aufbauen und anpassen.  

---

## Pflichtenheft

### 1. Übersicht der Benutzeroberflächen

#### 1.1 Projektübersicht  
- Anzeige aller Projekte als Liste oder Kacheln  
- Such- und Filterfunktionen (z.B. nach Name, Status, Team)  
- Projekt anlegen / bearbeiten / archivieren Buttons  

#### 1.2 Projekt-Detailseite  
- Anzeige von Projektinformationen (Name, Beschreibung intern/extern, Status)  
- Tabs für  
  - Mitglieder & Teams (Gruppenmanagement)  
  - Wiki (Projekt-Wiki mit Unterseiten)  
  - Kalender & Events  
  - Dienste  
  - Kommunikation (Beiträge, Chat)  

#### 1.3 Gruppen- und Teamverwaltung  
- Übersicht aller Teams des Projekts  
- Neuanlage von Teams und Unterteams mit Namensstruktur  
- Mitgliederverwaltung und Rollenvergabe  
- Rechteverwaltung  

#### 1.4 Wiki-Bereich  
- Hauptseite mit ToC  
- Markdown-kompatibler Editor  
- Rechteverwaltung seitenweise  
- Verlinkung zu Gruppen  

#### 1.5 Kalender & Events  
- Anzeige gruppenbezogener Kalender  
- Eventanlage mit Zuordnung zu Teams/Diensten  
- Zugriffsrechte auf Termine  

#### 1.6 Diensteverwaltung  
- Übersicht und Filter  
- Dienstanlage und Mitarbeiterzuweisung  
- Verknüpfung mit Kalender und Events  

#### 1.7 Kommunikation  
- Beitragsfeed für offizielle Mitteilungen  
- Chat mit Threads pro Team oder Projekt  
- Push-/Email-Benachrichtigungen  

### 2. Funktionale Details

#### 2.1 Projektanlage  
- Formular für Projektname, Beschreibung, Status  
- Nach Projektanlage ToDo-Liste mit Einrichtungsschritten  
- Buttons zum Ausführen der einzelnen Setup-Schritte (z.B. Gruppe anlegen)  

#### 2.2 Arbeitsbereiche flexibel verwalten  
- UI-Komponente zur Arbeitsbereichsverwaltung mit Möglichkeit zur Erweiterung  
- Zuordnung Teams / Gruppen / Kalender nach Bedarf  

#### 2.3 Rechte- und Rollenmanagement  
- Rollen: Projektleiter, Teamleiter, Mitglied, Gast  
- Granulare Rechte für Gruppen, Wiki, Kalender, Dienste  

#### 2.4 Benachrichtigungen  
- Konfigurierbare Benachrichtigungen für Beiträge, Events, Chats  
- Übersicht ungelesener Benachrichtigungen  

#### 2.5 Integration  
- Anbindung an ChurchTools-Benutzerdaten und APIs  
- Synchronisation mit bestehenden Modulen  

### 3. Usability und Design  
- An ChurchTools angelehntes UI (Vue.js)  
- Responsiv für Desktop und Mobile  
- Klare, konsistente Navigation  

### 4. Technische Rahmenbedingungen  
- Kompatibel mit aktueller ChurchTools-Version  
- Modular als ChurchTools Extension
- Nutzung bestehender Authentifizierung und Berechtigungen  
- Performanceoptimiert  

---

Dieses Dokument beschreibt Anforderungen und konkrete Funktionalitäten für eine modulare, flexible Projektorganisations-Erweiterung für ChurchTools, die schrittweise Einrichtungsschritte per ToDo-Liste unterstützt.