'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data.user) {
        router.push('/login')
      } else {
        setUser(data.user)
      }
    })
  }, [router])

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Checking login...</div>
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 shadow-md p-4 space-y-4">
        <h2 className="text-xl font-bold mb-6">🚀 Dashboard</h2>
        <nav className="flex flex-col space-y-3">
          <a href="/dashboard" className="hover:text-blue-600">🏠 Home</a>
          <a href="/dashboard/deposit" className="hover:text-blue-600">💰 Deposit</a>
          <a href="/dashboard/withdraw" className="hover:text-blue-600">📤 Withdraw</a>
          <a href="/dashboard/plans" className="hover:text-blue-600">📊 Investment Plans</a>
          <a href="/dashboard/wallets" className="hover:text-blue-600">👛 Wallet</a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-white">{children}</main>
    </div>
  )
}