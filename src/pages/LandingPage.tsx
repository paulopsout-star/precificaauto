import { Link } from 'react-router-dom'
import {
  Car, BarChart3, Shield, Search, Users, Zap, MessageSquare,
  ArrowRight, Check, Minus, ChevronRight, Clock, Bell
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { PLANS } from '../data/mockData'

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-warm-50 to-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.08),transparent_50%)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-50 text-brand-700 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Beta fechado - Canal do Repasse
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Decisao inteligente{' '}
            <span className="text-brand-600">em 30 segundos</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Analise de preco, liquidez, risco documental e buscador de estoque
            para lojistas de veiculos usados — tudo via{' '}
            <span className="font-semibold text-gray-800">WhatsApp</span>, sem instalar nada.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/chat"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/25 hover:shadow-xl hover:shadow-brand-600/30 hover:-translate-y-0.5"
            >
              <MessageSquare className="w-5 h-5" />
              Testar no WhatsApp (demo)
            </Link>
            <Link
              to="/chat"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              Ver demo interativa
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-500" />
              Resposta em &lt;30s
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-500" />
              Checklist documental
            </div>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-brand-500" />
              Alertas proativos
            </div>
          </div>
        </div>

        {/* Mock WhatsApp Card */}
        <div className="mt-16 max-w-sm mx-auto">
          <div className="bg-[#075e54] rounded-t-2xl px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-400 rounded-full flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div className="text-white">
              <p className="font-semibold text-sm">PrecificaAuto</p>
              <p className="text-xs text-green-200">online</p>
            </div>
          </div>
          <div className="bg-[#ece5dd] rounded-b-2xl p-4 space-y-3">
            <div className="bg-white rounded-lg p-3 max-w-[80%] shadow-sm">
              <p className="text-sm text-gray-800">ABC1D23</p>
              <p className="text-xs text-gray-400 text-right mt-1">10:32</p>
            </div>
            <div className="bg-[#dcf8c6] rounded-lg p-3 ml-auto max-w-[90%] shadow-sm">
              <p className="text-xs font-bold text-brand-800 mb-2">HB20 1.0 Sense 2021/22</p>
              <div className="space-y-1 text-xs text-gray-700">
                <p>FIPE: R$ 72.500</p>
                <p>Mercado: R$ 62.000 - R$ 79.000</p>
                <p>Preco: <span className="font-bold text-green-700">72/100</span> | Liquidez: <span className="font-bold text-green-700">85/100</span></p>
                <p>Compra recomendada: <span className="font-bold">R$ 63k - R$ 67k</span></p>
                <div className="mt-2 inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-bold">
                  COMPRA
                </div>
              </div>
              <p className="text-xs text-gray-400 text-right mt-1">10:32</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Features() {
  const features = [
    {
      icon: BarChart3,
      title: 'Precificador',
      desc: 'Preco justo, score de liquidez, veredicto de compra e faixa de negociacao em segundos.',
      color: 'bg-blue-50 text-blue-600',
      link: '/precificador',
    },
    {
      icon: Shield,
      title: 'Checklist Documental',
      desc: 'Multas, IPVA, restricoes, recall e sinistro verificados automaticamente por placa.',
      color: 'bg-amber-50 text-amber-600',
      link: '/checklist',
    },
    {
      icon: Search,
      title: 'Buscador de Estoque',
      desc: 'Registre o que quer comprar. O sistema monitora 24h e envia alertas quando encontra.',
      color: 'bg-purple-50 text-purple-600',
      link: '/buscador',
    },
    {
      icon: Users,
      title: 'Rede de Lojistas',
      desc: 'Compre e venda entre lojistas da rede. Match bidirecional automatico via WhatsApp.',
      color: 'bg-brand-50 text-brand-600',
      link: '/rede',
    },
  ]

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            4 funcionalidades, 1 canal
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Tudo entregue direto no WhatsApp. Sem app novo, sem desktop, sem cadastro.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f) => (
            <Link
              key={f.title}
              to={f.link}
              className="group p-6 rounded-2xl border border-gray-100 hover:border-brand-200 hover:shadow-lg transition-all"
            >
              <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-4`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                {f.title}
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-gray-600">{f.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { num: '01', title: 'Mande a placa', desc: 'No WhatsApp, envie a placa ou descreva o veiculo.' },
    { num: '02', title: 'Analise instantanea', desc: 'Em <30s receba preco, liquidez, risco e veredicto.' },
    { num: '03', title: 'Decida com confianca', desc: 'Faixa de compra recomendada e checklist documental.' },
    { num: '04', title: 'Alertas proativos', desc: 'Cadastre o que procura e receba alertas automaticos.' },
  ]

  return (
    <section className="py-24 bg-warm-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Como funciona</h2>
          <p className="mt-4 text-lg text-gray-600">
            Do WhatsApp a decisao em menos de 30 segundos
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s) => (
            <div key={s.num} className="text-center">
              <div className="w-14 h-14 bg-brand-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                {s.num}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-gray-600 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Metrics() {
  const metrics = [
    { value: '<30s', label: 'Tempo de resposta' },
    { value: '60-75%', label: 'Margem bruta' },
    { value: '99,5%', label: 'Uptime alvo' },
    { value: '4h', label: 'Cache de mercado' },
  ]

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((m) => (
            <div key={m.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-brand-400">{m.value}</p>
              <p className="mt-2 text-gray-400 text-sm">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Planos simples, sem surpresa
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Comece com 3 consultas gratis. Planos a partir de R$ 97/mes.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 flex flex-col ${
                plan.highlighted
                  ? 'border-2 border-brand-600 shadow-xl shadow-brand-100 bg-white'
                  : 'border border-gray-200 bg-white'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand-600 text-white text-xs font-bold rounded-full">
                  mais popular
                </div>
              )}

              <div className="mb-6">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{plan.name}</p>
                <p className="text-sm text-gray-600 italic">{plan.subtitle}</p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 text-sm">{plan.period}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{plan.description}</p>
              </div>

              {Object.entries(plan.features).map(([category, items]) => (
                <div key={category} className="mb-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    {category === 'precificador' ? 'Precificador' : category === 'checklist' ? 'Checklist' : 'Buscador + Rede'}
                  </p>
                  <ul className="space-y-1.5">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        {item.included === true ? (
                          <Check className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                        ) : item.included === 'partial' ? (
                          <Minus className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        ) : (
                          <Minus className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" />
                        )}
                        <span className={item.included === false ? 'text-gray-400' : 'text-gray-700'}>
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="mt-auto pt-4">
                <button
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    plan.highlighted
                      ? 'bg-brand-600 text-white hover:bg-brand-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </button>
                <p className="text-xs text-gray-400 mt-3 text-center">{plan.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="py-24 bg-brand-600">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Pronto para decidir melhor?
        </h2>
        <p className="mt-4 text-lg text-brand-100">
          3 consultas gratis. Sem cadastro. Sem instalar nada.
          Comece agora pelo WhatsApp.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/chat"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-700 font-bold rounded-xl hover:bg-brand-50 transition-all shadow-lg"
          >
            <MessageSquare className="w-5 h-5" />
            Abrir simulador WhatsApp
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Metrics />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  )
}
