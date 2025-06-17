'use client'

import { useEffect, useState } from 'react'
// Update the import path if your supabase.ts is in a different directory, e.g.:
import { supabase } from '../../lib/supabase'

export default function DashboardHome() {
  const [user, setUser] = useState(null)
  const [walletBalance, setWalletBalance] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        fetchWalletBalance(user.id)
      }
    }

    const fetchWalletBalance = async (userId) => {
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

    getUser()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome back 👋</h1>

      {user && (
        <div className="text-lg">
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}

      <div className="bg-gray-100 p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">Wallet Balance</h2>
        {walletBalance !== null ? (
          <p className="text-2xl font-bold text-green-600">${walletBalance.toFixed(2)}</p>
        ) : (
          <p>Loading balance...</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-md">
        <a href="/dashboard/deposit" className="bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-6 rounded-lg shadow">
          💰 Deposit
        </a>
        <a href="/dashboard/withdraw" className="bg-red-600 hover:bg-red-700 text-white text-center py-3 px-6 rounded-lg shadow">
          📤 Withdraw
        </a>
        <a href="/dashboard/plans" className="bg-purple-600 hover:bg-purple-700 text-white text-center py-3 px-6 rounded-lg shadow col-span-2">
          📊 View Investment Plans
        </a>
      </div>
    </div>
  )
}