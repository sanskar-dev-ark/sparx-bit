export const today = () => new Date().toISOString().slice(0, 10)

function calcStreak(completions) {
  let streak = 0
  const d = new Date()
  while (true) {
    const key = d.toISOString().slice(0, 10)
    if (completions[key]) { streak++; d.setDate(d.getDate() - 1) } else break
  }
  return streak
}

export const THEMES = {
  Default: { from: '#6B8DD6', to: '#6ECFB0' },
  Ocean:   { from: '#0EA5E9', to: '#06B6D4' },
  Sunset:  { from: '#F97316', to: '#EC4899' },
  Forest:  { from: '#16A34A', to: '#65A30D' },
}

export const TRANSLATIONS = {
  English: { welcomeBack: 'Welcome back! 👋', todayProgress: "Today's Progress", todayBits: "Today's Bits", addNew: 'Add New', streak: 'days', completed: 'Completed' },
  Hindi:   { welcomeBack: 'वापस स्वागत है! 👋', todayProgress: 'आज की प्रगति', todayBits: 'आज के बिट्स', addNew: 'नया जोड़ें', streak: 'दिन', completed: 'पूर्ण' },
  Spanish: { welcomeBack: '¡Bienvenido de nuevo! 👋', todayProgress: 'Progreso de hoy', todayBits: 'Bits de hoy', addNew: 'Agregar', streak: 'días', completed: 'Completado' },
  French:  { welcomeBack: 'Bon retour! 👋', todayProgress: "Progrès d'aujourd'hui", todayBits: "Bits d'aujourd'hui", addNew: 'Ajouter', streak: 'jours', completed: 'Complété' },
  German:  { welcomeBack: 'Willkommen zurück! 👋', todayProgress: 'Heutiger Fortschritt', todayBits: 'Heutige Bits', addNew: 'Hinzufügen', streak: 'Tage', completed: 'Abgeschlossen' },
  Japanese:{ welcomeBack: 'おかえりなさい！👋', todayProgress: '今日の進捗', todayBits: '今日のビット', addNew: '追加', streak: '日', completed: '完了' },
}

export function useDerivedStats(bits) {
  const safeBits = bits.map(bit => ({ ...bit, completions: bit.completions || {} }))
  const t = today()
  const completedToday = safeBits.filter(b => b.completions[t]).length
  const pct = safeBits.length ? Math.round((completedToday / safeBits.length) * 100) : 0
  let streak = 0
  const d = new Date()
  for (let i = 0; i < 365; i++) {
    const key = d.toISOString().slice(0, 10)
    if (safeBits.some(b => b.completions[key])) { streak++; d.setDate(d.getDate() - 1) } else break
  }
  const bitsWithStreak = safeBits.map(b => ({ ...b, streak: calcStreak(b.completions) }))
  return { totalToday: safeBits.length, completedToday, pct, streak, bitsWithStreak }
}
