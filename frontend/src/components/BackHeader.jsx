import { useNavigate } from 'react-router-dom'

export default function BackHeader({ title }) {
  const navigate = useNavigate()
  return (
    <div className="flex items-center gap-4 mb-6">
      <button
        onClick={() => navigate(-1)}
        className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-500 hover:bg-gray-50"
      >
        ‹
      </button>
      <span className="font-semibold text-primary text-base">{title}</span>
    </div>
  )
}
