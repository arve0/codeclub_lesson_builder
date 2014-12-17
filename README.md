[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/arve0/metalsmith-kodeklubben?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# metalsmith-kodeklubben
This project builds codeclub exercises from markdown to styled webpages. A file watcher builds upon changes and refreshes the browser. Watching is done through [gulp](//gulpjs.com) and build are done with [metalsmith](//metalsmith.io).

Here is a screenshot with exmaple of workflow:
![](assets/img/workflow.png)

# Development
You will need [node](//nodejs.org) and [git](//help.github.com/articles/set-up-git/) for using this software. When you have, follow instructions below.

## Clone repository
```
git clone --recursive https://github.com/arve0/metalsmith-kodeklubben
```

## Requirements

### Note Ubuntu users!
nodejs is not installed as *node*, and this causes problems for some packages. To fix this, link *node* to *nodejs* like so **BEFORE** installing packages through npm:
```
sudo ln -s /usr/bin/nodejs /usr/local/bin/node
```

### Installing requirements
```
cd metalsmith-kodeklubben
npm install
(sudo) npm install -g gulp
```

## Run server
```
gulp
```

# Specification
This is in norwegian, but will be updated to english when project have reached are more stable state. Especially, we need:
- format specification - should be very similar to [CodeClubUK format](//github.com/CodeClub/lesson_format/blob/master/FORMATTING.md)
- description of builder internal workings

## Spesifikasjoner på norsk
Dette er kopiert fra [Geir Arne Hjelle](https://github.com/gahjelle) på facebookgruppen (http://on.fb.me/1vSzZ6A):

Vi er mye løsere organisert enn CodeClub UK og ønsker mindre sentralstyring av oppgavene enn de har, slik at våre krav til et slikt byggeverktøy er litt annerledes enn de har i UK. Jeg har mailet litt med Andy Lulham som vedlikeholder den engelske originalen, og han er veldig interessert i eventuell utvikling vi gjør, slik at vi vil i utgangspunktet forsøke å beholde vårt og deres byggeskript som en code base.

Her er noen av mine tanker rundt kravspek til dette byggeskriptet, kom gjerne med flere innspill:

Aller først, byggeskriptet skal gjøre to ganske forskjellige ting (tror det muligens likevel gir mening at det er ett skript?): Konvertere MarkDown til forskjellige output-formater (ihvertfall HTML og PDF, muligens noe doc-kompatibelt i tillegg?) og lage et statisk nettsted hvor hvem-som-helst kan hente ut disse oppgavene.

Litt mer konkrete requirements:
- [x] Kunne konvertere MarkDown til stylet HTML
- [ ] Kunne konvertere MarkDown til stylet PDF, muligens via HTML
- [x] MarkDown'en kan inneholde Scratch-kode som rendres som scratch-klosser
- [ ] *Kanskje* kunne konvertere MarkDown til et format som kan leses av Word. Dette vil gjøre det enkelt for lærere å legge sine personlige vrier på oppgavene (men vi vil neppe ha noe system for enkelt å ta disse variasjonene tilbake til github etc)
- [ ] Legge på forskjellige headers og footers, for eksempel vil vi ha en litt annen footertekst på oppgaver vi har oversatt enn oppgaver vi lager selv.
- [x] Kan rendre en oppgave av gangen, viktig for at vi effektivt kan rendre oppgaver mens brukerne skriver dem i et webgrensesnitt (uten at oppgavene går den litt tunge veien via github)
- [ ] Tagging av oppgaver med ting som vanskelighetsgrad, læringsmål som dekkes, opprinnelse osv.
- [ ] Nettside med oversikt over alle oppgaver (innen et tema / programmeringsspråk) med mulig sortering / filtrering på taggene
- [ ] Mulighet for å lage "spillelister" med oppgavene. Disse vil kunne representere anbefalte kurs med flere oppgaver.
- [ ] Bygging av en enkelt oppgave i et webgrensesnitt (slik Håkon Kaurel har laget en prototyp på)
- [ ] Automatisk bygging / oppdatering av nettsiden når nye oppgaver legges inn i github
- [ ] Støtte oppgaver i flere deler. For eksempel har vi noen Scratchoppgaver som er lagt opp til å kjøres over flere sesjoner.
- [ ] Støtte flere språk: I utgangspunktet er det meste av oppgavene våre på norsk, men det vil nok også kunne bli aktuelt med noen oppgaver / oversettelser på engelsk.
- [ ] Mulighet til å koble inn materiell fra andre nettsteder, f.eks. kodegenet. Dette kan sikkert veldig enkelt løses ved å legge til en oppgave i github som bare lenker / videresender til det eksterne nettstedet?

... og muligens noen andre småting ...

Dette virker muligens litt voldsomt, men vi er ikke veldig langt unna på de fleste punktene.

[Håkon](https://github.com/kwrl) har allerede gjort en kjempeinnsats for å bringe oss nærmere målet, og jeg håper å ha litt tid til å bidra en del i ukene fram mot jul også. Om dere andre har ideer så si ifra!
