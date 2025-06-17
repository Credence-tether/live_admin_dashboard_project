'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export default function InvestmentsPage() {
  const [roiData, setRoiData] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('investment_plans')
        .select('id, name, daily_roi_min, daily_roi_max')
      if (data) setRoiData(data)
    }
    fetchData()
  }, [])

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Live Investment ROI</h2>
      <table className="min-w-full border">
        <thead><tr><th>Name</th><th>Min ROI</th><th>Max ROI</th></tr></thead>
        <tbody>
          {roiData.map(plan => (
            <tr key={plan.id} className="border-t">
              <td>{plan.name}</td>
              <td>{plan.daily_roi_min}%</td>
              <td>{plan.daily_roi_max}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}