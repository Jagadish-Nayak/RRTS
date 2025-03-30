"use client"
import { ThemeProvider } from 'next-themes'
import React from 'react'

const Theme = ({children}: {children: React.ReactNode}) => {
  return (
    <div>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
        </ThemeProvider>
    </div>
  )
}

export default Theme