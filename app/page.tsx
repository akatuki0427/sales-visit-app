"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// スプレッドシートの「フォーム設計」に基づいた動的項目の定義
const FORM_CONFIG = {
  "既存フォロー": {
    "在庫確認": ["確認商品名", "現在の残数", "残期間(目安)", "次回確認予定日"],
    "納品対応": ["納品商品", "納品数量", "満足度", "他案件の有無"],
    "校正の打合せ": ["案件名", "校正回数", "修正の有無", "最終校了日（予定日）"],
  },
  "商談・見積": {
    "見積仕様の打合せ": ["対象商品", "仕様内容", "予定部数", "先方の予算感"],
    "見積書の提出": ["見積金額", "提案内容", "見積額に対しての反応", "次回見積案件の確認日"],
    "見積案件の確認": ["検討状況", "決定時期", "懸念点・要望", "競合他社の有無"],
  },
  "トラブル": {
    "クレームの状況の確認": ["クレーム対象商品", "被害枚数/範囲", "相手の要求事項", "応急処置の内容"],
    "謝罪とクレーム対応の説明": ["解決状況", "相手の納得度", "再発防止策提出", "信頼回復の見込"],
  },
  "季節提案": {
    "カレンダーの提案": ["現在の状況", "制作会社名", "反応・温度感", "検討時期"],
    "年賀状の提案": ["現在の状況", "制作会社名", "反応・温度感", "検討時期"],
  }
};

export default function SalesApp() {
  const [formData, setFormData] = useState({
    staff_name: "",
    customer_name: "",
    category: "既存フォロー",
    sub_category: "在庫確認",
    visit_type: "既存先",
    content: "",
    item_1: "",
    item_2: "",
    item_3: "",
    item_4: "",
  });

  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // データの取得
  const fetchVisits = async () => {
    const { data, error } = await supabase
      .from("visits")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setVisits(data);
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  // 保存処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.from("visits").insert([formData]);

    if (error) {
      alert("エラーが発生しました: " + error.message);
    } else {
      setFormData({ ...formData, customer_name: "", content: "", item_1: "", item_2: "", item_3: "", item_4: "" });
      fetchVisits();
      alert("保存しました！AI部長のフィードバックを生成中...");
    }
    setLoading(false);
  };

  // 現在の選択に基づいた動的なラベルを取得
  const currentLabels = (FORM_CONFIG as any)[formData.category]?.[formData.sub_category] || ["項目1", "項目2", "項目3", "項目4"];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ヘッダー */}
      <header className="bg-indigo-600 text-white p-4 shadow-lg sticky top-0 z-10">
        <h1 className="text-xl font-bold flex items-center gap-2">
          🚀 営業訪問記録 Pro
        </h1>
      </header>

      <main className="p-4 max-w-md mx-auto space-y-6">
        {/* 入力フォーム */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">営業担当者</label>
            <select 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={(e) => setFormData({...formData, staff_name: e.target.value})}
              required
            >
              <option value="">担当者を選択</option>
              <option value="金城暁">金城暁</option>
              <option value="兼次勇一">兼次勇一</option>
              {/* 他の担当者もここに追加可能 */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">訪問先名</label>
            <input
              type="text"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.customer_name}
              onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
              placeholder="株式会社 〇〇"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">大分類</label>
              <select 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value, sub_category: Object.keys((FORM_CONFIG as any)[e.target.value])[0]})}
              >
                {Object.keys(FORM_CONFIG).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">小分類</label>
              <select 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                value={formData.sub_category}
                onChange={(e) => setFormData({...formData, sub_category: e.target.value})}
              >
                {Object.keys((FORM_CONFIG as any)[formData.category]).map(sub => <option key={sub} value={sub}>{sub}</option>)}
              </select>
            </div>
          </div>

          {/* 動的項目 1-4 */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-dashed border-gray-200">
            {currentLabels.map((label: string, index: number) => (
              <div key={index}>
                <label className="block text-xs font-bold text-indigo-600 mb-1">{label}</label>
                <input
                  type="text"
                  className="w-full p-2 bg-indigo-50/30 border border-indigo-100 rounded-lg text-sm outline-none"
                  value={(formData as any)[`item_${index + 1}`]}
                  onChange={(e) => setFormData({...formData, [`item_${index + 1}`]: e.target.value})}
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">具体的な内容</label>
            <textarea
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl h-24 outline-none"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold shadow-indigo-200 shadow-lg hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "保存中..." : "記録を保存してAI部長へ"}
          </button>
        </form>

        {/* 履歴表示 */}
        <div className="space-y-4">
          <h2 className="font-bold text-gray-800 flex items-center gap-2 px-2">
            📅 最近の訪問履歴
          </h2>
          {visits.map((visit) => (
            <div key={visit.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md">{visit.category}</span>
                <span className="text-xs text-gray-400">{new Date(visit.created_at).toLocaleDateString()}</span>
              </div>
              <h3 className="font-bold text-gray-900">{visit.customer_name}</h3>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{visit.content}</p>
              
              {visit.ai_feedback && (
                <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <p className="text-xs font-bold text-amber-800 mb-1">🔥 AI部長からの激励</p>
                  <p className="text-xs text-amber-700 leading-relaxed italic">"{visit.ai_feedback}"</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}