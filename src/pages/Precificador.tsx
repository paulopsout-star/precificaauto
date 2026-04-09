import { useState } from 'react'
import { Search, Loader2, MapPin, Calendar, Gauge, Fuel, DollarSign, BarChart3, FileText } from 'lucide-react'
import Navbar from '../components/Navbar'
import ScoreBadge from '../components/ScoreBadge'
import VerdictBadge from '../components/VerdictBadge'
import { MOCK_VEHICLES, type VehicleAnalysis } from '../data/mockData'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(value)
}

function AnalysisCard({ vehicle }: { vehicle: VehicleAnalysis }) {
  const percentilePosition = ((vehicle.marketMedian - vehicle.marketMin) / (vehicle.marketMax - vehicle.marketMin)) * 100

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-gray-900 text-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-400">Placa: {vehicle.plate}</p>
            <h3 className="text-2xl font-bold mt-1">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-gray-300">{vehicle.version}</p>
          </div>
          <VerdictBadge verdict={vehicle.verdict} size="lg" />
        </div>

        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-300">
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {vehicle.year}/{vehicle.yearModel}</span>
          <span className="flex items-center gap-1"><Gauge className="w-4 h-4" /> {vehicle.kmEstimated.toLocaleString()} km</span>
          <span className="flex items-center gap-1"><Fuel className="w-4 h-4" /> {vehicle.fuel}</span>
          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {vehicle.region}</span>
        </div>
      </div>

      {/* Scores */}
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <ScoreBadge score={vehicle.priceScore} label="Preco" />
          <ScoreBadge score={vehicle.liquidityScore} label="Liquidez" />
          <ScoreBadge score={vehicle.riskScore} label="Risco" />
        </div>

        {/* FIPE */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Tabela FIPE</span>
            <span className="text-sm text-gray-400">Codigo: {vehicle.fipeCode}</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(vehicle.fipePrice)}</p>
        </div>

        {/* Market range */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Faixa de mercado ({vehicle.totalAds} anuncios na regiao)
          </h4>
          <div className="relative">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>P10: {formatCurrency(vehicle.marketMin)}</span>
              <span>P90: {formatCurrency(vehicle.marketMax)}</span>
            </div>
            <div className="w-full h-3 bg-gradient-to-r from-green-200 via-amber-200 to-red-200 rounded-full relative">
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-900 rounded-full border-2 border-white shadow-md"
                style={{ left: `${percentilePosition}%` }}
                title={`Mediana: ${formatCurrency(vehicle.marketMedian)}`}
              />
            </div>
            <p className="text-center text-xs text-gray-500 mt-1">
              Mediana: {formatCurrency(vehicle.marketMedian)}
            </p>
          </div>
        </div>

        {/* Recommended buy range */}
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 mb-6">
          <h4 className="text-sm font-semibold text-brand-800 mb-1 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Faixa de compra recomendada (P25-P40)
          </h4>
          <p className="text-2xl font-bold text-brand-700">
            {formatCurrency(vehicle.recommendedBuyMin)} - {formatCurrency(vehicle.recommendedBuyMax)}
          </p>
        </div>

        {/* Verdict explanation */}
        <div className={`rounded-xl p-4 ${
          vehicle.verdict === 'COMPRA' ? 'bg-green-50 border border-green-200' :
          vehicle.verdict === 'ATENCAO' ? 'bg-amber-50 border border-amber-200' :
          'bg-red-50 border border-red-200'
        }`}>
          <h4 className="text-sm font-semibold mb-2">Logica do veredicto</h4>
          {vehicle.verdict === 'COMPRA' && (
            <p className="text-sm text-green-800">
              Score preco ({vehicle.priceScore}) &ge; 65, liquidez ({vehicle.liquidityScore}) &ge; 60,
              risco ({vehicle.riskScore}) &ge; 70, {vehicle.totalAds} anuncios na regiao &ge; 10.
            </p>
          )}
          {vehicle.verdict === 'ATENCAO' && (
            <p className="text-sm text-amber-800">
              Um ou mais scores entre 40-64, ou entre 5-9 anuncios na regiao.
              Preco: {vehicle.priceScore}, Liquidez: {vehicle.liquidityScore}, Risco: {vehicle.riskScore}.
            </p>
          )}
          {vehicle.verdict === 'EVITAR' && (
            <p className="text-sm text-red-800">
              Um ou mais scores abaixo de 40 ou menos de 5 anuncios na regiao.
              Preco: {vehicle.priceScore}, Liquidez: {vehicle.liquidityScore}, Risco: {vehicle.riskScore}, Anuncios: {vehicle.totalAds}.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Precificador() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<VehicleAnalysis | null>(null)
  const [history, setHistory] = useState<VehicleAnalysis[]>([])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setResult(null)

    setTimeout(() => {
      const normalizedQuery = query.toUpperCase().replace(/[^A-Z0-9]/g, '')
      let vehicle: VehicleAnalysis

      if (normalizedQuery.includes('ABC') || normalizedQuery.includes('HB20')) {
        vehicle = MOCK_VEHICLES[0]
      } else if (normalizedQuery.includes('XYZ') || normalizedQuery.includes('CIVIC')) {
        vehicle = MOCK_VEHICLES[1]
      } else if (normalizedQuery.includes('DEF') || normalizedQuery.includes('GOL')) {
        vehicle = MOCK_VEHICLES[2]
      } else {
        vehicle = MOCK_VEHICLES[Math.floor(Math.random() * MOCK_VEHICLES.length)]
      }

      setResult(vehicle)
      setHistory((prev) => [vehicle, ...prev.filter(v => v.plate !== vehicle.plate)])
      setLoading(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-brand-600" />
            Precificador
          </h1>
          <p className="text-gray-500 mt-1">
            Envie a placa ou descricao do veiculo para receber a analise completa.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Digite a placa (ex: ABC1D23) ou descreva o veiculo..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-lg"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-8 py-4 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analisando...
                </>
              ) : (
                'Analisar'
              )}
            </button>
          </div>
          <div className="flex gap-2 mt-3">
            <span className="text-xs text-gray-400">Exemplos:</span>
            {['ABC1D23', 'HB20 2021', 'Civic EXL 2020'].map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setQuery(ex)}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        </form>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-16">
            <Loader2 className="w-12 h-12 text-brand-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Coletando dados de mercado...</p>
            <p className="text-sm text-gray-400 mt-1">OLX, Webmotors, iCarros, FIPE, DETRAN</p>
            <div className="max-w-xs mx-auto mt-4">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-brand-600 h-1.5 rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        )}

        {/* Result */}
        {result && !loading && <AnalysisCard vehicle={result} />}

        {/* History */}
        {history.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-400" />
              Historico de consultas
            </h3>
            <div className="space-y-3">
              {history.map((v, i) => (
                <button
                  key={`${v.plate}-${i}`}
                  onClick={() => setResult(v)}
                  className="w-full flex items-center justify-between bg-white rounded-xl p-4 border border-gray-100 hover:border-brand-200 transition-colors text-left"
                >
                  <div>
                    <p className="font-medium text-gray-900">{v.brand} {v.model} {v.version}</p>
                    <p className="text-sm text-gray-500">{v.plate} - {v.year}/{v.yearModel}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-700">Score: {v.priceScore}</span>
                    <VerdictBadge verdict={v.verdict} size="sm" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
