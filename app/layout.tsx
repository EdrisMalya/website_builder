import type { Metadata } from 'next'
import './globals.css'

import React from 'react'
import { ThemeProvider } from '@/providers/theme.provider'
import { DM_Sans } from 'next/font/google'
import ModelProvider from '@/providers/model-provider'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnarToaster } from '@/components/ui/sonner'

const font = DM_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Malia',
    description: 'All in one Agency Solution',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={font.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange>
                    <ModelProvider>
                        {children}
                        <SonnarToaster position="bottom-left" />
                        <Toaster />
                    </ModelProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
