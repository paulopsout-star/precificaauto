import { Car } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <Car className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Precifica<span className="text-brand-400">Auto</span>
              </span>
            </div>
            <p className="text-sm max-w-xs">
              Decisao inteligente para lojistas de veiculos usados.
              Analise de preco, liquidez e risco em menos de 30 segundos.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <h4 className="text-white font-semibold mb-3">Produto</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Precificador</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Checklist Documental</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Buscador</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Rede de Lojistas</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Empresa</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Canal do Repasse</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos de uso</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-800 text-sm text-center">
          &copy; 2024 PrecificaAuto. Todos os direitos reservados. Parte do grupo Canal do Repasse.
        </div>
      </div>
    </footer>
  )
}
