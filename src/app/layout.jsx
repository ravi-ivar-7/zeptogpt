import { Inter } from 'next/font/google'
import AuthProvider from '@/main/hooks/useAuth'
import ToastContainer from '@/main/components/toast/ToastContainer'
import { NavbarProvider } from '@/main/hooks/useNavbar'
import { NavbarLayout } from '@/main/components/navbar/NavbarLayout'
import Footer from '@/main/components/footer/fotter'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
})

export const metadata = {
  title: 'ZepToGPT - Premium AI Workflows Marketplace | Buy, Sell & Execute Workflows Instantly',
  description: 'Discover and execute premium AI workflows in zepto seconds. Buy curated workflows for marketing, coding, writing, and more. Monetize your AI creation skills by selling to thousands of users.',
  keywords: 'AI workflows, GPT workflows, workflow marketplace, buy workflows, sell workflows, AI marketplace, AI automation, ChatGPT workflows, Claude workflows',
  openGraph: {
    title: 'ZepToGPT - Premium AI Workflows Marketplace',
    description: 'Buy, sell, and execute AI workflows instantly. Get results in zepto seconds.',
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
            <Footer />
            <ToastContainer />
          </NavbarProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
