import { Inter } from 'next/font/google'
import AuthProvider from '@/main/hooks/useAuth'
import ToastContainer from '@/main/components/toast/ToastContainer'
import { NavbarProvider } from '@/main/hooks/useNavbar'
import { NavbarLayout } from '@/main/components/navbar/NavbarLayout'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
})

export const metadata = {
  title: 'ZepToGPT - Premium AI Prompts Marketplace | Buy, Sell & Execute Prompts Instantly',
  description: 'Discover and execute premium AI prompts in zepto seconds. Buy curated prompts for marketing, coding, writing, and more. Monetize your prompt engineering skills by selling to thousands of users.',
  keywords: 'AI prompts, GPT prompts, prompt marketplace, buy prompts, sell prompts, AI marketplace, prompt engineering, ChatGPT prompts, Claude prompts',
  openGraph: {
    title: 'ZepToGPT - Premium AI Prompts Marketplace',
    description: 'Buy, sell, and execute AI prompts instantly. Get results in zepto seconds.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <AuthProvider>
          <NavbarProvider>
            <NavbarLayout>{children}</NavbarLayout>
            <ToastContainer />
          </NavbarProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
