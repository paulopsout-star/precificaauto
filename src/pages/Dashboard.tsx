import { Link } from 'react-router-dom'
import {
  BarChart3, Shield, Search, Users, ArrowRight, TrendingUp,
  TrendingDown, Car, Hash, DollarSign, Activity
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import Navbar from '../components/Navbar'

const monthlyData = [
  { month: 'Set', consultas: 12 },
  { month: 'Out', consultas: 28 },
  { month: 'Nov', consultas: 45 },
  { month: 'Dez', consultas: 38 },
  { month: 'Jan', consultas: 52 },
]

const verdictData = [
  { name: 'Compra', value: 32, color: '#22c55e' },
  { name: 'Atencao', value: 14, color: '#f59e0b' },
  { name: 'Evitar', value: 6, color: '#ef4444' },
]

export default function Dashboard() {
  const stats = [
    { label: 'Consultas este mes', value: '52', change: '+36%', up: true, icon: Hash, color: 'bg-blue-50 text-blue-600' },
    { label: 'Economia estimada', value: 'R$ 16.400', change: '+R$ 3.200', up: true, icon: DollarSign, color: 'bg-green-50 text-green-600' },
    { label: 'Veiculos comprados', value: '5', change: '+2', up: true, icon: Car, color: 'bg-purple-50 text-purple-600' },
    { label: 'Preco medio abaixo mercado', value: 'R$ 3.280', change: '-5%', up: true, icon: TrendingDown, color: 'bg-amber-50 text-amber-600' },
  ]

  const quickActions = [
    { title: 'Precificador', desc: 'Analisar veiculo por placa', icon: BarChart3, to: '/precificador', color: 'bg-blue-500' },
    { title: 'Checklist', desc: 'Verificar pendencias', icon: Shield, to: '/checklist', color: 'bg-amber-500' },
    { title: 'Buscador', desc: 'Monitorar estoque', icon: Search, to: '/buscador', color: 'bg-purple-500' },
    { title: 'Rede', desc: 'Comprar/vender entre lojistas', icon: Users, to: '/rede', color: 'bg-brand-500' },
  ]

  const recentAnalyses = [
    { plate: 'ABC1D23', model: 'HB20 1.0 Sense', verdict: 'COMPRA', score: 72, time: '2h atras' },
    { plate: 'XYZ4E56', model: 'Civic EXL 2.0', verdict: 'ATENCAO', score: 58, time: '5h atras' },
    { plate: 'DEF7G89', model: 'Gol 1.0 MPI', verdict: 'EVITAR', score: 35, time: '1d atras' },
    { plate: 'GHI8J01', model: 'Onix Premier', verdict: 'COMPRA', score: 81, time: '1d atras' },
    { plate: 'KLM2N34', model: 'Corolla XEi', verdict: 'COMPRA', score: 77, time: '2d atras' },
  ]

  const verdictColor = (v: string) => {
    if (v === 'COMPRA') return 'bg-green-100 text-green-700'
    if (v === 'ATENCAO') return 'bg-amber-100 text-amber-700'
    return 'bg-red-100 text-red-700'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Boa tarde, Joao</h1>
          <p className="text-gray-500 mt-1">Plano Profissional - 28/80 consultas usadas este mes</p>
          <div className="mt-2 w-full max-w-md bg-gray-200 rounded-full h-2">
            <div className="bg-brand-600 h-2 rounded-full" style={{ width: '35%' }} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-medium flex items-center gap-1 ${s.up ? 'text-green-600' : 'text-red-600'}`}>
                  {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {s.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((a) => (
            <Link
              key={a.title}
              to={a.to}
              className="group bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-200 transition-all"
            >
              <div className={`w-10 h-10 ${a.color} rounded-lg flex items-center justify-center mb-3`}>
                <a.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-1">
                {a.title}
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-sm text-gray-500 mt-1">{a.desc}</p>
            </Link>
          ))}
        </div>

        {/* Charts + Recent */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Bar chart */}
          <div className="lg:col-span-1 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-gray-400" />
              Consultas por mes
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="consultas" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Veredictos</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={verdictData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                >
                  {verdictData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {verdictData.map((d) => (
                <div key={d.name} className="flex items-center gap-1 text-xs text-gray-600">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.name} ({d.value})
                </div>
              ))}
            </div>
          </div>

          {/* Recent analyses */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Ultimas analises</h3>
            <div className="space-y-3">
              {recentAnalyses.map((a) => (
                <div key={a.plate} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{a.model}</p>
                    <p className="text-xs text-gray-400">{a.plate} - {a.time}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-700">{a.score}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${verdictColor(a.verdict)}`}>
                      {a.verdict}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly summary */}
        <div className="mt-8 bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-6 text-white">
          <h3 className="font-bold text-lg mb-2">Resumo do mes</h3>
          <p className="text-brand-100">
            Voce consultou <span className="font-bold text-white">52 carros</span>, comprou{' '}
            <span className="font-bold text-white">5</span>. Sua compra media ficou{' '}
            <span className="font-bold text-white">R$ 3.280 abaixo</span> do mercado.
            Economia total estimada: <span className="font-bold text-white">R$ 16.400</span>.
          </p>
        </div>
      </div>
    </div>
  )
}
