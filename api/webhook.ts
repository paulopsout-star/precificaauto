import type { VercelRequest, VercelResponse } from '@vercel/node'

// ─── CONFIG ───
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'precificaauto_verify_2024'
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || ''
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || ''

// ─── TYPES ───
interface VehicleData {
  plate: string; brand: string; model: string; version: string
  year: number; yearModel: number; color: string; fuel: string
  fipeCode: string; fipePrice: number
  marketMin: number; marketMax: number; marketMedian: number; totalAds: number
  region: string; priceScore: number; liquidityScore: number; riskScore: number
  recommendedBuyMin: number; recommendedBuyMax: number
  verdict: 'COMPRA' | 'ATENCAO' | 'EVITAR'; km: number
}

interface ChecklistItem { label: string; status: 'ok' | 'warning' | 'danger'; detail: string }
interface ChecklistData { vehicle: VehicleData; riskScore: number; items: ChecklistItem[] }
interface IntentData { brand: string; model: string; yearMin: number; yearMax: number; kmMax: number; priceMax: number; region: string }
interface MatchData { brand: string; model: string; vehicle: string; seller: string; city: string; price: number; source: string; priceScore: number; liquidityScore: number; km: number; year: number }

// ─── VEHICLE DATABASE ───
const VEHICLES_DB: Record<string, VehicleData> = {
  'ABC1D23': {
    plate: 'ABC1D23', brand: 'Hyundai', model: 'HB20', version: '1.0 Sense', year: 2021, yearModel: 2022,
    color: 'Branco', fuel: 'Flex', fipeCode: '015270-0', fipePrice: 72500,
    marketMin: 62000, marketMax: 79000, marketMedian: 69500, totalAds: 47,
    region: 'SP - Interior', priceScore: 72, liquidityScore: 85, riskScore: 90,
    recommendedBuyMin: 63000, recommendedBuyMax: 67000, verdict: 'COMPRA', km: 45000,
  },
  'XYZ4E56': {
    plate: 'XYZ4E56', brand: 'Honda', model: 'Civic', version: 'EXL 2.0 CVT', year: 2020, yearModel: 2020,
    color: 'Prata', fuel: 'Flex', fipeCode: '014252-6', fipePrice: 115000,
    marketMin: 98000, marketMax: 125000, marketMedian: 108000, totalAds: 23,
    region: 'SP - Capital', priceScore: 58, liquidityScore: 62, riskScore: 45,
    recommendedBuyMin: 99000, recommendedBuyMax: 105000, verdict: 'ATENCAO', km: 52000,
  },
  'DEF7G89': {
    plate: 'DEF7G89', brand: 'Volkswagen', model: 'Gol', version: '1.0 MPI', year: 2018, yearModel: 2019,
    color: 'Vermelho', fuel: 'Flex', fipeCode: '005337-0', fipePrice: 48000,
    marketMin: 38000, marketMax: 52000, marketMedian: 44000, totalAds: 3,
    region: 'MG - Interior', priceScore: 35, liquidityScore: 28, riskScore: 30,
    recommendedBuyMin: 39000, recommendedBuyMax: 42000, verdict: 'EVITAR', km: 98000,
  },
  'GHI8J01': {
    plate: 'GHI8J01', brand: 'Toyota', model: 'Corolla', version: 'XEi 2.0 Flex', year: 2022, yearModel: 2022,
    color: 'Preto', fuel: 'Flex', fipeCode: '015588-2', fipePrice: 132000,
    marketMin: 118000, marketMax: 142000, marketMedian: 128000, totalAds: 31,
    region: 'SP - Capital', priceScore: 77, liquidityScore: 88, riskScore: 95,
    recommendedBuyMin: 119000, recommendedBuyMax: 125000, verdict: 'COMPRA', km: 28000,
  },
  'JKL2M34': {
    plate: 'JKL2M34', brand: 'Fiat', model: 'Pulse', version: 'Drive 1.3 CVT', year: 2023, yearModel: 2023,
    color: 'Cinza', fuel: 'Flex', fipeCode: '001523-8', fipePrice: 95000,
    marketMin: 82000, marketMax: 99000, marketMedian: 89500, totalAds: 8,
    region: 'PR - Capital', priceScore: 48, liquidityScore: 55, riskScore: 80,
    recommendedBuyMin: 83000, recommendedBuyMax: 87000, verdict: 'ATENCAO', km: 18000,
  },
}

// ─── CHECKLIST DATABASE ───
const CHECKLIST_DB: Record<string, ChecklistData> = {
  'ABC1D23': {
    vehicle: VEHICLES_DB['ABC1D23'], riskScore: 90,
    items: [
      { label: 'Multas DETRAN', status: 'ok', detail: 'Nenhuma multa pendente' },
      { label: 'IPVA 2024', status: 'ok', detail: 'Pago em dia' },
      { label: 'Licenciamento', status: 'ok', detail: 'Vigente ate 12/2024' },
      { label: 'Restricoes judiciais', status: 'ok', detail: 'Nenhuma' },
      { label: 'Restricoes financeiras', status: 'ok', detail: 'Nenhuma' },
      { label: 'Recall ativo', status: 'ok', detail: 'Nenhum recall pendente' },
      { label: 'Sinistro', status: 'ok', detail: 'Sem registro' },
    ],
  },
  'XYZ4E56': {
    vehicle: VEHICLES_DB['XYZ4E56'], riskScore: 45,
    items: [
      { label: 'Multas DETRAN', status: 'warning', detail: '2 multas (R$ 293,47 + R$ 195,23)' },
      { label: 'IPVA 2024', status: 'ok', detail: 'Pago em dia' },
      { label: 'Licenciamento', status: 'ok', detail: 'Vigente ate 12/2024' },
      { label: 'Restricoes judiciais', status: 'ok', detail: 'Nenhuma' },
      { label: 'Restricoes financeiras', status: 'warning', detail: 'Alienacao fiduciaria - Banco Itau' },
      { label: 'Recall ativo', status: 'ok', detail: 'Nenhum recall pendente' },
      { label: 'Sinistro', status: 'warning', detail: 'Registro de sinistro leve (2022)' },
    ],
  },
  'DEF7G89': {
    vehicle: VEHICLES_DB['DEF7G89'], riskScore: 30,
    items: [
      { label: 'Multas DETRAN', status: 'danger', detail: '5 multas pendentes (R$ 1.847,30)' },
      { label: 'IPVA 2024', status: 'danger', detail: 'Em atraso' },
      { label: 'Licenciamento', status: 'danger', detail: 'Vencido desde 04/2023' },
      { label: 'Restricoes judiciais', status: 'danger', detail: 'Penhora judicial ativa' },
      { label: 'Restricoes financeiras', status: 'ok', detail: 'Nenhuma' },
      { label: 'Recall ativo', status: 'warning', detail: 'Recall airbag nao resolvido' },
      { label: 'Sinistro', status: 'ok', detail: 'Sem registro' },
    ],
  },
}

// Fill missing
for (const plate of Object.keys(VEHICLES_DB)) {
  if (!CHECKLIST_DB[plate]) {
    CHECKLIST_DB[plate] = {
      vehicle: VEHICLES_DB[plate], riskScore: VEHICLES_DB[plate].riskScore,
      items: [
        { label: 'Multas DETRAN', status: 'ok', detail: 'Nenhuma multa pendente' },
        { label: 'IPVA 2024', status: 'ok', detail: 'Pago em dia' },
        { label: 'Licenciamento', status: 'ok', detail: 'Vigente' },
        { label: 'Restricoes judiciais', status: 'ok', detail: 'Nenhuma' },
        { label: 'Restricoes financeiras', status: 'ok', detail: 'Nenhuma' },
        { label: 'Recall ativo', status: 'ok', detail: 'Nenhum recall pendente' },
        { label: 'Sinistro', status: 'ok', detail: 'Sem registro' },
      ],
    }
  }
}

// ─── STOCK FOR MATCHING ───
const AVAILABLE_STOCK: MatchData[] = [
  { brand: 'Hyundai', model: 'HB20', vehicle: 'HB20 1.6 Vision 2022', seller: 'Auto Loja Premium', city: 'Campinas - SP', price: 69900, source: 'Rede PrecificaAuto', priceScore: 78, liquidityScore: 82, km: 32000, year: 2022 },
  { brand: 'Hyundai', model: 'HB20', vehicle: 'HB20 1.0 Sense 2021', seller: 'Canal do Repasse', city: 'Ribeirao Preto - SP', price: 64500, source: 'Canal do Repasse', priceScore: 74, liquidityScore: 80, km: 48000, year: 2021 },
  { brand: 'Hyundai', model: 'HB20', vehicle: 'HB20 1.0 Evolution 2023', seller: 'Veiculos Express', city: 'Sorocaba - SP', price: 76900, source: 'OLX', priceScore: 68, liquidityScore: 77, km: 22000, year: 2023 },
  { brand: 'Honda', model: 'Civic', vehicle: 'Civic EXL 2.0 CVT 2020', seller: 'Premium Autos', city: 'Sao Paulo - SP', price: 102000, source: 'Canal do Repasse', priceScore: 71, liquidityScore: 65, km: 51000, year: 2020 },
  { brand: 'Honda', model: 'Civic', vehicle: 'Civic Touring 1.5T 2021', seller: 'Top Car', city: 'Campinas - SP', price: 128000, source: 'Rede PrecificaAuto', priceScore: 66, liquidityScore: 72, km: 38000, year: 2021 },
  { brand: 'Toyota', model: 'Corolla', vehicle: 'Corolla XEi 2.0 2022', seller: 'Canal do Repasse', city: 'Sao Paulo - SP', price: 126000, source: 'Canal do Repasse', priceScore: 71, liquidityScore: 88, km: 28000, year: 2022 },
  { brand: 'Toyota', model: 'Corolla', vehicle: 'Corolla GLi 2.0 2021', seller: 'Auto Show', city: 'Curitiba - PR', price: 112000, source: 'Webmotors', priceScore: 75, liquidityScore: 85, km: 42000, year: 2021 },
  { brand: 'Fiat', model: 'Pulse', vehicle: 'Pulse Drive 1.3 CVT 2023', seller: 'Veiculos do Sul', city: 'Curitiba - PR', price: 89500, source: 'Rede PrecificaAuto', priceScore: 82, liquidityScore: 79, km: 18000, year: 2023 },
  { brand: 'Fiat', model: 'Argo', vehicle: 'Argo Drive 1.3 2022', seller: 'Fiat Premium', city: 'Belo Horizonte - MG', price: 68000, source: 'OLX', priceScore: 70, liquidityScore: 73, km: 35000, year: 2022 },
  { brand: 'Chevrolet', model: 'Onix', vehicle: 'Onix Premier 1.0T 2023', seller: 'GM Select', city: 'Rio de Janeiro - RJ', price: 82000, source: 'Webmotors', priceScore: 74, liquidityScore: 90, km: 22000, year: 2023 },
  { brand: 'Chevrolet', model: 'Tracker', vehicle: 'Tracker Premier 1.2T 2022', seller: 'Auto Center', city: 'Campinas - SP', price: 118000, source: 'Rede PrecificaAuto', priceScore: 72, liquidityScore: 78, km: 30000, year: 2022 },
  { brand: 'Hyundai', model: 'Creta', vehicle: 'Creta Prestige 2.0 2022', seller: 'Canal do Repasse', city: 'Goiania - GO', price: 112000, source: 'Canal do Repasse', priceScore: 76, liquidityScore: 81, km: 27000, year: 2022 },
]

// ─── USER SESSIONS (in-memory for demo, use DB in production) ───
const sessions: Record<string, {
  freeQueries: number
  queriesUsed: number
  onboarded: boolean
  lastPlate: string | null
  awaitingConfirmation: null | 'intent' | 'rede'
  pendingData: any
  intents: IntentData[]
}> = {}

function getSession(phone: string) {
  if (!sessions[phone]) {
    sessions[phone] = {
      freeQueries: 3,
      queriesUsed: 0,
      onboarded: false,
      lastPlate: null,
      awaitingConfirmation: null,
      pendingData: null,
      intents: [],
    }
  }
  return sessions[phone]
}

// ─── HELPERS ───
function fmt(v: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(v)
}

function isPlate(text: string): boolean {
  const clean = text.replace(/[\s\-]/g, '').toUpperCase()
  return /^[A-Z]{3}\d[A-Z\d]\d{2}$/.test(clean)
}

function normalizePlate(text: string): string {
  return text.replace(/[\s\-]/g, '').toUpperCase()
}

function scoreEmoji(score: number): string {
  if (score >= 70) return '🟢'
  if (score >= 40) return '🟡'
  return '🔴'
}

function verdictEmoji(v: string): string {
  if (v === 'COMPRA') return '✅'
  if (v === 'ATENCAO') return '⚠️'
  return '🚫'
}

function statusEmoji(s: string): string {
  if (s === 'ok') return '✅'
  if (s === 'warning') return '⚠️'
  return '🚫'
}

function findVehicleByText(text: string): VehicleData | null {
  const upper = text.toUpperCase()
  for (const v of Object.values(VEHICLES_DB)) {
    if (upper.includes(v.model.toUpperCase()) || upper.includes(v.brand.toUpperCase())) return v
  }
  return null
}

function parseIntent(text: string): IntentData | null {
  const models = ['hb20', 'civic', 'corolla', 'pulse', 'gol', 'onix', 'creta', 'hr-v', 'argo', 'kicks', 'tracker']
  const lower = text.toLowerCase()
  let model = ''
  for (const m of models) { if (lower.includes(m)) model = m.toUpperCase() }
  if (!model) return null

  const brands: Record<string, string> = { hb20: 'Hyundai', civic: 'Honda', corolla: 'Toyota', pulse: 'Fiat', gol: 'Volkswagen', onix: 'Chevrolet', creta: 'Hyundai', 'hr-v': 'Honda', argo: 'Fiat', kicks: 'Nissan', tracker: 'Chevrolet' }
  const brand = brands[model.toLowerCase()] || 'Qualquer'

  const yearMatch = lower.match(/(\d{4})/)
  const kmMatch = lower.match(/(\d+)\s*k/)
  const priceMatch = lower.match(/r?\$?\s*(\d+)/i)

  return {
    brand, model,
    yearMin: yearMatch ? parseInt(yearMatch[1]) : 2020,
    yearMax: 2024,
    kmMax: kmMatch ? parseInt(kmMatch[1]) * 1000 : 60000,
    priceMax: priceMatch ? parseInt(priceMatch[1]) * (parseInt(priceMatch[1]) < 1000 ? 1000 : 1) : 100000,
    region: 'SP - Interior',
  }
}

function findMatches(intent: IntentData): MatchData[] {
  return AVAILABLE_STOCK.filter((v) => {
    if (intent.model && v.model.toUpperCase() !== intent.model.toUpperCase()) return false
    if (v.year < intent.yearMin || v.year > intent.yearMax) return false
    if (v.km > intent.kmMax) return false
    if (v.price > intent.priceMax) return false
    const avgScore = Math.round((v.priceScore + v.liquidityScore) / 2)
    if (avgScore < 65) return false
    return true
  }).sort((a, b) => (b.priceScore + b.liquidityScore) - (a.priceScore + a.liquidityScore))
}

// ─── MESSAGE FORMATTERS (WhatsApp text format) ───

function formatPricingCard(v: VehicleData): string {
  return `📊 *ANALISE DE MERCADO*
━━━━━━━━━━━━━━━━━━━━
🚗 *${v.brand} ${v.model} ${v.version}*
📋 Placa: ${v.plate} · ${v.year}/${v.yearModel}
⛽ ${v.fuel} · ${v.color} · ${v.km.toLocaleString()} km
📍 ${v.region}

*SCORES*
${scoreEmoji(v.priceScore)} Preco: *${v.priceScore}/100*
${scoreEmoji(v.liquidityScore)} Liquidez: *${v.liquidityScore}/100*
${scoreEmoji(v.riskScore)} Risco: *${v.riskScore}/100*

*FIPE* (${v.fipeCode}): *${fmt(v.fipePrice)}*

*MERCADO* (${v.totalAds} anuncios)
▫️ Minimo (P10): ${fmt(v.marketMin)}
▫️ Mediana: ${fmt(v.marketMedian)}
▫️ Maximo (P90): ${fmt(v.marketMax)}

💰 *COMPRA RECOMENDADA (P25-P40)*
*${fmt(v.recommendedBuyMin)} - ${fmt(v.recommendedBuyMax)}*

${verdictEmoji(v.verdict)} *VEREDICTO: ${v.verdict}*
━━━━━━━━━━━━━━━━━━━━`
}

function formatChecklistCard(c: ChecklistData): string {
  const items = c.items.map(i => `${statusEmoji(i.status)} *${i.label}*: ${i.detail}`).join('\n')
  const riskLabel = c.riskScore >= 70 ? 'Sem pendencias criticas' : c.riskScore >= 40 ? 'Pendencias menores - ATENCAO' : 'Restricao critica - EVITAR'

  return `🔍 *CHECKLIST DOCUMENTAL*
━━━━━━━━━━━━━━━━━━━━
🚗 ${c.vehicle.brand} ${c.vehicle.model} · ${c.vehicle.plate}
${scoreEmoji(c.riskScore)} Score de risco: *${c.riskScore}/100*

${items}

📋 *${riskLabel}*
━━━━━━━━━━━━━━━━━━━━`
}

function formatMatchCard(m: MatchData): string {
  return `🔔 *ALERTA DE MATCH*
━━━━━━━━━━━━━━━━━━━━
🚗 *${m.vehicle}*
📍 ${m.city}
🏪 ${m.seller} (${m.source})

💰 Preco: *${fmt(m.price)}*
📅 Ano: ${m.year} · ${m.km.toLocaleString()} km
${scoreEmoji(m.priceScore)} Preco: *${m.priceScore}/100*
${scoreEmoji(m.liquidityScore)} Liquidez: *${m.liquidityScore}/100*
━━━━━━━━━━━━━━━━━━━━
Responda *contatar* para falar com o vendedor`
}

function formatIntentConfirm(intent: IntentData): string {
  return `🔎 *CADASTRAR BUSCA DE ESTOQUE*
━━━━━━━━━━━━━━━━━━━━
🚗 *${intent.brand} ${intent.model}*
📅 Ano: ${intent.yearMin}–${intent.yearMax}
🔢 KM max: ${intent.kmMax.toLocaleString()} km
💰 Preco max: ${fmt(intent.priceMax)}
📍 Regiao: ${intent.region}
📊 Score minimo: 65

🔄 Fontes: Canal do Repasse + OLX + Webmotors + Rede
⏱️ Varredura: a cada 2-4h
📆 Validade: 30 dias
━━━━━━━━━━━━━━━━━━━━
Responda *sim* para confirmar ou *nao* para cancelar`
}

function formatPlans(): string {
  return `📋 *PLANOS PRECIFICAAUTO*
━━━━━━━━━━━━━━━━━━━━

💳 *Avulso* — R$ 4,90/consulta
Sem assinatura

⭐ *Starter* — R$ 97/mes
30 consultas + checklist completo

🏆 *Profissional* — R$ 197/mes _(mais popular)_
80 consultas + alertas + laudo PDF

🏢 *Loja* — R$ 397/mes
200 consultas + rede + multi-usuario

━━━━━━━━━━━━━━━━━━━━
Responda com o nome do plano para saber mais`
}

// ─── BOT ENGINE ───
function processMessage(phone: string, text: string): string[] {
  const session = getSession(phone)
  const lower = text.toLowerCase().trim()
  const responses: string[] = []

  // Welcome
  if (!session.onboarded && ['oi', 'ola', 'bom dia', 'boa tarde', 'hey', 'inicio', 'comecar'].includes(lower)) {
    session.onboarded = true
    responses.push(`Ola! Eu sou a *PrecificaAuto* 🚗\n\nSua assistente de compra e buscadora de veiculos usados.\n\nVoce tem *3 consultas gratis*. Escolha o que deseja fazer:`)
    responses.push(`💰 *Consulta Preco* — envie a placa ou descreva o veiculo\nEx: _ABC1D23_ ou _HB20 2021_\n\n🔎 *Busca Estoque* — diga o que procura\nEx: _quero HB20 2021+, ate 60k km_\n\n📦 *Cadastrar Veiculo* — informe o que tem para repasse\nEx: _tenho Civic 2020, 52k km, R$ 98k_\n\n📋 *Planos* — digite _planos_\n❓ *Ajuda* — digite _ajuda_`)
    return responses
  }

  if (!session.onboarded) session.onboarded = true

  // Handle confirmations
  if (session.awaitingConfirmation === 'intent') {
    if (['sim', 'confirmar', 's', '1'].includes(lower)) {
      const intent = session.pendingData as IntentData
      session.intents.push(intent)
      session.awaitingConfirmation = null
      session.pendingData = null

      const matches = findMatches(intent)
      if (matches.length > 0) {
        responses.push(`✅ *Intencao cadastrada!*\n\nPrimeira varredura feita. Encontrei *${matches.length} veiculo${matches.length > 1 ? 's' : ''}* compativel${matches.length > 1 ? 'is' : ''}!`)
        responses.push(formatMatchCard(matches[0]))
        if (matches.length > 1) {
          responses.push(`Mais ${matches.length - 1} opcao${matches.length - 1 > 1 ? 'oes' : ''} disponivel${matches.length - 1 > 1 ? 'is' : ''}. Enviarei alertas a cada 2-4h.\n\n📆 Validade: 30 dias.`)
        }
      } else {
        responses.push(`✅ *Intencao cadastrada!*\n\nAinda nao encontrei veiculos compativeis. Vou monitorar a cada 2-4h e aviso assim que encontrar um *${intent.model}* dentro dos seus criterios.\n\n📆 Validade: 30 dias.`)
      }
      return responses
    }
    if (['nao', 'cancelar', 'n', '2'].includes(lower)) {
      session.awaitingConfirmation = null
      session.pendingData = null
      responses.push('Ok, busca cancelada. Me diga o que procura quando quiser.')
      return responses
    }
  }

  // Plans
  if (['planos', 'precos', 'preco', 'plano'].includes(lower)) {
    responses.push(formatPlans())
    return responses
  }

  // Help
  if (['ajuda', 'help', 'menu', '?'].includes(lower)) {
    responses.push(`*O que posso fazer por voce:*\n\n💰 *Consulta Preco* — envie uma placa ou descreva o veiculo\n🔎 *Busca Estoque* — _quero_ + o que procura\n📦 *Cadastrar Veiculo* — _tenho_ + detalhes do carro\n🔍 *Checklist Documental* — _checklist_ + placa\n📋 *Planos e precos* — _planos_\n📊 *Resumo da conta* — _resumo_`)
    return responses
  }

  // Summary
  if (['resumo', 'resumo mensal'].includes(lower)) {
    responses.push(`📊 *Seu resumo*\n\nConsultas usadas: *${session.queriesUsed}*\nGratis restantes: *${session.freeQueries}*\nBuscas ativas: *${session.intents.length}*`)
    return responses
  }

  // Checklist
  if (lower.startsWith('checklist') || lower.startsWith('check ') || lower.startsWith('verificar')) {
    const plateMatch = text.match(/[A-Za-z]{3}\s?\d[A-Za-z\d]\d{2}/i)
    const plate = plateMatch ? normalizePlate(plateMatch[0]) : session.lastPlate
    if (!plate) { responses.push('Informe a placa. Ex: *checklist ABC1D23*'); return responses }
    const checklist = CHECKLIST_DB[plate]
    if (!checklist) { responses.push(`Placa *${plate}* nao encontrada.`); return responses }
    responses.push(`🔍 Consultando DETRAN, DENATRAN e restricoes para *${plate}*...`)
    responses.push(formatChecklistCard(checklist))
    return responses
  }

  // Intent (busca estoque)
  if (lower.startsWith('quero') || lower.startsWith('procuro') || lower.startsWith('busco') || lower.startsWith('preciso')) {
    const intent = parseIntent(text)
    if (!intent) { responses.push('Nao entendi o veiculo. Tente: _quero HB20 2021+, ate 60k km_'); return responses }
    session.awaitingConfirmation = 'intent'
    session.pendingData = intent
    responses.push(formatIntentConfirm(intent))
    return responses
  }

  // Plate lookup
  if (isPlate(text)) {
    const plate = normalizePlate(text)
    const vehicle = VEHICLES_DB[plate]
    if (!vehicle) { responses.push(`Placa *${plate}* nao encontrada no beta.\n\nPlacas disponiveis: ABC1D23, XYZ4E56, DEF7G89, GHI8J01, JKL2M34`); return responses }

    if (session.freeQueries <= 0) {
      responses.push(`⚠️ Suas *3 consultas gratis* acabaram.\n\nDigite *planos* para continuar.`)
      responses.push(formatPlans())
      return responses
    }
    session.freeQueries--
    session.queriesUsed++
    session.lastPlate = plate

    responses.push(`📊 Analisando *${plate}*...\nColetando dados: FIPE, OLX, Webmotors, iCarros, DETRAN...`)
    responses.push(formatPricingCard(vehicle))

    if (session.freeQueries > 0) {
      responses.push(`Voce tem *${session.freeQueries}* consulta${session.freeQueries > 1 ? 's' : ''} gratis restante${session.freeQueries > 1 ? 's' : ''}.\n\nDigite *checklist ${plate}* para verificar pendencias.`)
    } else {
      responses.push(`Essa foi sua *ultima consulta gratis*! 🎯\n\nGostou? Digite *planos* para ver as opcoes a partir de *R$ 97/mes*.`)
    }
    return responses
  }

  // Free text vehicle
  const vehicleMatch = findVehicleByText(text)
  if (vehicleMatch) {
    if (session.freeQueries <= 0) {
      responses.push(`⚠️ Consultas gratis esgotadas. Digite *planos*.`)
      return responses
    }
    session.freeQueries--
    session.queriesUsed++
    session.lastPlate = vehicleMatch.plate
    responses.push(`🔎 Encontrei: *${vehicleMatch.brand} ${vehicleMatch.model} ${vehicleMatch.version}*\nAnalisando mercado...`)
    responses.push(formatPricingCard(vehicleMatch))
    return responses
  }

  // Fallback
  responses.push(`Nao entendi 😅 Tente assim:\n\n💰 Envie uma *placa* (ex: _ABC1D23_)\n🔎 _quero HB20 2021+_\n📦 _tenho Civic 2020, 52k km, R$ 98k_\n\nOu digite *ajuda*`)
  return responses
}

// ─── WHATSAPP API: SEND MESSAGE ───
async function sendWhatsAppMessage(to: string, text: string) {
  const url = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: { preview_url: false, body: text },
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    console.error('WhatsApp API error:', err)
  }
}

// ─── WEBHOOK HANDLER ───
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // GET = webhook verification (Meta challenge)
  if (req.method === 'GET') {
    const mode = req.query['hub.mode']
    const token = req.query['hub.verify_token']
    const challenge = req.query['hub.challenge']

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verified')
      return res.status(200).send(challenge)
    }
    return res.status(403).send('Forbidden')
  }

  // POST = incoming messages
  if (req.method === 'POST') {
    const body = req.body

    if (body?.object !== 'whatsapp_business_account') {
      return res.status(404).send('Not found')
    }

    const entries = body.entry || []
    for (const entry of entries) {
      const changes = entry.changes || []
      for (const change of changes) {
        const value = change.value
        if (!value?.messages) continue

        for (const message of value.messages) {
          if (message.type !== 'text') continue

          const from = message.from // phone number
          const text = message.text.body

          console.log(`Message from ${from}: ${text}`)

          // Process and send responses
          const responses = processMessage(from, text)
          for (const reply of responses) {
            await sendWhatsAppMessage(from, reply)
            // Small delay between messages to maintain order
            await new Promise(r => setTimeout(r, 500))
          }
        }
      }
    }

    return res.status(200).json({ status: 'ok' })
  }

  return res.status(405).send('Method not allowed')
}
