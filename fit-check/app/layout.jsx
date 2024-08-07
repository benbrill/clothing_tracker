// These styles apply to every route in the application
import './global.css'
 
export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}
 
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <h1>Hi</h1>
      <body>{children}</body>
    </html>
  )
}