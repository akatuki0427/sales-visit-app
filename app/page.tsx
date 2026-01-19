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
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchVisits() }, [])

  async function fetchVisits() {
    const { data } = await supabase.from('visits').select('*').order('created_at', { ascending: false })
    if (data) setVisits(data)
  }

  async function saveVisit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await supabase.from('visits').insert([form])
    setForm({ customer_name: '', staff_name: '', content: '', visit_date: '' })
    await fetchVisits()
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* ヘッダー */}
      <div className="bg-indigo-600 text-white p-6 shadow-md mb-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-bold flex items-center gap-2">
            🚀 営業訪問記録
          </h1>
          <p className="text-indigo-100 text-sm mt-1">日々の活動をスマートに記録</p>
        </div>
      </div>

      <div className="px-4 max-w-2xl mx-auto">
        {/* 入力フォーム */}
        <form onSubmit={saveVisit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">新規登録</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="text-xs text-gray-400 ml-1">訪問日</label>
              <input type="date" value={form.visit_date} onChange={e => setForm({...form, visit_date: e.target.value})} className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required />
            </div>
            <div className="col-span-1">
              <label className="text-xs text-gray-400 ml-1">担当者</label>
              <input type="text" placeholder="氏名" value={form.staff_name} onChange={e => setForm({...form, staff_name: e.target.value})} className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 ml-1">顧客名</label>
            <input type="text" placeholder="株式会社 〇〇" value={form.customer_name} onChange={e => setForm({...form, customer_name: e.target.value})} className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" required />
          </div>

          <div>
            <label className="text-xs text-gray-400 ml-1">訪問内容</label>
            <textarea placeholder="お話しした内容など" value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[100px]" />
          </div>

          <button type="submit" disabled={loading} className={`w-full ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-bold p-4 rounded-xl shadow-lg transition-all active:scale-95`}>
            {loading ? '保存中...' : 'データを保存する'}
          </button>
        </form>

        {/* 履歴一覧 */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider ml-1">訪問履歴</h2>
          {visits.length === 0 && <p className="text-center text-gray-400 py-10">履歴がまだありません</p>}
          {visits.map(v => (
            <div key={v.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-200 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md">{v.visit_date}</span>
                <span className="text-xs text-gray-400 flex items-center gap-1">👤 {v.staff_name}</span>
              </div>
              <div className="font-bold text-gray-800 text-lg mb-2">{v.customer_name}</div>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{v.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}