'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function SalesApp() {
  const [visits, setVisits] = useState<any[]>([])
  const [form, setForm] = useState({ customer_name: '', staff_name: '', content: '', visit_date: '' })

  useEffect(() => { fetchVisits() }, [])

  async function fetchVisits() {
    const { data } = await supabase.from('visits').select('*').order('created_at', { ascending: false })
    if (data) setVisits(data)
  }

  async function saveVisit(e: React.FormEvent) {
    e.preventDefault()
    await supabase.from('visits').insert([form])
    setForm({ customer_name: '', staff_name: '', content: '', visit_date: '' })
    fetchVisits()
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">営業訪問記録</h1>
      <form onSubmit={saveVisit} className="space-y-4 mb-10 p-4 border rounded shadow-sm">
        <input type="date" value={form.visit_date} onChange={e => setForm({...form, visit_date: e.target.value})} className="w-full p-2 border rounded" required />
        <input type="text" placeholder="顧客名" value={form.customer_name} onChange={e => setForm({...form, customer_name: e.target.value})} className="w-full p-2 border rounded" required />
        <input type="text" placeholder="担当者名" value={form.staff_name} onChange={e => setForm({...form, staff_name: e.target.value})} className="w-full p-2 border rounded" required />
        <textarea placeholder="訪問内容" value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">保存する</button>
      </form>
      <div className="space-y-4">
        {visits.map(v => (
          <div key={v.id} className="p-4 border-b">
            <div className="flex justify-between text-sm text-gray-500"><span>{v.visit_date}</span><span>担当: {v.staff_name}</span></div>
            <div className="font-bold text-lg">{v.customer_name}</div>
            <p className="mt-2 text-gray-700">{v.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}