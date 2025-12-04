import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { camaraAPI } from '../services/api';

const Deputados = () => {
  const [deputados, setDeputados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadDeputados();
  }, []);

  const loadDeputados = async () => {
    try {
      setLoading(true);
      const data = await camaraAPI.getDeputados();
      setDeputados(data);
    } catch (error) {
      alert('Erro ao carregar deputados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const deputadosFiltrados = deputados.filter(dep =>
    dep.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    dep.siglaPartido.toLowerCase().includes(filtro.toLowerCase()) ||
    dep.siglaUf.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="text-blue-400 hover:text-blue-300 mb-2 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </button>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
            👥 Deputados Federais
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filtro */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Buscar por nome, partido ou UF..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="w-full max-w-md px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-white/60 mt-2 text-sm">
            {deputadosFiltrados.length} deputado(s) encontrado(s)
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Grid de Deputados */}
        {!loading && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {deputadosFiltrados.map((deputado, index) => (
              <motion.div
                key={deputado.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={deputado.urlFoto}
                    alt={deputado.nome}
                    className="w-20 h-20 rounded-full border-4 border-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-white text-lg">
                        {deputado.nome}
                      </h3>
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-mono">
                        ID: {deputado.id}
                      </span>
                    </div>
                    <p className="text-blue-300 text-sm">
                      {deputado.siglaPartido} - {deputado.siglaUf}
                    </p>
                    {deputado.email && (
                      <p className="text-white/60 text-xs mt-2 truncate">
                        {deputado.email}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Deputados;
