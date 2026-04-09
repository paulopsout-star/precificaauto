import { useState } from 'react'
import { Search, Loader2, Shield, CheckCircle, AlertTriangle, XCircle, FileDown } from 'lucide-react'
import Navbar from '../components/Navbar'
import ScoreBadge from '../components/ScoreBadge'
import { MOCK_VEHICLES, MOCK_CHECKLIST, type ChecklistItem } from '../data/mockData'

function StatusIcon({ status }: { status: ChecklistItem['status'] }) {
  if (status === 'ok') return <CheckCircle className="w-5 h-5 text-green-500" />
  if (status === 'warning') return <AlertTriangle className="w-5 h-5 text-amber-500" />
  if (status === 'danger') return <XCircle className="w-5 h-5 text-red-500" />
  return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
}

function statusBg(status: ChecklistItem['status']) {
  if (status === 'ok') return 'bg-green-50 border-green-100'
  if (status === 'warning') return 'bg-amber-50 border-amber-100'
  if (status === 'danger') return 'bg-red-50 border-red-100'
  return 'bg-gray-50 border-gray-100'
}

export default function Checklist() {
  const [plate, setPlate] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ items: ChecklistItem[]; riskScore: number; vehicle: typeof MOCK_VEHICLES[0] } | null>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!plate.trim()) return

    setLoading(true)
    setResult(null)

    setTimeout(() => {
      const vehicle = MOCK_VEHICLES[0]
      const riskScore = 72
      setResult({ items: MOCK_CHECKLIST, riskScore, vehicle })
      setLoading(false)
    }, 1800)
  }

  const okCount = result?.items.filter(i => i.status === 'ok').length ?? 0
  const warnCount = result?.items.filter(i => i.status === 'warning').length ?? 0
  const dangerCount = result?.items.filter(i => i.status === 'danger').length ?? 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-amber-500" />
            Checklist Documental
          </h1>
          <p className="text-gray-500 mt-1">
            Verifique pendencias antes de comprar. Consulta automatica por placa.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                placeholder="Digite a placa do veiculo (ex: ABC1D23)"
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !plate.trim()}
              className="px-8 py-4 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verificando...
                </>
              ) : (
                'Verificar'
              )}
            </button>
          </div>
        </form>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Consultando fontes...</p>
            <p className="text-sm text-gray-400 mt-1">DETRAN, DENATRAN, Restricoes judiciais e financeiras</p>
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Vehicle info */}
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Veiculo</p>
                  <h3 className="text-xl font-bold text-gray-900">
                    {result.vehicle.brand} {result.vehicle.model} {result.vehicle.version}
                  </h3>
                  <p className="text-sm text-gray-500">{result.vehicle.year}/{result.vehicle.yearModel} - {result.vehicle.plate}</p>
                </div>
                <ScoreBadge score={result.riskScore} label="Risco" size="lg" />
              </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
                <p className="text-2xl font-bold text-green-700">{okCount}</p>
                <p className="text-xs text-green-600 font-medium">OK</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-100">
                <p className="text-2xl font-bold text-amber-700">{warnCount}</p>
                <p className="text-xs text-amber-600 font-medium">Atencao</p>
              </div>
              <div className="bg-red-50 rounded-xl p-4 text-center border border-red-100">
                <p className="text-2xl font-bold text-red-700">{dangerCount}</p>
                <p className="text-xs text-red-600 font-medium">Critico</p>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              {result.items.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-4 p-4 rounded-xl border ${statusBg(item.status)}`}
                >
                  <StatusIcon status={item.status} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Risk impact */}
            <div className={`rounded-xl p-5 border ${
              result.riskScore >= 70
                ? 'bg-green-50 border-green-200'
                : result.riskScore >= 40
                ? 'bg-amber-50 border-amber-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <h4 className="font-semibold mb-2">Impacto no veredicto</h4>
              {result.riskScore >= 70 && (
                <p className="text-sm text-green-800">
                  Score 70-100: sem pendencias criticas. Nao impacta negativamente o veredicto.
                </p>
              )}
              {result.riskScore >= 40 && result.riskScore < 70 && (
                <p className="text-sm text-amber-800">
                  Score 40-69: pendencias menores. Veredicto vai para ATENCAO automaticamente.
                </p>
              )}
              {result.riskScore < 40 && (
                <p className="text-sm text-red-800">
                  Score menor que 40: restricao judicial, financeira ou recall ativo.
                  Veredicto vai para EVITAR independente dos outros scores.
                </p>
              )}
            </div>

            {/* Download PDF */}
            <button className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors">
              <FileDown className="w-5 h-5" />
              Baixar laudo PDF
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
