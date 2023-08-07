"use client";

import './globals.css'
import { Inter } from 'next/font/google'
import { AuthContextProvider } from '@/app/context/AuthContext'


export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <body>
      <AuthContextProvider>
        {children}
      </AuthContextProvider>
    </body>
    </html>
  )
}
