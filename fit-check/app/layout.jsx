// These styles apply to every route in the application
import '../styles/global.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { DM_Sans } from 'next/font/google'

const DMSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dmsans',
  display: 'swap',
})

 
export const metadata = {
  title: 'FitCheck',
  description: 'Track clothes',
}
 
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${DMSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}