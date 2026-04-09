import { useState } from 'react'
import {
  Search, Plus, Bell, Pause, Play, Trash2, MapPin, Calendar,
  Gauge, Clock, Filter, ExternalLink
} from 'lucide-react'
import Navbar from '../components/Navbar'
import { MOCK_INTENTS, MOCK_NETWORK, type PurchaseIntent, type NetworkVehicle } from '../data/mockData'

function formatCurrency(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(v)
}

function sourceLabel(s: NetworkVehicle['source']) {
  const labels = {
    rede: { text: 'Rede PrecificaAuto', bg: 'bg-brand-100 text-brand-700' },
    canal_repasse: { text: 'Canal do Repasse', bg: 'bg-blue-100 text-blue-700' },
    olx: { text: 'OLX', bg: 'bg-orange-100 text-orange-700' },
    webmotors: { text: 'Webmotors', bg: 'bg-purple-100 text-purple-700' },
  }
  return labels[s]
}

function IntentCard({ intent, onToggle, onDelete }: { intent: PurchaseIntent; onToggle: () => void; onDelete: () => void }) {
  return (
    <div className={`bg-white rounded-xl p-5 border ${intent.status === 'ativo' ? 'border-brand-200' : 'border-gray-200'} shadow-sm`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-gray-900">{intent.brand} {intent.model}</h3>
          <p className="text-sm text-gray-500">
            {intent.yearMin}-{intent.yearMax} | ate {intent.kmMax.toLocaleString()} km | ate {formatCurrency(intent.priceMax)}
          </p>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
          intent.status === 'ativo' ? 'bg-green-100 text-green-700' :
          intent.status === 'pausado' ? 'bg-gray-100 text-gray-600' :
          'bg-red-100 text-red-600'
        }`}>
          {intent.status}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {intent.region}</span>
        <span className="flex items-center gap-1"><Filter className="w-3 h-3" /> Score min: {intent.minScore}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Expira: {intent.expiresAt}</span>
        <span className="flex items-center gap-1"><Bell className="w-3 h-3" /> {intent.matchCount} matches</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onToggle}
          className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            intent.status === 'ativo'
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
          }`}
        >
          {intent.status === 'ativo' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          {intent.status === 'ativo' ? 'Pausar' : 'Reativar'}
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
        >
          <Trash2 className="w-3 h-3" /> Remover
        </button>
      </div>
    </div>
  )
}

function MatchCard({ vehicle }: { vehicle: NetworkVehicle }) {
  const src = sourceLabel(vehicle.source)

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:border-brand-200 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-gray-900">{vehicle.brand} {vehicle.model}</h3>
          <p className="text-sm text-gray-600">{vehicle.version}</p>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${src.bg}`}>
          {src.text}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {vehicle.year}</span>
        <span className="flex items-center gap-1"><Gauge className="w-3.5 h-3.5" /> {vehicle.km.toLocaleString()} km</span>
        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {vehicle.sellerCity}</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-xl font-bold text-gray-900">{formatCurrency(vehicle.price)}</p>
        <div className="flex gap-2">
          <div className={`text-xs font-bold px-2 py-1 rounded-full ${vehicle.priceScore >= 65 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            Preco: {vehicle.priceScore}
          </div>
          <div className={`text-xs font-bold px-2 py-1 rounded-full ${vehicle.liquidityScore >= 60 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            Liquidez: {vehicle.liquidityScore}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors">
          Contatar vendedor
          <ExternalLink className="w-4 h-4" />
        </button>
        <button className="py-2.5 px-4 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors">
          Ver analise
        </button>
      </div>
    </div>
  )
}

export default function Buscador() {
  const [intents, setIntents] = useState<PurchaseIntent[]>(MOCK_INTENTS)
  const [showForm, setShowForm] = useState(false)
  const [tab, setTab] = useState<'intents' | 'matches'>('matches')

  const [form, setForm] = useState({
    brand: '', model: '', yearMin: '2021', yearMax: '2024',
    kmMax: '60000', priceMax: '80000', region: 'SP - Interior', minScore: '65'
  })

  const handleAddIntent = (e: React.FormEvent) => {
    e.preventDefault()
    const newIntent: PurchaseIntent = {
      id: String(Date.now()),
      brand: form.brand,
      model: form.model,
      yearMin: Number(form.yearMin),
      yearMax: Number(form.yearMax),
      kmMax: Number(form.kmMax),
      priceMax: Number(form.priceMax),
      region: form.region,
      minScore: Number(form.minScore),
      status: 'ativo',
      createdAt: new Date().toISOString().split('T')[0],
      expiresAt: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      matchCount: 0,
    }
    setIntents((prev) => [newIntent, ...prev])
    setShowForm(false)
    setForm({ brand: '', model: '', yearMin: '2021', yearMax: '2024', kmMax: '60000', priceMax: '80000', region: 'SP - Interior', minScore: '65' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Search className="w-6 h-6 text-purple-500" />
              Buscador de Estoque
            </h1>
            <p className="text-gray-500 mt-1">
              Cadastre o que procura e receba alertas quando encontrarmos.
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova intencao
          </button>
        </div>

        {/* New intent form */}
        {showForm && (
          <form onSubmit={handleAddIntent} className="bg-white rounded-xl p-6 border border-gray-200 mb-8 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Cadastrar intencao de compra</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                <input
                  type="text"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  placeholder="Ex: Hyundai"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                <input
                  type="text"
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  placeholder="Ex: HB20"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ano minimo</label>
                <input type="number" value={form.yearMin} onChange={(e) => setForm({ ...form, yearMin: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ano maximo</label>
                <input type="number" value={form.yearMax} onChange={(e) => setForm({ ...form, yearMax: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">KM maximo</label>
                <input type="number" value={form.kmMax} onChange={(e) => setForm({ ...form, kmMax: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preco maximo (R$)</label>
                <input type="number" value={form.priceMax} onChange={(e) => setForm({ ...form, priceMax: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Regiao</label>
                <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <option>SP - Interior</option>
                  <option>SP - Capital</option>
                  <option>RJ - Capital</option>
                  <option>MG - Interior</option>
                  <option>PR - Capital</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Score minimo</label>
                <input type="number" value={form.minScore} onChange={(e) => setForm({ ...form, minScore: e.target.value })} min={0} max={100} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-6 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors">
                Cadastrar intencao
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setTab('matches')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              tab === 'matches' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Veiculos encontrados ({MOCK_NETWORK.length})
          </button>
          <button
            onClick={() => setTab('intents')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              tab === 'intents' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Minhas intencoes ({intents.length})
          </button>
        </div>

        {/* Content */}
        {tab === 'matches' && (
          <div className="grid sm:grid-cols-2 gap-4">
            {MOCK_NETWORK.map((v) => (
              <MatchCard key={v.id} vehicle={v} />
            ))}
          </div>
        )}

        {tab === 'intents' && (
          <div className="space-y-4">
            {intents.map((intent) => (
              <IntentCard
                key={intent.id}
                intent={intent}
                onToggle={() => {
                  setIntents((prev) =>
                    prev.map((i) =>
                      i.id === intent.id
                        ? { ...i, status: i.status === 'ativo' ? 'pausado' : 'ativo' }
                        : i
                    )
                  )
                }}
                onDelete={() => setIntents((prev) => prev.filter((i) => i.id !== intent.id))}
              />
            ))}
          </div>
        )}

        {/* Sources info */}
        <div className="mt-8 bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Fontes monitoradas</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
              <h4 className="font-semibold text-blue-800 text-sm">Canal do Repasse</h4>
              <p className="text-xs text-blue-600 mt-1">Integracao nativa do grupo. Seminovos com procedencia.</p>
            </div>
            <div className="p-4 rounded-lg bg-orange-50 border border-orange-100">
              <h4 className="font-semibold text-orange-800 text-sm">Portais publicos</h4>
              <p className="text-xs text-orange-600 mt-1">OLX, Webmotors, iCarros. Cobertura ampla de mercado.</p>
            </div>
            <div className="p-4 rounded-lg bg-brand-50 border border-brand-100">
              <h4 className="font-semibold text-brand-800 text-sm">Rede PrecificaAuto</h4>
              <p className="text-xs text-brand-600 mt-1">Lojistas cadastram estoque. Match bidirecional.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
