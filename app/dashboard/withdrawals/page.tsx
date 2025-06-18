'use client';
import { useEffect, useState } from 'react';
// Update the import path below to match the actual location and exported name of your Supabase client
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export default function WithdrawalsPage() {
  const [wallet, setWallet] = useState<number>(0);
  const [amount, setAmount] = useState('');
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWallet = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from('user_wallet_balances')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    setWallet(data?.balance || 0);
  };

  const fetchWithdrawals = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', 'withdrawal')
      .order('created_at', { ascending: false });

    setWithdrawals(data || []);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('transactions').insert({
      user_id: user.id,
      type: 'withdrawal',
      amount: parseFloat(amount),
      status: 'pending',
    });

    if (!error) {
      alert('Withdrawal request submitted!');
      setAmount('');
      fetchWithdrawals();
    } else {
      alert('Error submitting request.');
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchWallet();
    fetchWithdrawals();
  }, []);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Withdrawals</h1>

      <div className="mb-4">
        <p className="text-sm text-gray-600">Available Balance:</p>
        <p className="text-2xl font-bold">${wallet.toFixed(2)}</p>
      </div>

      <div className="mb-4 flex gap-2">
        <input
          placeholder="Enter amount to withdraw"
          value={amount}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
          type="number"
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !amount}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Request Withdrawal'}
        </button>
      </div>

      <h2 className="text-lg font-medium mt-6 mb-2">Your Withdrawal History</h2>
      <ul className="space-y-2">
        {withdrawals.map((w: any) => (
          <li key={w.id} className="border p-3 rounded-lg">
            <div className="flex justify-between">
              <span>${w.amount}</span>
              <span className="text-sm text-gray-500">{w.status}</span>
            </div>
            <div className="text-xs text-gray-400">{new Date(w.created_at).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}