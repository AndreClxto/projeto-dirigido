import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { camaraAPI } from '../services/api';

const Gastos = () => {
  const [idDeputado, setIdDeputado] = useState('');
  const [deputado, setDeputado] = useState(null);
  const [gastos2024, setGastos2024] = useState([]);
  const [gastos2025, setGastos2025] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const buscarGastos = async () => {
    if (!idDeputado) {
      alert('Digite o ID do deputado');
      return;
    }

    try {
      setLoading(true);
      setSearched(true);

      const [gastos24, gastos25, deputados] = await Promise.all([
        camaraAPI.getGastos(idDeputado, 2024),
        camaraAPI.getGastos(idDeputado, 2025),
        camaraAPI.getDeputados()
      ]);

      const depData = deputados.find(d => d.id === parseInt(idDeputado));

      setDeputado(depData);
      setGastos2024(gastos24);
      setGastos2025(gastos25);
    } catch (error) {
      alert('Erro ao buscar gastos. Verifique o ID do deputado.');
      setDeputado(null);
      setGastos2024([]);
      setGastos2025([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const totalGasto2024 = (gastos2024 || []).reduce((sum, g) => sum + (g.valorDocumento || 0), 0);
  const totalGasto2025 = (gastos2025 || []).reduce((sum, g) => sum + (g.valorDocumento || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="text-green-400 hover:text-green-300 mb-2 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </button>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
            💰 Gastos por Deputado
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Busca */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <label className="block text-white mb-2 font-semibold">
              Digite o ID do Deputado:
            </label>
            <div className="flex gap-4">
              <input
                type="number"
                value={idDeputado}
                onChange={(e) => setIdDeputado(e.target.value)}
                placeholder="Ex: 204554"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
                onKeyPress={(e) => e.key === 'Enter' && buscarGastos()}
              />
              <button
                onClick={buscarGastos}
                disabled={loading}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
            <p className="text-white/60 text-sm mt-2">
              💡 Dica: Visite a página "Listar Deputados" para ver os IDs
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-10">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Deputado Info */}
        {!loading && deputado && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto mb-8"
          >
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 border-2 border-green-400 shadow-2xl">
              <div className="flex items-center gap-6 flex-wrap">
                <img
                  src={deputado.foto || deputado.urlFoto}
                  alt={deputado.nomeCivil || deputado.nome}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                />
                <div className="flex-1 min-w-[200px]">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {deputado.nomeCivil || deputado.nome}
                  </h2>
                  <p className="text-white/90">
                    {deputado.partido || deputado.siglaPartido} - {deputado.uf || deputado.siglaUf}
                  </p>
                  {deputado.email && (
                    <p className="text-white/70 text-sm mt-1">{deputado.email}</p>
                  )}
                </div>
                <div className="flex gap-6">
                  <div className="text-center bg-blue-500/30 px-4 py-3 rounded-lg">
                    <div className="text-xs text-white/80 mb-1">2024</div>
                    <div className="text-xl font-bold text-white">
                      {formatCurrency(totalGasto2024)}
                    </div>
                    <div className="text-white/70 text-xs mt-1">
                      {gastos2024.length} despesas
                    </div>
                  </div>
                  <div className="text-center bg-green-500/30 px-4 py-3 rounded-lg">
                    <div className="text-xs text-white/80 mb-1">2025</div>
                    <div className="text-xl font-bold text-white">
                      {formatCurrency(totalGasto2025)}
                    </div>
                    <div className="text-white/70 text-xs mt-1">
                      {gastos2025.length} despesas
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Lista de Gastos - 2 Colunas */}
        {!loading && (gastos2024.length > 0 || gastos2025.length > 0) && (
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Coluna 2024 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-2xl font-bold text-blue-400">
                    Despesas 2024
                  </h3>
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {gastos2024.length} despesas
                  </span>
                </div>
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {gastos2024.length === 0 ? (
                    <p className="text-white/60 text-center py-10">Sem dados de 2024</p>
                  ) : (
                    gastos2024.map((gasto, index) => (
                      <motion.div
                        key={`2024-${gasto.id || index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="bg-blue-500/10 backdrop-blur-md rounded-lg p-4 border border-blue-400/30 hover:bg-blue-500/20 transition-all"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold mb-1 truncate">
                              {gasto.tipoDespesa}
                            </p>
                            <p className="text-white/70 text-sm truncate">
                              {gasto.nomeFornecedor}
                            </p>
                            <p className="text-blue-300 text-xs mt-1">
                              {new Date(gasto.dataDocumento).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-blue-400">
                              {formatCurrency(gasto.valorDocumento)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Coluna 2025 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-2xl font-bold text-green-400">
                    Despesas 2025
                  </h3>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {gastos2025.length} despesas
                  </span>
                </div>
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {gastos2025.length === 0 ? (
                    <p className="text-white/60 text-center py-10">Sem dados de 2025</p>
                  ) : (
                    gastos2025.map((gasto, index) => (
                      <motion.div
                        key={`2025-${gasto.id || index}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="bg-green-500/10 backdrop-blur-md rounded-lg p-4 border border-green-400/30 hover:bg-green-500/20 transition-all"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold mb-1 truncate">
                              {gasto.tipoDespesa}
                            </p>
                            <p className="text-white/70 text-sm truncate">
                              {gasto.nomeFornecedor}
                            </p>
                            <p className="text-green-300 text-xs mt-1">
                              {new Date(gasto.dataDocumento).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-400">
                              {formatCurrency(gasto.valorDocumento)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mensagem se não encontrou */}
        {!loading && searched && !deputado && (
          <div className="text-center py-10">
            <p className="text-white/60 text-lg">
              Deputado não encontrado. Verifique o ID.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Gastos;
