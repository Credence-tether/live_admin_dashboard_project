'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
export default function DepositPage() {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleDeposit = async () => {
    setLoading(true)
    setMessage('')

    // Get currently logged-in user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setMessage('You must be logged in to make a deposit.')
      setLoading(false)
      return
    }

    // Insert deposit transaction
    const { error } = await supabase.from('transactions').insert([
      {
        user_id: user.id,
        type: 'deposit',
        amount: parseFloat(amount),
        status: 'pending',
      },
    ])

    if (error) {
      setMessage('Deposit failed: ' + error.message)
    } else {
      setMessage('Deposit submitted and pending approval.')
      setAmount('')
    }

    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Deposit Funds</h1>

      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <button
        onClick={handleDeposit}
        disabled={loading || !amount}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Processing...' : 'Submit Deposit'}
      </button>

      {message && (
        <p className="mt-4 text-sm text-center text-gray-700">{message}</p>
      )}
    </div>
  )
}