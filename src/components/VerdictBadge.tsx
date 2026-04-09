import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

interface VerdictBadgeProps {
  verdict: 'COMPRA' | 'ATENCAO' | 'EVITAR'
  size?: 'sm' | 'md' | 'lg'
}

export default function VerdictBadge({ verdict, size = 'md' }: VerdictBadgeProps) {
  const config = {
    COMPRA: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-300',
      icon: CheckCircle,
      label: 'COMPRA',
    },
    ATENCAO: {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      border: 'border-amber-300',
      icon: AlertTriangle,
      label: 'ATENCAO',
    },
    EVITAR: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-300',
      icon: XCircle,
      label: 'EVITAR',
    },
  }

  const c = config[verdict]
  const Icon = c.icon
  const sizes = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-lg gap-3',
  }
  const iconSizes = { sm: 14, md: 18, lg: 24 }

  return (
    <div
      className={`inline-flex items-center ${sizes[size]} ${c.bg} ${c.text} border ${c.border} rounded-full font-bold`}
    >
      <Icon size={iconSizes[size]} />
      {c.label}
    </div>
  )
}
