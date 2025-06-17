'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export default function UsersPage() {
  const [wallets, setWallets] = useState<any[]>([])

  useEffect(() => {
    const fetchWallets = async () => {
      const { data, error } = await supabase
        .from('user_wallet_balances')
        .select('id, user_id, balance_usd')
      if (data) setWallets(data)
    }
    fetchWallets()
  }, [])

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Wallet Balances</h2>
      <table className="min-w-full border">
        <thead><tr><th>User ID</th><th>Balance (USD)</th></tr></thead>
        <tbody>
          {wallets.map(w => (
            <tr key={w.id} className="border-t">
              <td>{w.user_id}</td>
              <td>${w.balance_usd.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}