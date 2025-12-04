import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { camaraAPI } from '../services/api';

const Ranking = () => {
  const [ranking2024, setRanking2024] = useState([]);
  const [ranking2025, setRanking2025] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadRankings();
  }, []);

  const loadRankings = async () => {
    try {
      setLoading(true);

      // Buscar rankings direto do backend (já processados!)
      const [ranking24, ranking25] = await Promise.all([
        processRanking(2024),
        processRanking(2025)
      ]);

      setRanking2024(ranking24);
      setRanking2025(ranking25);

    } catch (error) {
      alert('Erro ao carregar ranking. Certifique-se que o backend está rodando!');
    } finally {
      setLoading(false);
    }
  };

  const processRanking = async (ano) => {
    // Backend já retorna ordenado e processado!
    const ranking = await camaraAPI.getRankingGastos(ano, 10);
    return ranking;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="text-orange-400 hover:text-orange-300 mb-2 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </button>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
            🏆 Ranking de Gastos - Comparativo
          </h1>
          <p className="text-orange-200 mt-2">TOP 10 Maiores Gastadores (2024 vs 2025)</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Loading */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white/60">Calculando ranking... Isso pode demorar um pouco</p>
          </div>
        )}

        {/* Ranking 2024 */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Coluna 2024 */}
            <div>
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-3xl font-bold text-blue-400">2024</span>
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  ANO ANTERIOR
                </span>
              </div>

              {ranking2024.map((deputado, index) => (
                <motion.div
                  key={`2024-${deputado.id}`}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    mb-3 p-4 rounded-xl border-2 transition-all hover:scale-102
                    ${index === 0 ? 'bg-gradient-to-r from-yellow-600 to-orange-600 border-yellow-400' :
                      index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600 border-gray-300' :
                      index === 2 ? 'bg-gradient-to-r from-amber-700 to-amber-900 border-amber-600' :
                      'bg-white/10 backdrop-blur-md border-white/20'}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[40px]">
                      <div className="text-2xl font-bold text-white">#{deputado.posicao}</div>
                      {index === 0 && <div className="text-xl">👑</div>}
                    </div>
                    <img
                      src={deputado.urlFoto}
                      alt={deputado.nome}
                      className="w-14 h-14 rounded-full border-2 border-white"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-white truncate">
                        {deputado.nome}
                      </h3>
                      <p className="text-white/80 text-xs">
                        {deputado.siglaPartido} - {deputado.siglaUf}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">
                        {formatCurrency(deputado.totalGasto)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Coluna 2025 */}
            <div>
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-3xl font-bold text-green-400">2025</span>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  ANO ATUAL
                </span>
              </div>

              {ranking2025.map((deputado, index) => (
                <motion.div
                  key={`2025-${deputado.id}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    mb-3 p-4 rounded-xl border-2 transition-all hover:scale-102
                    ${index === 0 ? 'bg-gradient-to-r from-yellow-600 to-orange-600 border-yellow-400' :
                      index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600 border-gray-300' :
                      index === 2 ? 'bg-gradient-to-r from-amber-700 to-amber-900 border-amber-600' :
                      'bg-white/10 backdrop-blur-md border-white/20'}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[40px]">
                      <div className="text-2xl font-bold text-white">#{deputado.posicao}</div>
                      {index === 0 && <div className="text-xl">👑</div>}
                    </div>
                    <img
                      src={deputado.urlFoto}
                      alt={deputado.nome}
                      className="w-14 h-14 rounded-full border-2 border-white"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-white truncate">
                        {deputado.nome}
                      </h3>
                      <p className="text-white/80 text-xs">
                        {deputado.siglaPartido} - {deputado.siglaUf}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">
                        {formatCurrency(deputado.totalGasto)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Ranking;
