"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminDashboardPage() {
  const supabase = createClient();
  const [wallets, setWallets] = useState<any[]>([]);
  const [investments, setInvestments] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      const [{ data: walletData }, { data: investmentData }, { data: txData }] = await Promise.all([
        supabase.from("user_wallet_balances").select("*"),
        supabase.from("user_investments").select("*"),
        supabase.from("transactions").select("*").order("created_at", { ascending: false }),
      ]);

      setWallets(walletData || []);
      setInvestments(investmentData || []);
      setTransactions(txData || []);
      setLoading(false);
    };

    fetchAdminData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          {/* Wallets */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-2">All Wallet Balances</h2>
            <ul className="space-y-2">
              {wallets.map((w) => (
                <li key={w.id} className="border p-3 rounded">
                  <p><strong>User ID:</strong> {w.user_id}</p>
                  <p><strong>Balance:</strong> ${w.balance}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Investments */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-2">All Investments</h2>
            <ul className="space-y-2">
              {investments.map((inv) => (
                <li key={inv.id} className="border p-3 rounded">
                  <p><strong>User ID:</strong> {inv.user_id}</p>
                  <p><strong>Plan:</strong> {inv.plan_name}</p>
                  <p><strong>Amount:</strong> ${inv.amount}</p>
                  <p><strong>Status:</strong> {inv.status}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Transactions */}
          <section>
            <h2 className="text-lg font-semibold mb-2">Recent Transactions</h2>
            <ul className="space-y-2">
              {transactions.map((tx) => (
                <li key={tx.id} className="border p-3 rounded">
                  <p><strong>User ID:</strong> {tx.user_id}</p>
                  <p><strong>Type:</strong> {tx.type}</p>
                  <p><strong>Amount:</strong> ${tx.amount}</p>
                  <p><strong>Status:</strong> {tx.status}</p>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}