export default function Button({ children, onClick, variant = 'primary', disabled, className = '' }) {
  const base = 'w-full py-4 rounded-2xl font-semibold text-base transition-all'
  const variants = {
    primary: 'bg-gradient-to-r from-[#6B8DD6] to-[#6ECFB0] text-white shadow-md',
    outline: 'bg-white border border-gray-200 text-primary',
    dark: 'bg-[#1A1A2E] text-white',
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  )
}
