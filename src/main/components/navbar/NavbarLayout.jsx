'use client'

import { useIsMobile } from '@/main/hooks/useMobile'
import { useNavbar } from '@/main/hooks/useNavbar'
import { DesktopNavbar } from './DesktopNavbar.jsx'
import { MobileNavbar } from './MobileNavbar.jsx'

export function NavbarLayout({ children }) {
  const { showNavbar } = useNavbar()
  
  if (!showNavbar) {
    return <main>{children}</main>
  }
  
  return (
    <>
      <div className="hidden md:block">
        <DesktopNavbar />
      </div>
      
      <div className="block md:hidden">
        <MobileNavbar />
      </div>
      
      <div className="hidden md:block h-16" />
      <main>{children}</main>
      <div className="md:hidden h-16" />
    </>
  )
}
