# Development

## Install requirements
```
npm install
(sudo) npm install -g gulp
```

## Do initial build
`node build.js`

## Run server
`gulp`


# Spesifikasjoner
Dette er kopiert fra Geir Arne Hjelle(@gahjelle) på facebookgruppen (http://on.fb.me/1vSzZ6A):

Vi er mye løsere organisert enn CodeClub UK og ønsker mindre sentralstyring av oppgavene enn de har, slik at våre krav til et slikt byggeverktøy er litt annerledes enn de har i UK. Jeg har mailet litt med Andy Lulham som vedlikeholder den engelske originalen, og han er veldig interessert i eventuell utvikling vi gjør, slik at vi vil i utgangspunktet forsøke å beholde vårt og deres byggeskript som en code base.

Her er noen av mine tanker rundt kravspek til dette byggeskriptet, kom gjerne med flere innspill:

Aller først, byggeskriptet skal gjøre to ganske forskjellige ting (tror det muligens likevel gir mening at det er ett skript?): Konvertere MarkDown til forskjellige output-formater (ihvertfall HTML og PDF, muligens noe doc-kompatibelt i tillegg?) og lage et statisk nettsted hvor hvem-som-helst kan hente ut disse oppgavene.

Litt mer konkrete requirements:
- Kunne konvertere MarkDown til stylet HTML
- Kunne konvertere MarkDown til stylet PDF, muligens via HTML
- MarkDown'en kan inneholde Scratch-kode som rendres som scratch-klosser
- (Kanskje) kunne konvertere MarkDown til et format som kan leses av Word. Dette vil gjøre det enkelt for lærere å legge sine personlige vrier på oppgavene (men vi vil neppe ha noe system for enkelt å ta disse variasjonene tilbake til github etc)
- Legge på forskjellige headers og footers, for eksempel vil vi ha en litt annen footertekst på oppgaver vi har oversatt enn oppgaver vi lager selv.
- Kan rendre en oppgave av gangen, viktig for at vi effektivt kan rendre oppgaver mens brukerne skriver dem i et webgrensesnitt (uten at oppgavene går den litt tunge veien via github)
- Tagging av oppgaver med ting som vanskelighetsgrad, læringsmål som dekkes, opprinnelse osv.
- Nettside med oversikt over alle oppgaver (innen et tema / programmeringsspråk) med mulig sortering / filtrering på taggene
- Mulighet for å lage "spillelister" med oppgavene. Disse vil kunne representere anbefalte kurs med flere oppgaver.
- Bygging av en enkelt oppgave i et webgrensesnitt (slik Håkon Kaurel har laget en prototyp på)
- Automatisk bygging / oppdatering av nettsiden når nye oppgaver legges inn i github
- Støtte oppgaver i flere deler. For eksempel har vi noen Scratchoppgaver som er lagt opp til å kjøres over flere sesjoner.
- Støtte flere språk: I utgangspunktet er det meste av oppgavene våre på norsk, men det vil nok også kunne bli aktuelt med noen oppgaver / oversettelser på engelsk.
- Mulighet til å koble inn materiell fra andre nettsteder, f.eks. kodegenet. Dette kan sikkert veldig enkelt løses ved å legge til en oppgave i github som bare lenker / videresender til det eksterne nettstedet?

... og muligens noen andre småting ...

Dette virker muligens litt voldsomt, men vi er ikke veldig langt unna på de fleste punktene.

Håkon (@kwrl) har allerede gjort en kjempeinnsats for å bringe oss nærmere målet, og jeg håper å ha litt tid til å bidra en del i ukene fram mot jul også. Om dere andre har ideer så si ifra!
