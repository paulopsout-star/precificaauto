import { useState, useRef, useEffect } from 'react'
import { processMessage, resetBotState, getBotState, type Message, type VehicleData, type ChecklistData, type MatchData, type IntentData, type RedeVehicle } from '../data/botEngine'
import { Send, Mic, Paperclip, Phone, Video, MoreVertical, ArrowLeft, Car, CheckCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

function formatCurrency(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(v)
}

function formatTime(d: Date) {
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

// ─── Score bar ───
function ScoreBar({ score, label }: { score: number; label: string }) {
  const color = score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-amber-500' : 'bg-red-500'
  const textColor = score >= 70 ? 'text-green-700' : score >= 40 ? 'text-amber-700' : 'text-red-700'
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-gray-500 w-14">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full">
        <div className={`h-1.5 rounded-full ${color} transition-all duration-700`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-[11px] font-bold ${textColor} w-7 text-right`}>{score}</span>
    </div>
  )
}

// ─── Verdict badge ───
function Verdict({ verdict }: { verdict: string }) {
  const config: Record<string, { bg: string; text: string; emoji: string }> = {
    COMPRA: { bg: 'bg-green-500', text: 'text-white', emoji: '✅' },
    ATENCAO: { bg: 'bg-amber-500', text: 'text-white', emoji: '⚠️' },
    EVITAR: { bg: 'bg-red-500', text: 'text-white', emoji: '🚫' },
  }
  const c = config[verdict] || config.ATENCAO
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 ${c.bg} ${c.text} rounded text-xs font-bold`}>
      {c.emoji} {verdict}
    </span>
  )
}

// ─── Pricing Card ───
function PricingCard({ data }: { data: VehicleData }) {
  const pctPos = ((data.marketMedian - data.marketMin) / (data.marketMax - data.marketMin)) * 100
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 max-w-[320px]">
      <div className="bg-gray-800 px-4 py-3">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] text-gray-400">{data.plate} · {data.year}/{data.yearModel}</p>
            <p className="text-sm font-bold text-white">{data.brand} {data.model}</p>
            <p className="text-xs text-gray-300">{data.version}</p>
          </div>
          <Verdict verdict={data.verdict} />
        </div>
        <div className="flex gap-3 mt-2 text-[10px] text-gray-400">
          <span>{data.km.toLocaleString()} km</span>
          <span>{data.fuel}</span>
          <span>{data.color}</span>
          <span>{data.region}</span>
        </div>
      </div>

      <div className="px-4 py-3 space-y-3">
        {/* Scores */}
        <div className="space-y-1.5">
          <ScoreBar score={data.priceScore} label="Preco" />
          <ScoreBar score={data.liquidityScore} label="Liquidez" />
          <ScoreBar score={data.riskScore} label="Risco" />
        </div>

        {/* FIPE */}
        <div className="bg-gray-50 rounded-lg px-3 py-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-500">FIPE ({data.fipeCode})</span>
            <span className="text-sm font-bold text-gray-900">{formatCurrency(data.fipePrice)}</span>
          </div>
        </div>

        {/* Market range */}
        <div>
          <p className="text-[10px] text-gray-500 mb-1">Mercado ({data.totalAds} anuncios)</p>
          <div className="flex justify-between text-[10px] text-gray-400 mb-0.5">
            <span>P10: {formatCurrency(data.marketMin)}</span>
            <span>P90: {formatCurrency(data.marketMax)}</span>
          </div>
          <div className="h-2 bg-gradient-to-r from-green-300 via-yellow-200 to-red-300 rounded-full relative">
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-800 rounded-full border-2 border-white shadow"
              style={{ left: `${Math.min(Math.max(pctPos, 5), 95)}%` }}
            />
          </div>
        </div>

        {/* Buy range */}
        <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <p className="text-[10px] text-green-700 font-medium">Faixa de compra (P25-P40)</p>
          <p className="text-sm font-bold text-green-800">
            {formatCurrency(data.recommendedBuyMin)} - {formatCurrency(data.recommendedBuyMax)}
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Checklist Card ───
function ChecklistCard({ data }: { data: ChecklistData }) {
  const statusIcon = (s: string) => {
    if (s === 'ok') return '✅'
    if (s === 'warning') return '⚠️'
    return '🚫'
  }
  const statusColor = (s: string) => {
    if (s === 'ok') return 'text-green-700'
    if (s === 'warning') return 'text-amber-700'
    return 'text-red-700'
  }

  const riskColor = data.riskScore >= 70 ? 'bg-green-500' : data.riskScore >= 40 ? 'bg-amber-500' : 'bg-red-500'

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 max-w-[320px]">
      <div className="bg-amber-600 px-4 py-3">
        <p className="text-[10px] text-amber-100">CHECKLIST DOCUMENTAL</p>
        <p className="text-sm font-bold text-white">{data.vehicle.brand} {data.vehicle.model} · {data.vehicle.plate}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] text-amber-100">Score de risco:</span>
          <span className={`text-xs font-bold text-white px-2 py-0.5 rounded ${riskColor}`}>{data.riskScore}/100</span>
        </div>
      </div>
      <div className="px-4 py-3 space-y-1.5">
        {data.items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-xs mt-0.5">{statusIcon(item.status)}</span>
            <div className="flex-1">
              <p className={`text-xs font-medium ${statusColor(item.status)}`}>{item.label}</p>
              <p className="text-[10px] text-gray-500">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={`px-4 py-2 text-[10px] ${data.riskScore >= 70 ? 'bg-green-50 text-green-700' : data.riskScore >= 40 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
        {data.riskScore >= 70 && 'Sem pendencias criticas. Veredicto nao impactado.'}
        {data.riskScore >= 40 && data.riskScore < 70 && 'Pendencias menores. Veredicto vai para ATENCAO.'}
        {data.riskScore < 40 && 'Restricao critica! Veredicto vai para EVITAR.'}
      </div>
    </div>
  )
}

// ─── Match Alert Card ───
function MatchCard({ data }: { data: MatchData }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 max-w-[320px]">
      <div className="bg-purple-600 px-4 py-3">
        <p className="text-[10px] text-purple-200">🔔 ALERTA DE MATCH</p>
        <p className="text-sm font-bold text-white">{data.vehicle}</p>
        <p className="text-xs text-purple-200">{data.source}</p>
      </div>
      <div className="px-4 py-3 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Vendedor</span>
          <span className="font-medium text-gray-900">{data.seller}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Cidade</span>
          <span className="font-medium text-gray-900">{data.city}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Preco</span>
          <span className="font-bold text-gray-900">{formatCurrency(data.price)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Ano / KM</span>
          <span className="font-medium text-gray-900">{data.year} · {data.km.toLocaleString()} km</span>
        </div>
        <div className="flex gap-2 mt-1">
          <ScoreBar score={data.priceScore} label="Preco" />
        </div>
        <div className="flex gap-2">
          <ScoreBar score={data.liquidityScore} label="Liquidez" />
        </div>
        <button className="w-full mt-2 py-2 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600 transition-colors">
          📱 Contatar vendedor
        </button>
      </div>
    </div>
  )
}

// ─── Intent Confirm Card ───
function IntentConfirmCard({ data }: { data: IntentData }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 max-w-[320px]">
      <div className="bg-blue-600 px-4 py-3">
        <p className="text-[10px] text-blue-200">🔔 CADASTRAR INTENCAO DE COMPRA</p>
        <p className="text-sm font-bold text-white">{data.brand} {data.model}</p>
      </div>
      <div className="px-4 py-3 space-y-1.5 text-xs">
        <div className="flex justify-between"><span className="text-gray-500">Ano</span><span className="font-medium">{data.yearMin}–{data.yearMax}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">KM max</span><span className="font-medium">{data.kmMax.toLocaleString()} km</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Preco max</span><span className="font-medium">{formatCurrency(data.priceMax)}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Regiao</span><span className="font-medium">{data.region}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Score minimo</span><span className="font-medium">65</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Monitoramento</span><span className="font-medium">Canal Repasse + Portais + Rede</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Validade</span><span className="font-medium">30 dias</span></div>
      </div>
      <div className="px-4 py-2 bg-blue-50 text-[11px] text-blue-700">
        Confirme abaixo para ativar o monitoramento
      </div>
    </div>
  )
}

// ─── Rede Confirm Card ───
function RedeConfirmCard({ data }: { data: RedeVehicle }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 max-w-[320px]">
      <div className="bg-brand-600 px-4 py-3">
        <p className="text-[10px] text-brand-100">🤝 CADASTRAR NA REDE</p>
        <p className="text-sm font-bold text-white">{data.model}</p>
      </div>
      <div className="px-4 py-3 space-y-1.5 text-xs">
        <div className="flex justify-between"><span className="text-gray-500">Ano</span><span className="font-medium">{data.year}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">KM</span><span className="font-medium">{data.km.toLocaleString()} km</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Preco repasse</span><span className="font-medium">{formatCurrency(data.price)}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Regiao</span><span className="font-medium">{data.region}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Visibilidade</span><span className="font-medium">Apenas matches</span></div>
        <div className="flex justify-between"><span className="text-gray-500">TTL</span><span className="font-medium">30 dias</span></div>
      </div>
      <div className="px-4 py-2 bg-brand-50 text-[11px] text-brand-700">
        Confirme abaixo para cadastrar na rede
      </div>
    </div>
  )
}

// ─── Plans Card ───
function PlansCard() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 max-w-[320px]">
      <div className="bg-gray-800 px-4 py-3">
        <p className="text-sm font-bold text-white">📋 Planos PrecificaAuto</p>
      </div>
      <div className="divide-y divide-gray-100">
        {[
          { name: 'Avulso', price: 'R$ 4,90/consulta', desc: 'Sem assinatura', badge: '' },
          { name: 'Starter', price: 'R$ 97/mes', desc: '30 consultas + checklist', badge: '' },
          { name: 'Profissional', price: 'R$ 197/mes', desc: '80 consultas + alertas + PDF', badge: '⭐ Popular' },
          { name: 'Loja', price: 'R$ 397/mes', desc: '200 consultas + rede + API', badge: '' },
        ].map((p) => (
          <div key={p.name} className="px-4 py-2.5 flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-gray-900">
                {p.name} {p.badge && <span className="text-[10px] text-amber-600">{p.badge}</span>}
              </p>
              <p className="text-[10px] text-gray-500">{p.desc}</p>
            </div>
            <span className="text-xs font-bold text-brand-700">{p.price}</span>
          </div>
        ))}
      </div>
      <div className="px-4 py-2 bg-gray-50 text-[10px] text-gray-500">
        Digite o nome do plano para ativar. Ex: *assinar starter*
      </div>
    </div>
  )
}

// ─── Summary Card ───
function SummaryCard({ data }: { data: any }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 max-w-[320px]">
      <div className="bg-brand-600 px-4 py-3">
        <p className="text-sm font-bold text-white">📊 Seu resumo</p>
      </div>
      <div className="px-4 py-3 space-y-1.5 text-xs">
        <div className="flex justify-between"><span className="text-gray-500">Plano</span><span className="font-medium capitalize">{data.plan}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Consultas usadas</span><span className="font-medium">{data.consultas}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Gratis restantes</span><span className="font-medium">{data.freeLeft}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Intencoes ativas</span><span className="font-medium">{data.intents}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Veiculos na rede</span><span className="font-medium">{data.redeVehicles}</span></div>
      </div>
    </div>
  )
}

// ─── Message Bubble ───
function MessageBubble({ message, onSend, isLast }: { message: Message; onSend: (text: string) => void; isLast: boolean }) {
  const isBot = message.from === 'bot'

  const renderText = (text: string) => (
    <p className="text-[13px] leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{
      __html: text
        .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
        .replace(/_(.*?)_/g, '<em style="color:#6b7280">$1</em>')
    }} />
  )

  const renderContent = () => {
    switch (message.type) {
      case 'card-pricing': return <PricingCard data={message.data} />
      case 'card-checklist': return <ChecklistCard data={message.data} />
      case 'card-match': return <MatchCard data={message.data} />
      case 'card-intent-confirm': return <IntentConfirmCard data={message.data} />
      case 'card-rede': return <RedeConfirmCard data={message.data} />
      case 'card-plans': return <PlansCard />
      case 'card-summary': return <SummaryCard data={message.data} />
      case 'buttons':
        return (
          <div>
            {message.text && renderText(message.text)}
            {message.buttons && isLast && (
              <div className="flex flex-col gap-1.5 mt-2.5 pt-2.5 border-t border-gray-100">
                {message.buttons.map((btn) => (
                  <button
                    key={btn.value}
                    onClick={() => onSend(btn.value)}
                    className="w-full py-2 px-3 text-[13px] font-medium text-[#075e54] bg-white border border-[#d1f4e0] rounded-lg hover:bg-[#d1f4e0] transition-colors text-center active:scale-[0.98]"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            )}
            {message.buttons && !isLast && (
              <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-gray-100">
                {message.buttons.map((btn) => (
                  <span key={btn.value} className="text-[10px] text-gray-400 italic">{btn.label}</span>
                ))}
              </div>
            )}
          </div>
        )
      case 'typing':
        return (
          <div className="flex gap-1 px-2 py-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )
      default:
        return renderText(message.text || '')
    }
  }

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-1`}>
      <div
        className={`relative max-w-[85%] px-3 py-2 rounded-lg shadow-sm ${
          isBot
            ? 'bg-white text-gray-800 rounded-tl-none'
            : 'bg-[#d9fdd3] text-gray-800 rounded-tr-none'
        }`}
      >
        {renderContent()}
        {message.type !== 'typing' && (
          <div className="flex items-center justify-end gap-1 mt-0.5">
            <span className="text-[10px] text-gray-400">{formatTime(message.timestamp)}</span>
            {!isBot && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Quick Action Chips ───
function QuickChips({ onSend }: { onSend: (text: string) => void }) {
  const chips = [
    { label: '💰 Consulta Preco', value: 'ABC1D23' },
    { label: '🔎 Busca Estoque', value: 'quero HB20 2021+' },
    { label: '📦 Cadastrar Veiculo', value: 'tenho Civic 2020, 52k km, R$ 98k' },
    { label: '🔍 Checklist', value: 'checklist ABC1D23' },
    { label: '📋 Planos', value: 'planos' },
  ]
  return (
    <div className="flex gap-1.5 flex-wrap px-3 py-2">
      {chips.map((c) => (
        <button
          key={c.label}
          onClick={() => onSend(c.value)}
          className="px-3 py-1.5 bg-white border border-brand-200 text-brand-700 text-[12px] rounded-full hover:bg-brand-50 transition-colors whitespace-nowrap font-medium"
        >
          {c.label}
        </button>
      ))}
    </div>
  )
}

// ─── Main Chat Component ───
export default function WhatsAppChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [_showChips] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    resetBotState()
    // Auto welcome
    const welcome = processMessage('oi')
    const withDelay = welcome.map((m, i) => ({ ...m, timestamp: new Date(Date.now() + i * 200) }))
    setMessages(withDelay)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = (text: string) => {
    if (!text.trim()) return

    const userMsg: Message = {
      id: String(Date.now()),
      from: 'user',
      type: 'text',
      text: text.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')

    // Show typing indicator
    const typingMsg: Message = {
      id: 'typing',
      from: 'bot',
      type: 'typing',
      timestamp: new Date(),
    }
    setTimeout(() => setMessages((prev) => [...prev, typingMsg]), 300)

    // Process and show response
    const delay = text.match(/[A-Za-z]{3}\d[A-Za-z\d]\d{2}/) ? 2500 : 1200
    setTimeout(() => {
      const responses = processMessage(text)
      setMessages((prev) => {
        const withoutTyping = prev.filter((m) => m.id !== 'typing')
        // Add responses with staggered timestamps
        const withResponses = responses.reduce((acc, r, i) => {
          return [...acc, { ...r, timestamp: new Date(Date.now() + i * 500) }]
        }, withoutTyping)
        return withResponses
      })
    }, delay)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
    inputRef.current?.focus()
  }

  // Keep getBotState available for future use
  void getBotState

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* WhatsApp Header */}
      <div className="bg-[#075e54] text-white flex items-center gap-3 px-3 py-2 shrink-0">
        <Link to="/" className="p-1 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center">
          <Car className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">PrecificaAuto</p>
          <p className="text-[11px] text-green-200">
            Assistente de compra e busca de veiculos
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Video className="w-5 h-5 opacity-70" />
          <Phone className="w-5 h-5 opacity-70" />
          <MoreVertical className="w-5 h-5 opacity-70" />
        </div>
      </div>

      {/* Chat body */}
      <div
        className="flex-1 overflow-y-auto px-3 py-3"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 Q35 0 40 5 Q45 10 40 15 Q35 20 30 15 Q25 10 30 5' fill='%23e5ddd5' opacity='0.15'/%3E%3C/svg%3E")`,
          backgroundColor: '#efeae2',
        }}
      >
        {/* Date chip */}
        <div className="flex justify-center mb-4">
          <span className="bg-white/80 text-gray-600 text-[11px] px-3 py-1 rounded-lg shadow-sm">
            Hoje
          </span>
        </div>

        {/* Encryption notice */}
        <div className="flex justify-center mb-4">
          <span className="bg-[#fdf8c8] text-gray-600 text-[10px] px-3 py-1.5 rounded-lg text-center max-w-[280px]">
            🔒 As mensagens sao protegidas com criptografia. PrecificaAuto nao armazena seus dados pessoais.
          </span>
        </div>

        {messages.map((msg, i) => (
          <MessageBubble key={msg.id} message={msg} onSend={sendMessage} isLast={i === messages.length - 1} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick chips */}
      {_showChips && (
        <div className="bg-[#efeae2] border-t border-gray-200">
          <QuickChips onSend={sendMessage} />
        </div>
      )}

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="bg-[#f0f0f0] px-2 py-2 flex items-center gap-2 shrink-0">
        <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
          <span className="text-xl">😊</span>
        </button>
        <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Envie uma placa ou mensagem..."
          className="flex-1 px-4 py-2.5 bg-white rounded-full text-sm focus:outline-none"
          autoFocus
        />
        {input.trim() ? (
          <button
            type="submit"
            className="w-10 h-10 bg-[#075e54] rounded-full flex items-center justify-center hover:bg-[#064d44] transition-colors"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        ) : (
          <button
            type="button"
            className="w-10 h-10 bg-[#075e54] rounded-full flex items-center justify-center"
          >
            <Mic className="w-4 h-4 text-white" />
          </button>
        )}
      </form>
    </div>
  )
}
