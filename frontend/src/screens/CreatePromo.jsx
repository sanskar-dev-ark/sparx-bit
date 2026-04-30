import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { useApp } from '../context/useApp'
import { api } from '../api'

export default function CreatePromo() {
  const navigate = useNavigate()
  const { dispatch } = useApp()
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [code, setCode] = useState('')
  const [discount, setDiscount] = useState(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleCreate = async () => {
    if (!title.trim()) return
    const saved = await api.promos.create({
      title,
      description: desc,
      code: code.toUpperCase(),
      discount,
      start_date: startDate || null,
      end_date: endDate || null,
    })
    dispatch({ type: 'ADD_PROMO', promo: saved })
    navigate('/promo-status')
  }

  return (
    <div className="min-h-screen bg-bg max-w-sm mx-auto pb-24">
      <div className="flex items-center justify-between px-6 pt-6 mb-4">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-500">‹</button>
        <span className="font-semibold text-primary">Create Promotion</span>
        <button onClick={handleCreate} className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#6B8DD6] to-[#6ECFB0] text-white text-sm font-semibold">✓ Save</button>
      </div>

      <div className="px-6 space-y-5">
        <div className="bg-[#EEF0FB] rounded-2xl p-4 flex gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6B8DD6] to-[#6ECFB0] flex items-center justify-center text-white flex-shrink-0">🏷</div>
          <div>
            <p className="text-sm font-semibold text-primary">Special Promotion</p>
            <p className="text-xs text-secondary">Create a limited-time offer to attract new users to your referral program</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-secondary tracking-widest mb-2">PROMOTION TITLE</label>
          <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 flex items-center gap-2">
            <input value={title} onChange={e => setTitle(e.target.value.slice(0, 50))} placeholder="e.g. Spring Sale - 50% Off"
              className="flex-1 outline-none text-sm text-primary placeholder-gray-400 bg-transparent" />
            <span className="text-xs text-secondary">{title.length}/50</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-secondary tracking-widest mb-2">DESCRIPTION</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe your promotion details..." rows={3}
            className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm text-primary placeholder-gray-400 outline-none resize-none" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-secondary tracking-widest mb-2">PROMO CODE</label>
          <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 flex items-center gap-2">
            <span className="text-gray-400">🏷</span>
            <input value={code} onChange={e => setCode(e.target.value)} placeholder="e.g. SPRING50"
              className="flex-1 outline-none text-sm text-primary placeholder-gray-400 bg-transparent uppercase" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-secondary tracking-widest mb-2">DURATION</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-gray-200 rounded-2xl p-3">
              <p className="text-xs text-secondary mb-1">START DATE</p>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="text-sm text-primary bg-transparent outline-none w-full" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-3">
              <p className="text-xs text-secondary mb-1">END DATE</p>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="text-sm text-primary bg-transparent outline-none w-full" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-secondary tracking-widest mb-2">DISCOUNT</label>
          <div className="grid grid-cols-3 gap-3">
            {[25, 50, 75].map(pct => (
              <button key={pct} onClick={() => setDiscount(pct)}
                className={`py-3 rounded-2xl text-sm font-semibold border transition-all ${discount === pct ? 'bg-[#6B8DD6] text-white border-transparent' : 'bg-white border-gray-200 text-primary'}`}>
                {pct}%
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-secondary tracking-widest mb-2">PROMOTION BANNER</label>
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-2">
            <span className="text-3xl text-gray-300">🖼</span>
            <span className="text-sm text-secondary">Upload Image</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm px-6 pb-6 pt-3 bg-bg">
        <Button onClick={handleCreate} disabled={!title.trim()}>✓ Create Promotion</Button>
      </div>
    </div>
  )
}
