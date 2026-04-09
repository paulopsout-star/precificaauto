import { useState } from 'react'
import {
  Users, Plus, MapPin, Calendar, Gauge, DollarSign,
  ArrowLeftRight, MessageSquare, Package, ShoppingCart, Store
} from 'lucide-react'
import Navbar from '../components/Navbar'

interface InventoryItem {
  id: string
  model: string
  version: string
  year: number
  km: number
  price: number
  region: string
  ttl: number
  status: 'ativo' | 'vendido'
}

const mockInventory: InventoryItem[] = [
  { id: '1', model: 'Honda Civic EXL 2.0 CVT', version: 'EXL', year: 2020, km: 52000, price: 98000, region: 'SP - Capital', ttl: 25, status: 'ativo' },
  { id: '2', model: 'Hyundai Creta Prestige 2.0', version: 'Prestige', year: 2022, km: 28000, price: 115000, region: 'SP - Interior', ttl: 18, status: 'ativo' },
  { id: '3', model: 'Toyota Corolla XEi 2.0', version: 'XEi', year: 2021, km: 35000, price: 125000, region: 'SP - Capital', ttl: 0, status: 'vendido' },
]

const mockMatches = [
  {
    id: '1',
    type: 'compra' as const,
    vehicle: 'HB20 1.6 Vision 2022',
    seller: 'Auto Loja Premium',
    city: 'Campinas - SP',
    price: 69900,
    matchDate: '2024-01-25',
    status: 'novo',
  },
  {
    id: '2',
    type: 'venda' as const,
    vehicle: 'Honda Civic EXL 2.0 CVT 2020',
    buyer: 'Revenda Rapida',
    city: 'Sorocaba - SP',
    price: 98000,
    matchDate: '2024-01-24',
    status: 'contatado',
  },
  {
    id: '3',
    type: 'compra' as const,
    vehicle: 'Fiat Pulse Drive 1.3 CVT 2023',
    seller: 'Veiculos do Sul',
    city: 'Curitiba - PR',
    price: 89500,
    matchDate: '2024-01-22',
    status: 'novo',
  },
]

function formatCurrency(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(v)
}

export default function Rede() {
  const [tab, setTab] = useState<'matches' | 'inventory' | 'add'>('matches')
  const [inventory, setInventory] = useState(mockInventory)
  const [form, setForm] = useState({ model: '', year: '2022', km: '30000', price: '80000', region: 'SP - Interior' })

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault()
    const newItem: InventoryItem = {
      id: String(Date.now()),
      model: form.model,
      version: '',
      year: Number(form.year),
      km: Number(form.km),
      price: Number(form.price),
      region: form.region,
      ttl: 30,
      status: 'ativo',
    }
    setInventory((prev) => [newItem, ...prev])
    setTab('inventory')
    setForm({ model: '', year: '2022', km: '30000', price: '80000', region: 'SP - Interior' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-brand-600" />
              Rede de Lojistas
            </h1>
            <p className="text-gray-500 mt-1">
              Compre e venda entre lojistas. Match bidirecional automatico.
            </p>
          </div>
          <button
            onClick={() => setTab('add')}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Cadastrar veiculo
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-gray-100 text-center shadow-sm">
            <Store className="w-6 h-6 text-brand-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">47</p>
            <p className="text-xs text-gray-500">Lojistas na rede</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 text-center shadow-sm">
            <Package className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">128</p>
            <p className="text-xs text-gray-500">Veiculos disponiveis</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 text-center shadow-sm">
            <ArrowLeftRight className="w-6 h-6 text-amber-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">23</p>
            <p className="text-xs text-gray-500">Matches este mes</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setTab('matches')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              tab === 'matches' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            Matches ({mockMatches.length})
          </button>
          <button
            onClick={() => setTab('inventory')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              tab === 'inventory' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            Meu estoque ({inventory.length})
          </button>
          <button
            onClick={() => setTab('add')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              tab === 'add' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            Cadastrar
          </button>
        </div>

        {/* Matches */}
        {tab === 'matches' && (
          <div className="space-y-4">
            {mockMatches.map((match) => (
              <div key={match.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      match.type === 'compra' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {match.type === 'compra' ? <ShoppingCart className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        {match.type === 'compra' ? 'Oportunidade de compra' : 'Interesse no seu veiculo'}
                      </p>
                      <h3 className="font-bold text-gray-900">{match.vehicle}</h3>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    match.status === 'novo' ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {match.status === 'novo' ? 'Novo' : 'Contatado'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {match.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    {formatCurrency(match.price)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {match.matchDate}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    {match.type === 'compra' ? `Contatar ${(match as any).seller}` : `Contatar ${(match as any).buyer}`}
                  </button>
                  <button className="py-2.5 px-4 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                    Ver analise
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Inventory */}
        {tab === 'inventory' && (
          <div className="space-y-4">
            {inventory.map((item) => (
              <div key={item.id} className={`bg-white rounded-xl p-5 border shadow-sm ${
                item.status === 'vendido' ? 'border-gray-200 opacity-60' : 'border-gray-100'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{item.model}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {item.year}</span>
                      <span className="flex items-center gap-1"><Gauge className="w-3.5 h-3.5" /> {item.km.toLocaleString()} km</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {item.region}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(item.price)}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {item.status === 'ativo' ? `${item.ttl}d restantes` : 'Vendido'}
                    </span>
                  </div>
                </div>
                {item.status === 'ativo' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setInventory(prev => prev.map(i => i.id === item.id ? { ...i, status: 'vendido' as const, ttl: 0 } : i))}
                      className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      Marcar vendido
                    </button>
                    <button
                      onClick={() => setInventory(prev => prev.filter(i => i.id !== item.id))}
                      className="text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                    >
                      Remover
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add form */}
        {tab === 'add' && (
          <form onSubmit={handleAddVehicle} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Cadastrar veiculo para repasse</h3>
            <p className="text-sm text-gray-500 mb-6">
              Seu veiculo ficara visivel apenas para compradores com intencao de compra compativel.
              Nao e anuncio publico.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Veiculo</label>
                <input
                  type="text"
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  placeholder="Ex: Civic 2020 EXL CVT"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
                <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">KM</label>
                <input type="number" value={form.km} onChange={(e) => setForm({ ...form, km: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preco de repasse (R$)</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Regiao</label>
                <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm">
                  <option>SP - Interior</option>
                  <option>SP - Capital</option>
                  <option>RJ - Capital</option>
                  <option>MG - Interior</option>
                  <option>PR - Capital</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors">
              Cadastrar na rede
            </button>
          </form>
        )}

        {/* How it works */}
        <div className="mt-8 bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-6 text-white">
          <h3 className="font-bold text-lg mb-4">Como funciona a rede</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-brand-100 mb-2">Vendedor</h4>
              <ul className="text-sm text-brand-100 space-y-1.5">
                <li>- Cadastre seu veiculo para repasse</li>
                <li>- Visivel apenas para compradores compativeis</li>
                <li>- Receba alerta quando houver match</li>
                <li>- Conexao direta via WhatsApp</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-brand-100 mb-2">Comprador</h4>
              <ul className="text-sm text-brand-100 space-y-1.5">
                <li>- Cadastre sua intencao de compra</li>
                <li>- Sistema busca na rede automaticamente</li>
                <li>- Match com analise completa embutida</li>
                <li>- Ambas as partes notificadas simultaneamente</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
