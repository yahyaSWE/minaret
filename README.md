# Minaret Folkbildning

Förhandsversion byggd med Next.js 16, React och TypeScript. Svenskt innehåll, responsiv design och grafisk profil baserad på den tillhandahållna loggan.

## Starta utveckling

```sh
npm install
npm run dev
```

## Bygg webbplatsen

```sh
npm run build
```

Webbplatsen körs som en vanlig Next.js-app, exempelvis på Vercel. `npm start` startar produktionsbygget. Statisk export (`out/`) används inte längre eftersom bokkatalogen hämtas vid besök.

## Bokkatalog från Payload

- Sätt `CMS_URL=https://ljudbok-cms.vercel.app` i driftmiljön, eller kopiera `.env.example` till `.env.local` lokalt. Ingen API-nyckel eller admininloggning ska användas.
- CMS:et måste först deployas med `GET /api/catalog/books` från Förlaget-repot.
- `/bocker` visar 24 publicerade böcker per sida. `/bocker/[id]` visar en enskild bok med beskrivning, författare, omslag, kategorier och format.
- Publicera böcker i Payloads befintliga Böcker-collection. Alla publicerade böcker visas på hemsidan. Utkast visas inte.
- Hämtning sker på servern, med 60 sekunders cache och uppdatering vid efterföljande besök. Det är ingen exakt publiceringsgaranti på 60 sekunder: första besöket efter cachetidens slut kan få föregående version medan cachen uppdateras.
- CMS-fel visas som ett tillfälligt fel med möjlighet att försöka igen. En tom katalog visas som kommande utgivning.
- Vid Vercel-deploy: välj Next.js och ta bort eventuell Output Directory-inställning som pekar på `out`. Standardutdata är `.next`.
- Deployordning: CMS först, därefter hemsidan. Verifiera publicerad bok, utkast, omslag och boksida i produktion.

## Innehåll

- `app/page.tsx`: startsidan.
- `app/[slug]/page.tsx`: Utbildning, Kurser, Kunskapsbank, Om Minaret och Kontakt.
- `app/bocker/`: offentlig bokkatalog och boksidor.
- `lib/catalog.ts`: serverhämtning från Payload.
- `app/navigation.tsx`: sidhuvud, mobilmeny och sidfot.
- `app/globals.css`: färgprofil, typografi och responsiv layout.
- `public/minaret-logo.jpeg`: användarens logga.

## Inför publicering

- Komplettera bekräftad kontaktadress på kontaktsidan. Ingen e-postadress har antagits och inget formulär skickar data.
- Granska webbtexter, grundarpresentation och vilka utbildningar som kan erbjudas.
- Lägg in faktiska böcker, kurser och granskade artiklar när de är redo. Nuvarande sidor anger tydligt att innehåll utvecklas.
- Välj huvuddomän och lägg till canonical-adresser och sitemap när domänen är fastställd.
- Google Fonts laddas externt med lokala reservtypsnitt. Typsnitten kan självhostas inför lansering.

Webbshop, betalningar, inloggning och kursplattform ingår inte i denna etapp. Webbplatsen har inte publicerats externt.
