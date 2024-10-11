'use client'

import { type ReactNode } from 'react'
import { useStaffStore } from "../store/staffStore"
import Login from "./Login"

interface ClientWrapperProps {
  children: ReactNode
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const { currentStaff } = useStaffStore()

  if (!currentStaff) {
    return <Login />
  }

  return <>{children}</>
}