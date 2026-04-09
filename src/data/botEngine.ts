export interface Message {
  id: string
  from: 'user' | 'bot'
  type: 'text' | 'card-pricing' | 'card-checklist' | 'card-alert' | 'card-match' | 'card-plans' | 'card-summary' | 'card-intent-confirm' | 'card-rede' | 'typing'
  text?: string
  data?: any
  timestamp: Date
}

export interface VehicleData {
  plate: string
  brand: string
  model: string
  version: string
  year: number
  yearModel: number
  color: string
  fuel: string
  fipeCode: string
  fipePrice: number
  marketMin: number
  marketMax: number
  marketMedian: number
  totalAds: number
  region: string
  priceScore: number
  liquidityScore: number
  riskScore: number
  recommendedBuyMin: number
  recommendedBuyMax: number
  verdict: 'COMPRA' | 'ATENCAO' | 'EVITAR'
  km: number
}

export interface ChecklistData {
  vehicle: VehicleData
  riskScore: number
  items: { label: string; status: 'ok' | 'warning' | 'danger'; detail: string }[]
}

export interface IntentData {
  brand: string
  model: string
  yearMin: number
  yearMax: number
  kmMax: number
  priceMax: number
  region: string
}

export interface MatchData {
  vehicle: string
  seller: string
  city: string
  price: number
  source: string
  priceScore: number
  liquidityScore: number
  km: number
  year: number
}

export interface RedeVehicle {
  model: string
  year: number
  km: number
  price: number
  region: string
}

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

const CHECKLIST_DB: Record<string, ChecklistData> = {
  'ABC1D23': {
    vehicle: VEHICLES_DB['ABC1D23'],
    riskScore: 90,
    items: [
      { label: 'Multas DETRAN', status: 'ok', detail: 'Nenhuma multa pendente' },
      { label: 'IPVA 2024', status: 'ok', detail: 'Pago em dia' },
      { label: 'IPVA 2023', status: 'ok', detail: 'Pago em dia' },
      { label: 'Licenciamento', status: 'ok', detail: 'Vigente ate 12/2024' },
      { label: 'Restricoes judiciais', status: 'ok', detail: 'Nenhuma' },
      { label: 'Restricoes financeiras', status: 'ok', detail: 'Nenhuma' },
      { label: 'Recall ativo', status: 'ok', detail: 'Nenhum recall pendente' },
      { label: 'Sinistro', status: 'ok', detail: 'Sem registro' },
    ],
  },
  'XYZ4E56': {
    vehicle: VEHICLES_DB['XYZ4E56'],
    riskScore: 45,
    items: [
      { label: 'Multas DETRAN', status: 'warning', detail: '2 multas (R$ 293,47 + R$ 195,23)' },
      { label: 'IPVA 2024', status: 'ok', detail: 'Pago em dia' },
      { label: 'IPVA 2023', status: 'ok', detail: 'Pago em dia' },
      { label: 'Licenciamento', status: 'ok', detail: 'Vigente ate 12/2024' },
      { label: 'Restricoes judiciais', status: 'ok', detail: 'Nenhuma' },
      { label: 'Restricoes financeiras', status: 'warning', detail: 'Alienacao fiduciaria - Banco Itau' },
      { label: 'Recall ativo', status: 'ok', detail: 'Nenhum recall pendente' },
      { label: 'Sinistro', status: 'warning', detail: 'Registro de sinistro leve (2022)' },
    ],
  },
  'DEF7G89': {
    vehicle: VEHICLES_DB['DEF7G89'],
    riskScore: 30,
    items: [
      { label: 'Multas DETRAN', status: 'danger', detail: '5 multas pendentes (R$ 1.847,30)' },
      { label: 'IPVA 2024', status: 'danger', detail: 'Em atraso' },
      { label: 'IPVA 2023', status: 'danger', detail: 'Em atraso' },
      { label: 'Licenciamento', status: 'danger', detail: 'Vencido desde 04/2023' },
      { label: 'Restricoes judiciais', status: 'danger', detail: 'Penhora judicial ativa' },
      { label: 'Restricoes financeiras', status: 'ok', detail: 'Nenhuma' },
      { label: 'Recall ativo', status: 'warning', detail: 'Recall airbag nao resolvido' },
      { label: 'Sinistro', status: 'ok', detail: 'Sem registro' },
    ],
  },
}

// Fill missing checklist entries with clean data
for (const plate of Object.keys(VEHICLES_DB)) {
  if (!CHECKLIST_DB[plate]) {
    CHECKLIST_DB[plate] = {
      vehicle: VEHICLES_DB[plate],
      riskScore: VEHICLES_DB[plate].riskScore,
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

const MATCH_ALERTS: MatchData[] = [
  { vehicle: 'HB20 1.6 Vision 2022', seller: 'Auto Loja Premium', city: 'Campinas - SP', price: 69900, source: 'Rede PrecificaAuto', priceScore: 78, liquidityScore: 82, km: 32000, year: 2022 },
  { vehicle: 'Corolla XEi 2.0 2022', seller: 'Canal do Repasse', city: 'Sao Paulo - SP', price: 126000, source: 'Canal do Repasse', priceScore: 71, liquidityScore: 88, km: 28000, year: 2022 },
  { vehicle: 'Pulse Drive 1.3 2023', seller: 'Veiculos do Sul', city: 'Curitiba - PR', price: 89500, source: 'Rede PrecificaAuto', priceScore: 82, liquidityScore: 79, km: 18000, year: 2023 },
]

type BotState = {
  freeQueries: number
  plan: 'free' | 'avulso' | 'starter' | 'profissional' | 'loja'
  queriesUsed: number
  intents: IntentData[]
  redeVehicles: RedeVehicle[]
  awaitingConfirmation: null | 'intent' | 'rede'
  pendingData: any
  onboarded: boolean
  lastPlate: string | null
}

let state: BotState = {
  freeQueries: 3,
  plan: 'free',
  queriesUsed: 0,
  intents: [],
  redeVehicles: [],
  awaitingConfirmation: null,
  pendingData: null,
  onboarded: false,
  lastPlate: null,
}

export function resetBotState() {
  state = {
    freeQueries: 3,
    plan: 'free',
    queriesUsed: 0,
    intents: [],
    redeVehicles: [],
    awaitingConfirmation: null,
    pendingData: null,
    onboarded: false,
    lastPlate: null,
  }
}

export function getBotState() {
  return { ...state }
}

function isPlate(text: string): boolean {
  const clean = text.replace(/[\s\-]/g, '').toUpperCase()
  return /^[A-Z]{3}\d[A-Z\d]\d{2}$/.test(clean)
}

function normalizePlate(text: string): string {
  return text.replace(/[\s\-]/g, '').toUpperCase()
}

function findVehicleByText(text: string): VehicleData | null {
  const upper = text.toUpperCase()
  for (const v of Object.values(VEHICLES_DB)) {
    if (upper.includes(v.model.toUpperCase()) || upper.includes(v.brand.toUpperCase())) {
      return v
    }
  }
  return null
}

function parseIntent(text: string): IntentData | null {
  const brands = ['hyundai', 'honda', 'toyota', 'fiat', 'volkswagen', 'chevrolet']
  const models = ['hb20', 'civic', 'corolla', 'pulse', 'gol', 'onix', 'creta', 'hr-v', 'argo', 'kicks', 'tracker']
  const lower = text.toLowerCase()

  let brand = ''
  let model = ''
  for (const b of brands) { if (lower.includes(b)) brand = b.charAt(0).toUpperCase() + b.slice(1) }
  for (const m of models) { if (lower.includes(m)) model = m.toUpperCase() }

  if (!model) return null

  const yearMatch = lower.match(/(\d{4})\+?/)
  const kmMatch = lower.match(/(\d+)\s*k(?:m|ilom)/)
  const priceMatch = lower.match(/r?\$?\s*(\d+[\.,]?\d*)\s*k?/i)

  return {
    brand: brand || 'Qualquer',
    model,
    yearMin: yearMatch ? parseInt(yearMatch[1]) : 2020,
    yearMax: 2024,
    kmMax: kmMatch ? parseInt(kmMatch[1]) * 1000 : 60000,
    priceMax: priceMatch ? (priceMatch[1].includes('.') || priceMatch[1].includes(',') ? parseFloat(priceMatch[1].replace(',', '.')) * 1000 : parseInt(priceMatch[1]) * (parseInt(priceMatch[1]) < 1000 ? 1000 : 1)) : 100000,
    region: 'SP - Interior',
  }
}

function parseRedeVehicle(text: string): RedeVehicle | null {
  const lower = text.toLowerCase()
  if (!lower.includes('tenho') && !lower.includes('vendo') && !lower.includes('repasse')) return null

  const models = ['civic', 'corolla', 'hb20', 'pulse', 'gol', 'onix', 'creta', 'hr-v', 'argo', 'kicks', 'tracker']
  let model = ''
  for (const m of models) { if (lower.includes(m)) model = m.charAt(0).toUpperCase() + m.slice(1) }
  if (!model) return null

  const yearMatch = lower.match(/(\d{4})/)
  const kmMatch = lower.match(/(\d+)\s*k/)
  const priceMatch = lower.match(/r?\$?\s*(\d+[\.,]?\d*)\s*k?/i)

  return {
    model,
    year: yearMatch ? parseInt(yearMatch[1]) : 2022,
    km: kmMatch ? parseInt(kmMatch[1]) * 1000 : 30000,
    price: priceMatch ? parseInt(priceMatch[1]) * (parseInt(priceMatch[1]) < 1000 ? 1000 : 1) : 80000,
    region: 'SP - Interior',
  }
}

export function processMessage(text: string): Message[] {
  const responses: Message[] = []
  const lower = text.toLowerCase().trim()

  const msg = (type: Message['type'], content?: string, data?: any): Message => ({
    id: String(Date.now() + Math.random()),
    from: 'bot',
    type,
    text: content,
    data,
    timestamp: new Date(),
  })

  // Welcome / onboarding
  if (!state.onboarded && (lower === 'oi' || lower === 'ola' || lower === 'bom dia' || lower === 'boa tarde' || lower === 'hey' || lower === 'inicio' || lower === 'comecar')) {
    state.onboarded = true
    responses.push(msg('text',
      `Ola! Bem-vindo ao *PrecificaAuto* 🚗\n\nSou seu assistente de decisao para compra de veiculos usados.\n\nVoce tem *3 consultas gratis* para testar. Veja o que posso fazer:`
    ))
    responses.push(msg('text',
      `📊 *Precificador* — envie uma placa ou descreva o veiculo\n🔍 *Checklist* — digite "checklist ABC1D23"\n🔔 *Buscador* — digite "quero HB20 2021+"\n🤝 *Rede* — digite "tenho Civic 2020, 52k km, R$ 98k"\n📋 *Planos* — digite "planos"\n\nComece enviando uma *placa* para testar!`
    ))
    return responses
  }

  // Auto onboard if first message
  if (!state.onboarded) {
    state.onboarded = true
  }

  // Handle confirmation states
  if (state.awaitingConfirmation === 'intent') {
    if (lower === 'sim' || lower === 'confirmar' || lower === 's' || lower === '1') {
      state.intents.push(state.pendingData)
      state.awaitingConfirmation = null
      state.pendingData = null
      responses.push(msg('text', `✅ *Intencao cadastrada com sucesso!*\n\nVou monitorar Canal do Repasse, OLX, Webmotors e iCarros a cada 2-4h.\n\nQuando encontrar um veiculo compativel com score >= 65, envio o card completo aqui.\n\nTTL: 30 dias. Para renovar, e so pedir.`))
      // Simulate a match after a few seconds
      responses.push(msg('text', `🔔 Ja encontrei *${Math.floor(Math.random() * 3) + 1} veiculos* compativeis na ultima varredura! Enviando o melhor match...`))
      const match = MATCH_ALERTS[Math.floor(Math.random() * MATCH_ALERTS.length)]
      responses.push(msg('card-match', undefined, match))
      return responses
    } else if (lower === 'nao' || lower === 'cancelar' || lower === 'n' || lower === '2') {
      state.awaitingConfirmation = null
      state.pendingData = null
      responses.push(msg('text', 'Ok, intencao cancelada. Me diga o que procura quando quiser.'))
      return responses
    }
  }

  if (state.awaitingConfirmation === 'rede') {
    if (lower === 'sim' || lower === 'confirmar' || lower === 's' || lower === '1') {
      state.redeVehicles.push(state.pendingData)
      state.awaitingConfirmation = null
      state.pendingData = null
      responses.push(msg('text', `✅ *Veiculo cadastrado na rede!*\n\nSeu carro ficara visivel apenas para compradores com intencao de compra compativel — nao e anuncio publico.\n\nQuando houver match, ambas as partes serao notificadas simultaneamente aqui no WhatsApp.\n\nTTL: 30 dias.`))
      return responses
    } else if (lower === 'nao' || lower === 'cancelar' || lower === 'n' || lower === '2') {
      state.awaitingConfirmation = null
      state.pendingData = null
      responses.push(msg('text', 'Ok, cadastro cancelado.'))
      return responses
    }
  }

  // Plans
  if (lower === 'planos' || lower === 'precos' || lower === 'preco' || lower === 'plano' || lower === 'assinar') {
    responses.push(msg('card-plans'))
    return responses
  }

  // Help
  if (lower === 'ajuda' || lower === 'help' || lower === 'menu' || lower === '?') {
    responses.push(msg('text',
      `*Comandos disponiveis:*\n\n📊 Envie uma *placa* (ex: ABC1D23) — analise de preco\n🔍 *checklist* + placa — verificar pendencias\n🔔 *quero* + descricao — cadastrar intencao de compra\n🤝 *tenho* + descricao — cadastrar veiculo para repasse\n📋 *planos* — ver planos e precos\n📊 *resumo* — resumo mensal\n❓ *ajuda* — este menu\n\nPlacas de teste: ABC1D23, XYZ4E56, DEF7G89, GHI8J01, JKL2M34`
    ))
    return responses
  }

  // Monthly summary
  if (lower === 'resumo' || lower === 'resumo mensal') {
    responses.push(msg('card-summary', undefined, {
      consultas: state.queriesUsed,
      freeLeft: state.freeQueries,
      plan: state.plan,
      intents: state.intents.length,
      redeVehicles: state.redeVehicles.length,
    }))
    return responses
  }

  // Checklist command
  if (lower.startsWith('checklist') || lower.startsWith('check ') || lower.startsWith('verificar')) {
    const plateMatch = text.match(/[A-Za-z]{3}\s?\d[A-Za-z\d]\d{2}/i)
    const plate = plateMatch ? normalizePlate(plateMatch[0]) : state.lastPlate

    if (!plate) {
      responses.push(msg('text', 'Por favor, informe a placa do veiculo.\nEx: *checklist ABC1D23*'))
      return responses
    }

    const checklist = CHECKLIST_DB[plate]
    if (!checklist) {
      responses.push(msg('text', `Nao encontrei dados para a placa *${plate}*.\n\nPlacas de teste disponiveis: ABC1D23, XYZ4E56, DEF7G89, GHI8J01, JKL2M34`))
      return responses
    }

    responses.push(msg('text', `🔍 Consultando DETRAN, DENATRAN, restricoes judiciais e financeiras para *${plate}*...`))
    responses.push(msg('card-checklist', undefined, checklist))
    return responses
  }

  // Buscador - intent registration
  if (lower.startsWith('quero') || lower.startsWith('procuro') || lower.startsWith('busco') || lower.startsWith('preciso')) {
    const intent = parseIntent(text)
    if (!intent) {
      responses.push(msg('text', 'Nao consegui entender o veiculo. Tente assim:\n*quero HB20 2021+, ate 60k km, ate R$ 75k*'))
      return responses
    }

    state.awaitingConfirmation = 'intent'
    state.pendingData = intent
    responses.push(msg('card-intent-confirm', undefined, intent))
    return responses
  }

  // Rede - vehicle registration
  if (lower.startsWith('tenho') || lower.startsWith('vendo') || (lower.includes('repasse') && (lower.includes('r$') || lower.includes('km')))) {
    const vehicle = parseRedeVehicle(text)
    if (!vehicle) {
      responses.push(msg('text', 'Nao consegui entender o veiculo. Tente assim:\n*tenho Civic 2020 EXL CVT, 52k km, R$ 98k para repasse*'))
      return responses
    }

    state.awaitingConfirmation = 'rede'
    state.pendingData = vehicle
    responses.push(msg('card-rede', undefined, vehicle))
    return responses
  }

  // Plate lookup (core functionality)
  const plateClean = normalizePlate(text)
  if (isPlate(text)) {
    const vehicle = VEHICLES_DB[plateClean]
    if (!vehicle) {
      responses.push(msg('text', `Placa *${plateClean}* nao encontrada na base de teste.\n\nPlacas disponiveis: ABC1D23, XYZ4E56, DEF7G89, GHI8J01, JKL2M34`))
      return responses
    }

    // Check free queries
    if (state.plan === 'free') {
      if (state.freeQueries <= 0) {
        responses.push(msg('text', `⚠️ Voce ja usou suas *3 consultas gratis*.\n\nPara continuar, escolha um plano:`))
        responses.push(msg('card-plans'))
        return responses
      }
      state.freeQueries--
      state.queriesUsed++
    } else {
      state.queriesUsed++
    }

    state.lastPlate = plateClean
    responses.push(msg('text', `📊 Analisando *${plateClean}*...\nColetando dados: FIPE, OLX, Webmotors, iCarros, DETRAN...`))
    responses.push(msg('card-pricing', undefined, vehicle))

    // After pricing, show remaining queries
    if (state.plan === 'free' && state.freeQueries > 0) {
      responses.push(msg('text', `Voce tem *${state.freeQueries} consulta${state.freeQueries > 1 ? 's' : ''} gratis* restante${state.freeQueries > 1 ? 's' : ''}.\n\nEnvie outra placa ou digite *checklist ${plateClean}* para verificar pendencias.`))
    } else if (state.plan === 'free' && state.freeQueries === 0) {
      responses.push(msg('text', `Essa foi sua *ultima consulta gratis*! 🎯\n\nGostou? Veja nossos planos a partir de *R$ 97/mes* com 30 consultas inclusas.\n\nDigite *planos* para ver as opcoes ou continue avulso por *R$ 4,90/consulta*.`))
    }

    return responses
  }

  // Free text vehicle search
  const vehicleMatch = findVehicleByText(text)
  if (vehicleMatch) {
    if (state.plan === 'free') {
      if (state.freeQueries <= 0) {
        responses.push(msg('text', `⚠️ Voce ja usou suas *3 consultas gratis*. Digite *planos* para continuar.`))
        responses.push(msg('card-plans'))
        return responses
      }
      state.freeQueries--
      state.queriesUsed++
    } else {
      state.queriesUsed++
    }

    state.lastPlate = vehicleMatch.plate
    responses.push(msg('text', `🔎 Encontrei: *${vehicleMatch.brand} ${vehicleMatch.model} ${vehicleMatch.version}*\nPlaca de referencia: ${vehicleMatch.plate}\n\nAnalisando mercado...`))
    responses.push(msg('card-pricing', undefined, vehicleMatch))

    if (state.plan === 'free' && state.freeQueries >= 0) {
      responses.push(msg('text', `${state.freeQueries > 0 ? `*${state.freeQueries}* consulta${state.freeQueries > 1 ? 's' : ''} gratis restante${state.freeQueries > 1 ? 's' : ''}.` : 'Essa foi sua *ultima consulta gratis*! Digite *planos* para continuar.'}\n\nDigite *checklist ${vehicleMatch.plate}* para ver pendencias documentais.`))
    }

    return responses
  }

  // Activate plan (simulated)
  if (lower.includes('assinar starter') || lower === 'starter') {
    state.plan = 'starter'
    state.freeQueries = 30
    responses.push(msg('text', `✅ *Plano Starter ativado!*\n\n30 consultas/mes\nChecklist completo\nHistorico 30 dias\n\nEnvie uma placa para comecar!`))
    return responses
  }
  if (lower.includes('assinar pro') || lower === 'profissional' || lower === 'pro') {
    state.plan = 'profissional'
    state.freeQueries = 80
    responses.push(msg('text', `✅ *Plano Profissional ativado!*\n\n80 consultas/mes\nChecklist + Laudo PDF\nHistorico 90 dias\n3 alertas ativos\n\nEnvie uma placa para comecar!`))
    return responses
  }
  if (lower.includes('assinar loja') || lower === 'loja') {
    state.plan = 'loja'
    state.freeQueries = 200
    responses.push(msg('text', `✅ *Plano Loja ativado!*\n\n200 consultas/mes\nMulti-usuario ilimitado\nRede completa + cadastro estoque\nDashboard web + API beta\n\nEnvie uma placa para comecar!`))
    return responses
  }

  // Fallback
  responses.push(msg('text',
    `Nao entendi. Tente uma dessas opcoes:\n\n📊 Envie uma *placa* — ex: ABC1D23\n🔍 *checklist ABC1D23*\n🔔 *quero HB20 2021+*\n🤝 *tenho Civic 2020, 52k km, R$ 98k*\n📋 *planos*\n❓ *ajuda*`
  ))

  return responses
}
