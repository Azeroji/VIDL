import './globals.css'
import { Inter } from 'next/font/google'

import Navbar from "@/components/Navbar/Navbar"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'VIDL',
  description: 'Create by UNFLEX',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className='bg-dark text-light h-[100%]'>
      <body className={inter.className}>
        <div className='overflow-auto h-[90vh]'>{children}</div>
        <Navbar/>
      </body>
    </html>
  )
}
