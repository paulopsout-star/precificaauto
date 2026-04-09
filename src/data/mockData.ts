export interface VehicleAnalysis {
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
  kmEstimated: number
}

export interface ChecklistItem {
  label: string
  status: 'ok' | 'warning' | 'danger' | 'pending'
  detail: string
}

export interface ChecklistResult {
  vehicle: VehicleAnalysis
  riskScore: number
  items: ChecklistItem[]
}

export interface PurchaseIntent {
  id: string
  brand: string
  model: string
  yearMin: number
  yearMax: number
  kmMax: number
  priceMax: number
  region: string
  minScore: number
  status: 'ativo' | 'pausado' | 'expirado'
  createdAt: string
  expiresAt: string
  matchCount: number
}

export interface NetworkVehicle {
  id: string
  seller: string
  sellerCity: string
  brand: string
  model: string
  version: string
  year: number
  km: number
  price: number
  priceScore: number
  liquidityScore: number
  createdAt: string
  source: 'rede' | 'canal_repasse' | 'olx' | 'webmotors'
}

export const MOCK_VEHICLES: VehicleAnalysis[] = [
  {
    plate: 'ABC1D23',
    brand: 'Hyundai',
    model: 'HB20',
    version: '1.0 Sense',
    year: 2021,
    yearModel: 2022,
    color: 'Branco',
    fuel: 'Flex',
    fipeCode: '015270-0',
    fipePrice: 72500,
    marketMin: 62000,
    marketMax: 79000,
    marketMedian: 69500,
    totalAds: 47,
    region: 'SP - Interior',
    priceScore: 72,
    liquidityScore: 85,
    riskScore: 90,
    recommendedBuyMin: 63000,
    recommendedBuyMax: 67000,
    verdict: 'COMPRA',
    kmEstimated: 45000,
  },
  {
    plate: 'XYZ4E56',
    brand: 'Honda',
    model: 'Civic',
    version: 'EXL 2.0 CVT',
    year: 2020,
    yearModel: 2020,
    color: 'Prata',
    fuel: 'Flex',
    fipeCode: '014252-6',
    fipePrice: 115000,
    marketMin: 98000,
    marketMax: 125000,
    marketMedian: 108000,
    totalAds: 23,
    region: 'SP - Capital',
    priceScore: 58,
    liquidityScore: 62,
    riskScore: 45,
    recommendedBuyMin: 99000,
    recommendedBuyMax: 105000,
    verdict: 'ATENCAO',
    kmEstimated: 52000,
  },
  {
    plate: 'DEF7G89',
    brand: 'Volkswagen',
    model: 'Gol',
    version: '1.0 MPI',
    year: 2018,
    yearModel: 2019,
    color: 'Vermelho',
    fuel: 'Flex',
    fipeCode: '005337-0',
    fipePrice: 48000,
    marketMin: 38000,
    marketMax: 52000,
    marketMedian: 44000,
    totalAds: 3,
    region: 'MG - Interior',
    priceScore: 35,
    liquidityScore: 28,
    riskScore: 30,
    recommendedBuyMin: 39000,
    recommendedBuyMax: 42000,
    verdict: 'EVITAR',
    kmEstimated: 98000,
  },
]

export const MOCK_CHECKLIST: ChecklistItem[] = [
  { label: 'Multas DETRAN', status: 'ok', detail: 'Nenhuma multa pendente' },
  { label: 'IPVA 2024', status: 'ok', detail: 'Pago em dia' },
  { label: 'IPVA 2023', status: 'ok', detail: 'Pago em dia' },
  { label: 'Licenciamento', status: 'ok', detail: 'Vigente ate 12/2024' },
  { label: 'Restricoes judiciais', status: 'ok', detail: 'Nenhuma restricao encontrada' },
  { label: 'Restricoes financeiras', status: 'warning', detail: 'Alienacao fiduciaria - Banco Itau (quitacao necessaria)' },
  { label: 'Recall ativo', status: 'ok', detail: 'Nenhum recall pendente' },
  { label: 'Historico de sinistro', status: 'ok', detail: 'Sem registro de sinistro grave' },
]

export const MOCK_INTENTS: PurchaseIntent[] = [
  {
    id: '1',
    brand: 'Hyundai',
    model: 'HB20',
    yearMin: 2021,
    yearMax: 2024,
    kmMax: 60000,
    priceMax: 75000,
    region: 'SP - Interior',
    minScore: 65,
    status: 'ativo',
    createdAt: '2024-01-15',
    expiresAt: '2024-02-14',
    matchCount: 3,
  },
  {
    id: '2',
    brand: 'Toyota',
    model: 'Corolla',
    yearMin: 2020,
    yearMax: 2023,
    kmMax: 50000,
    priceMax: 120000,
    region: 'SP - Capital',
    minScore: 70,
    status: 'ativo',
    createdAt: '2024-01-20',
    expiresAt: '2024-02-19',
    matchCount: 1,
  },
  {
    id: '3',
    brand: 'Fiat',
    model: 'Argo',
    yearMin: 2022,
    yearMax: 2024,
    kmMax: 40000,
    priceMax: 80000,
    region: 'RJ - Capital',
    minScore: 60,
    status: 'pausado',
    createdAt: '2024-01-10',
    expiresAt: '2024-02-09',
    matchCount: 0,
  },
]

export const MOCK_NETWORK: NetworkVehicle[] = [
  {
    id: '1',
    seller: 'Auto Loja Premium',
    sellerCity: 'Campinas - SP',
    brand: 'Hyundai',
    model: 'HB20',
    version: '1.6 Vision',
    year: 2022,
    km: 32000,
    price: 69900,
    priceScore: 78,
    liquidityScore: 82,
    createdAt: '2024-01-25',
    source: 'rede',
  },
  {
    id: '2',
    seller: 'Canal do Repasse',
    sellerCity: 'Sao Paulo - SP',
    brand: 'Honda',
    model: 'HR-V',
    version: 'EXL CVT',
    year: 2021,
    km: 45000,
    price: 119000,
    priceScore: 71,
    liquidityScore: 75,
    createdAt: '2024-01-24',
    source: 'canal_repasse',
  },
  {
    id: '3',
    seller: 'Particular',
    sellerCity: 'Ribeirao Preto - SP',
    brand: 'Toyota',
    model: 'Corolla',
    version: 'XEi 2.0',
    year: 2022,
    km: 28000,
    price: 128000,
    priceScore: 65,
    liquidityScore: 88,
    createdAt: '2024-01-23',
    source: 'olx',
  },
  {
    id: '4',
    seller: 'Veiculos do Sul',
    sellerCity: 'Curitiba - PR',
    brand: 'Fiat',
    model: 'Pulse',
    version: 'Drive 1.3 CVT',
    year: 2023,
    km: 18000,
    price: 89500,
    priceScore: 82,
    liquidityScore: 79,
    createdAt: '2024-01-22',
    source: 'rede',
  },
  {
    id: '5',
    seller: 'Canal do Repasse',
    sellerCity: 'Belo Horizonte - MG',
    brand: 'Chevrolet',
    model: 'Onix',
    version: 'Premier 1.0 Turbo',
    year: 2023,
    km: 22000,
    price: 82000,
    priceScore: 74,
    liquidityScore: 90,
    createdAt: '2024-01-21',
    source: 'canal_repasse',
  },
]

export const PLANS = [
  {
    name: 'Avulso',
    subtitle: 'Pay-per-use',
    price: 'R$ 4,90',
    period: 'por consulta',
    description: 'Sem assinatura',
    highlighted: false,
    features: {
      precificador: [
        { text: 'Analise pontual de preco', included: true },
        { text: 'Score de liquidez', included: true },
        { text: 'Veredicto Compra/Atencao/Evitar', included: true },
      ],
      checklist: [
        { text: 'Resumo basico de debitos', included: 'partial' as const },
        { text: 'Checklist completo', included: false },
      ],
      buscador: [
        { text: 'Monitoramento continuo', included: false },
        { text: 'Alertas proativos', included: false },
        { text: 'Rede de lojistas', included: false },
      ],
    },
    cta: 'Comecar agora',
    note: 'Ancora de preco. Torna os planos visivelmente vantajosos.',
  },
  {
    name: 'Starter',
    subtitle: 'Basico',
    price: 'R$ 97',
    period: '/mes',
    description: '30 consultas inclusas',
    highlighted: false,
    features: {
      precificador: [
        { text: 'Analise completa de preco', included: true },
        { text: 'Score de liquidez e risco', included: true },
        { text: 'Historico 30 dias', included: true },
      ],
      checklist: [
        { text: 'Debitos DETRAN', included: true },
        { text: 'Restricoes e recall', included: true },
        { text: 'Laudo detalhado', included: false },
      ],
      buscador: [
        { text: 'Busca pontual em portais', included: 'partial' as const },
        { text: 'Monitoramento continuo', included: false },
        { text: 'Rede de lojistas', included: false },
      ],
    },
    cta: 'Assinar Starter',
    note: 'Para autonomos e revendas 1-5/mes. Extra: R$ 3,50/consulta.',
  },
  {
    name: 'Profissional',
    subtitle: 'Pro',
    price: 'R$ 197',
    period: '/mes',
    description: '80 consultas inclusas',
    highlighted: true,
    features: {
      precificador: [
        { text: 'Analise completa de preco', included: true },
        { text: 'Score de liquidez e risco', included: true },
        { text: 'Historico 90 dias + exportacao', included: true },
      ],
      checklist: [
        { text: 'Debitos DETRAN completo', included: true },
        { text: 'Restricoes, recall e sinistro', included: true },
        { text: 'Laudo PDF por consulta', included: true },
      ],
      buscador: [
        { text: 'Monitoramento continuo', included: true },
        { text: '3 alertas ativos - Canal do Repasse', included: true },
        { text: 'Rede de lojistas', included: false },
      ],
    },
    cta: 'Assinar Pro',
    note: 'Sweet spot para revendas 5-20/mes. Extra: R$ 2,90/consulta.',
  },
  {
    name: 'Loja',
    subtitle: 'Equipe',
    price: 'R$ 397',
    period: '/mes',
    description: '200 consultas inclusas',
    highlighted: false,
    features: {
      precificador: [
        { text: 'Analise completa de preco', included: true },
        { text: 'Multi-usuario ilimitado', included: true },
        { text: 'Dashboard web + API beta', included: true },
      ],
      checklist: [
        { text: 'Checklist completo', included: true },
        { text: 'Laudo PDF por consulta', included: true },
        { text: 'Historico 12 meses', included: true },
      ],
      buscador: [
        { text: 'Monitoramento ilimitado', included: true },
        { text: 'Alertas - Canal do Repasse', included: true },
        { text: 'Rede completa + cadastro estoque', included: true },
      ],
    },
    cta: 'Assinar Loja',
    note: 'Para equipes e grupos de lojas. Extra: R$ 2,20/consulta.',
  },
]
