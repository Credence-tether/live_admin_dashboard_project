'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
import { useRouter } from 'next/navigation'

type Wallet = {
  id: string
  user_id: string
  balance: number
  updated_at: string
}

export default function WalletsPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchWallet = async () => {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData?.user

      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('user_wallet_balances')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) {
        console.error('Failed to fetch wallet:', error)
      } else {
        setWallet(data)
      }

      setLoading(false)
    }

    fetchWallet()
  }, [router])

  if (loading) {
    return <div className="p-4">Loading wallet...</div>
  }

  if (!wallet) {
    return <div className="p-4 text-red-500">No wallet data found.</div>
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Wallet Summary</h1>
      <div className="rounded-xl bg-white shadow-md p-6 border border-gray-200">
        <p className="text-sm text-gray-500">User ID:</p>
        <p className="text-base font-medium mb-2">{wallet.user_id}</p>

        <p className="text-sm text-gray-500">Balance:</p>
        <p className="text-2xl font-semibold text-green-600">
          ${wallet.balance.toFixed(2)}
        </p>

        <p className="text-sm text-gray-500 mt-4">
          Last updated: {new Date(wallet.updated_at).toLocaleString()}
        </p>
      </div>
    </div>
  )
}