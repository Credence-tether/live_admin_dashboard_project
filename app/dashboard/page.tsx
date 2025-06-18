'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/lib/supabase'
export default function DashboardHome() {
  const [user, setUser] = useState<any>(null)
  const [walletBalance, setWalletBalance] = useState<number | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        fetchWalletBalance(user.id)
      }
    }

    getUser()
  }, [])

  const fetchWalletBalance = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_wallet_balances')
      .select('balance')
      .eq('user_id', userId)
      .single()

    if (!error && data) {
      setWalletBalance(data.balance)
    } else {
      setWalletBalance(0)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
      <p className="mt-2">Wallet Balance: ${walletBalance ?? 'Loading...'}</p>
    </div>
  )
}