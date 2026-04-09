interface ScoreBadgeProps {
  score: number
  label: string
  size?: 'sm' | 'md' | 'lg'
}

export default function ScoreBadge({ score, label, size = 'md' }: ScoreBadgeProps) {
  const getColor = () => {
    if (score >= 70) return { bg: 'bg-green-50', text: 'text-green-700', ring: 'ring-green-200', bar: 'bg-green-500' }
    if (score >= 40) return { bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-200', bar: 'bg-amber-500' }
    return { bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-200', bar: 'bg-red-500' }
  }

  const color = getColor()
  const sizes = {
    sm: { wrapper: 'px-2 py-1', text: 'text-xs', number: 'text-lg' },
    md: { wrapper: 'px-3 py-2', text: 'text-sm', number: 'text-2xl' },
    lg: { wrapper: 'px-4 py-3', text: 'text-base', number: 'text-4xl' },
  }

  const s = sizes[size]

  return (
    <div className={`${color.bg} ${s.wrapper} rounded-xl ring-1 ${color.ring}`}>
      <p className={`${s.text} ${color.text} font-medium mb-1`}>{label}</p>
      <p className={`${s.number} font-bold ${color.text}`}>{score}</p>
      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
        <div
          className={`${color.bar} h-1.5 rounded-full transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}
