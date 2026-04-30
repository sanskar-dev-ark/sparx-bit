import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button'
import { useApp } from '../context/useApp'
import { api } from '../api'

const CATS = [
  { id: 'none',   label: 'NONE',   icon: '✕', bg: 'bg-white border-2 border-dashed border-gray-300', text: 'text-gray-400' },
  { id: 'work',   label: 'WORK',   letter: 'W', bg: 'bg-[#FEE2E2]', text: 'text-[#991B1B]' },
  { id: 'health', label: 'HEALTH', letter: 'H', bg: 'bg-[#D1FAE5]', text: 'text-[#065F46]' },
  { id: 'family', label: 'FAMILY', letter: 'F', bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]' },
]
const PRESETS = ['1x', '2x', '3x', '5x', 'Daily']
const PRESET_MAP = { '1x': 1, '2x': 2, '3x': 3, '5x': 5, 'Daily': 7 }

export default function AddBit() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const { id } = useParams()
  const existing = id ? state.bits.find(b => b.id === Number(id)) : null
  const isEdit = !!existing

  const [title, setTitle] = useState(existing?.title || '')
  const [why, setWhy] = useState(existing?.why || '')
  const [desc, setDesc] = useState(existing?.description || existing?.desc || '')
  const [goal, setGoal] = useState(existing?.goal || 5)
  const [preset, setPreset] = useState('5x')
  const [cat, setCat] = useState(existing?.category || 'none')
  const [customNotif, setCustomNotif] = useState(false)

  const setPresetGoal = p => { setPreset(p); setGoal(PRESET_MAP[p]) }

  const handleSave = async () => {
    if (!title.trim()) return
    const bit = { title, why, description: desc, goal, category: cat }
    if (isEdit) {
      const saved = await api.bits.update(existing.id, bit)
      dispatch({ type: 'UPDATE_BIT', bit: { ...saved, completions: existing.completions || {} } })
    } else {
      const saved = await api.bits.create(bit)
      dispatch({ type: 'ADD_BIT', bit: { ...saved, completions: {} } })
    }
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-bg max-w-sm mx-auto pb-24">
      <div className="flex items-center justify-between px-6 pt-6 mb-4">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-500">‹</button>
        <span className="font-semibold text-primary">{isEdit ? 'Edit Bit' : 'New Bit'}</span>
        <button onClick={handleSave} className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#6B8DD6] to-[#6ECFB0] text-white text-sm font-semibold">✓ Save</button>
      </div>

      <div className="px-6 space-y-5">
        {!isEdit && (
          <div className="bg-[#EEF0FB] rounded-2xl p-4 flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6B8DD6] to-[#6ECFB0] flex items-center justify-center text-white flex-shrink-0">💡</div>
            <div>
              <p className="text-sm font-semibold text-primary">Tip: Keep it specific</p>
              <p className="text-xs text-secondary">Instead of "exercise", try "Walk 30 minutes". Clear bits are easier to track!</p>
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-secondary tracking-widest mb-2">TITLE</label>
          <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 flex items-center gap-2">
            <span className="text-gray-400 text-sm">✎</span>
            <input value={title} onChange={e => setTitle(e.target.value.slice(0, 50))} placeholder="e.g. Walk 30 Minutes"
              className="flex-1 outline-none text-sm text-primary placeholder-gray-400 bg-transparent" />
            <span className="text-xs text-secondary">{title.length}/50</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-secondary tracking-widest mb-2">WHY?</label>
          <textarea value={why} onChange={e => setWhy(e.target.value)} placeholder="e.g. I want to feel more energised every morning..." rows={3}
            className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm text-primary placeholder-gray-400 outline-none resize-none" />
          <p className="text-xs text-secondary mt-1">Your personal motivation. This will appear in reminder notifications.</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-secondary tracking-widest mb-2">DESCRIPTION <span className="normal-case font-normal">(optional)</span></label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="e.g. A brisk 30-min walk around the park after breakfast..." rows={3}
            className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm text-primary placeholder-gray-400 outline-none resize-none" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-secondary tracking-widest mb-2">GOAL PER WEEK ⓘ</label>
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <div className="flex items-center gap-4 mb-3">
              <button onClick={() => setGoal(g => Math.max(1, g - 1))} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-secondary">−</button>
              <span className="text-3xl font-black text-[#6B8DD6]">{goal}</span>
              <button onClick={() => setGoal(g => Math.min(7, g + 1))} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-secondary">+</button>
              <span className="ml-auto text-sm font-semibold text-primary">{goal} days<br /><span className="font-normal text-secondary">per week</span></span>
            </div>
            <div className="flex gap-1 mb-3">
              {Array.from({ length: 7 }, (_, i) => (
                <div key={i} className={`flex-1 h-1.5 rounded-full ${i < goal ? 'bg-gradient-to-r from-[#6B8DD6] to-[#6ECFB0]' : 'bg-gray-200'}`} />
              ))}
            </div>
            <div className="flex gap-2">
              {PRESETS.map(p => (
                <button key={p} onClick={() => setPresetGoal(p)} className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition-all ${preset === p ? 'bg-[#6B8DD6] text-white border-transparent' : 'bg-white border-gray-200 text-secondary'}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-secondary tracking-widest mb-2">CATEGORY <span className="normal-case font-normal">(optional)</span></label>
          <div className="flex flex-wrap gap-2">
            {CATS.map(({ id: cid, label, letter, icon, bg, text }) => (
              <button key={cid} onClick={() => setCat(cid)}
                className={`w-16 h-16 rounded-2xl ${bg} flex flex-col items-center justify-center relative transition-all ${cat === cid ? 'ring-2 ring-[#6B8DD6]' : ''}`}>
                {cat === cid && cid !== 'none' && <span className="absolute top-1 right-1 text-[#6B8DD6] text-xs">✓</span>}
                <span className={`font-bold text-sm ${text}`}>{letter || icon}</span>
                <span className={`text-[9px] font-semibold ${text}`}>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-secondary tracking-widest mb-2">NOTIFICATION</label>
          <div className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100">
            <div className="flex items-center gap-3 p-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6B8DD6] to-[#6ECFB0] flex items-center justify-center text-white">🔔</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-primary">Using default notifications</p>
                <p className="text-xs text-secondary">Reminders at {state.reminderTime}</p>
              </div>
              <span className="text-xs bg-[#EEF0FB] text-[#6B8DD6] px-2 py-1 rounded-lg font-semibold">DEFAULT</span>
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-semibold text-primary">Custom notification</p>
                <p className="text-xs text-secondary">Unique time & message</p>
              </div>
              <button onClick={() => setCustomNotif(v => !v)} className={`w-11 h-6 rounded-full transition-all ${customNotif ? 'bg-[#6B8DD6]' : 'bg-gray-200'} relative`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${customNotif ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Live preview */}
        <div>
          <label className="block text-xs font-semibold text-secondary tracking-widest mb-2">PREVIEW</label>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center ${CATS.find(c=>c.id===cat)?.bg || 'bg-gray-100'}`}>
              <span className={`font-bold text-sm ${CATS.find(c=>c.id===cat)?.text || 'text-gray-400'}`}>{CATS.find(c=>c.id===cat)?.letter || '?'}</span>
              <span className={`text-[9px] font-semibold ${CATS.find(c=>c.id===cat)?.text || 'text-gray-400'}`}>{CATS.find(c=>c.id===cat)?.label || 'NONE'}</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-primary">{title || 'Bit Name'}</p>
              <p className="text-xs text-secondary">{why || 'Your motivation will show here...'}</p>
              <p className="text-xs text-orange-500 mt-0.5">🔥 Weekly · {goal}x</p>
            </div>
            <div className="w-7 h-7 rounded-full border-2 border-gray-300 flex items-center justify-center">
              <span className="text-xs text-gray-300">✓</span>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm px-6 pb-6 pt-3 bg-bg">
        <Button onClick={handleSave} disabled={!title.trim()}>
          ✓ {isEdit ? 'Update Bit' : 'Add Bit'}
        </Button>
      </div>
    </div>
  )
}
