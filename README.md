[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/arve0/codeclub_lesson_builder)

# codeclub_lesson_builder
This project builds codeclub exercises from markdown to styled webpages. A file watcher builds upon changes and refreshes the browser. Watching is done through [gulp](//gulpjs.com) and build are done with [metalsmith](//metalsmith.io).

Here is a screenshot with exmaple of workflow:
![](assets/img/workflow.png)

# Development
You will need [node](//nodejs.org) and [git](//help.github.com/articles/set-up-git/) for using this software.

*codeclub_lesson_builder* should be cloned into a lesson project where markdown lessons are in a `src` folder. This simplifies setup for contributors, as *codeclub_lesson_builder* can be included as a git submodule and cloned recursively. Cloning lesson repo for contributors (instead of this repo with lessons as submodule) will make pull request to the lesson repo a bit less complex. The steps below assumes this setup, and are only needed upon first time inclusion in the lesson repo. Steps for setting up lesson repo with local building should be similar to this.

**Clone repository**
```
git clone https://github.com/arve0/codeclub_lesson_builder
```

**Installing requirements**
```
cd codeclub_lesson_builder
npm install
cp utils/gulp utils/gulp.bat ..
cd ..
```

**Run server *nix**
```
./gulp
```

**Run server windows**
```
gulp.bat TODO: verify
```

## Note Ubuntu users!
nodejs is not installed as *node*, and this causes problems for some packages. To fix this, link *node* to *nodejs* like so **BEFORE** installing packages through npm:
```
sudo ln -s /usr/bin/nodejs /usr/local/bin/node
```

## Note - Maximum number of open files
Gulp and metalsmith read files in parallel, which might cause trouble for some users. In such case, one will get an *EMFILE* error code. Quickest solution is to increase number of allowed open files:

- [Linux](http://unix.stackexchange.com/questions/85457/how-to-circumvent-too-many-open-files-in-debian#answers)
- [Mac](http://superuser.com/questions/302754/increase-the-maximum-number-of-open-file-descriptors-in-snow-leopard#answers)
- Windows: no known solution at given time.


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
- [x] Legge på forskjellige headers og footers, for eksempel vil vi ha en litt annen footertekst på oppgaver vi har oversatt enn oppgaver vi lager selv.
- [x] Kan rendre en oppgave av gangen, viktig for at vi effektivt kan rendre oppgaver mens brukerne skriver dem i et webgrensesnitt (uten at oppgavene går den litt tunge veien via github)
- [ ] Tagging av oppgaver med ting som vanskelighetsgrad, læringsmål som dekkes, opprinnelse osv.
- [ ] Nettside med oversikt over alle oppgaver (innen et tema / programmeringsspråk) med mulig sortering / filtrering på taggene
- [x] Mulighet for å lage "spillelister" med oppgavene. Disse vil kunne representere anbefalte kurs med flere oppgaver.
- [ ] Bygging av en enkelt oppgave i et webgrensesnitt (slik Håkon Kaurel har laget en prototyp på)
- [ ] Automatisk bygging / oppdatering av nettsiden når nye oppgaver legges inn i github
- [x] Støtte oppgaver i flere deler. For eksempel har vi noen Scratchoppgaver som er lagt opp til å kjøres over flere sesjoner.
- [ ] Støtte flere språk: I utgangspunktet er det meste av oppgavene våre på norsk, men det vil nok også kunne bli aktuelt med noen oppgaver / oversettelser på engelsk.
- [ ] Mulighet til å koble inn materiell fra andre nettsteder, f.eks. kodegenet. Dette kan sikkert veldig enkelt løses ved å legge til en oppgave i github som bare lenker / videresender til det eksterne nettstedet?

... og muligens noen andre småting ...

Dette virker muligens litt voldsomt, men vi er ikke veldig langt unna på de fleste punktene.

[Håkon](https://github.com/kwrl) har allerede gjort en kjempeinnsats for å bringe oss nærmere målet, og jeg håper å ha litt tid til å bidra en del i ukene fram mot jul også. Om dere andre har ideer så si ifra!
