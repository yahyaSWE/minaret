import type { Metadata } from 'next';
import './globals.css';
import { Header, Footer } from './navigation';
export const metadata: Metadata = {title: {default:'Minaret Folkbildning — Kunskap som för oss närmare',template:'%s | Minaret Folkbildning'},description:'Kunskap och dialog om islam i en svensk kontext. Utbildningar, böcker, kurser och en öppen kunskapsbank för ömsesidig förståelse.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="sv"><body><a className="skip-link" href="#main">Hoppa till innehåll</a><Header/>{children}<Footer/></body></html>}
