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

`out/` innehåller den statiska webbplatsen. Publicera den hos en värd som stödjer rena URL:er med motsvarande HTML-filer, exempelvis `/utbildning` → `/utbildning.html`. `npm start` används inte för denna statiska export.

## Innehåll

- `app/page.tsx`: startsidan.
- `app/[slug]/page.tsx`: Utbildning, Böcker, Kurser, Kunskapsbank, Om Minaret och Kontakt.
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
