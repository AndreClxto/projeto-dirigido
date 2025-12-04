import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { camaraAPI } from '../services/api';

const Estatisticas = () => {
  const [stats, setStats] = useState({
    totalDeputados: 0,
    deputadosCarregados: 0,
    loading: true
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const deputados = await camaraAPI.getDeputados();
      setStats({
        totalDeputados: deputados.length,
        deputadosCarregados: deputados.length,
        loading: false
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const statCards = [
    {
      title: 'Deputados Federais',
      value: stats.totalDeputados,
      icon: '👥',
      color: 'from-blue-500 to-blue-700',
      description: 'Em exercício atualmente'
    },
    {
      title: 'Dados Disponíveis',
      value: new Date().getFullYear(),
      icon: '📅',
      color: 'from-purple-500 to-purple-700',
      description: 'Ano de referência'
    },
    {
      title: 'Fonte de Dados',
      value: 'API Câmara',
      icon: '🏛️',
      color: 'from-green-500 to-green-700',
      description: 'Dados abertos oficiais'
    },
    {
      title: 'Transparência',
      value: '100%',
      icon: '✅',
      color: 'from-orange-500 to-orange-700',
      description: 'Dados públicos e acessíveis'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="text-purple-400 hover:text-purple-300 mb-2 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </button>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
            📊 Estatísticas Gerais
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Loading */}
        {stats.loading && (
          <div className="flex justify-center py-20">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Stats Grid */}
        {!stats.loading && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {statCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`
                  bg-gradient-to-br ${card.color}
                  p-6 rounded-2xl
                  border-2 border-white/20
                  shadow-2xl shadow-black/50
                `}
              >
                <div className="text-5xl mb-4">{card.icon}</div>
                <h3 className="text-white/90 text-sm font-semibold mb-2">
                  {card.title}
                </h3>
                <div className="text-4xl font-bold text-white mb-2">
                  {card.value}
                </div>
                <p className="text-white/70 text-sm">
                  {card.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto mt-12"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              Sobre os Dados
            </h2>
            <div className="space-y-3 text-white/80">
              <p>
                📌 Todos os dados são obtidos em tempo real da <strong>API de Dados Abertos da Câmara dos Deputados</strong>.
              </p>
              <p>
                📌 As informações incluem dados de deputados em exercício, suas despesas e gastos públicos.
              </p>
              <p>
                📌 Este projeto é acadêmico e tem fins educacionais de promover transparência e cidadania.
              </p>
              <p>
                📌 Para mais informações, acesse:
                <a
                  href="https://dadosabertos.camara.leg.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 ml-2 underline"
                >
                  dadosabertos.camara.leg.br
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Estatisticas;
