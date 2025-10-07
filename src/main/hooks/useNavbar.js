'use client'

import { createContext, useContext, useState } from 'react'

const NavbarContext = createContext()

export function NavbarProvider({ children }) {
  const [showNavbar, setShowNavbar] = useState(true)

  return (
    <NavbarContext.Provider value={{ showNavbar, setShowNavbar }}>
      {children}
    </NavbarContext.Provider>
  )
}

export function useNavbar() {
  const context = useContext(NavbarContext)
  if (!context) {
    throw new Error('useNavbar must be used within a NavbarProvider')
  }
  return context
}
