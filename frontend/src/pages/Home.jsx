import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const buttons = [
    {
      title: '👥 Listar Deputados',
      description: 'Veja todos os deputados federais em exercício',
      color: 'from-blue-500 to-blue-700',
      path: '/deputados'
    },
    {
      title: '🏆 Ranking de Gastos',
      description: 'TOP 20 deputados que mais gastam',
      color: 'from-red-500 to-orange-600',
      path: '/ranking',
      badge: 'DESTAQUE'
    },
    {
      title: '💰 Gastos por Deputado',
      description: 'Detalhes de gastos de um deputado específico',
      color: 'from-green-500 to-emerald-600',
      path: '/gastos'
    },
    {
      title: '📊 Estatísticas Gerais',
      description: 'Números e dados consolidados',
      color: 'from-purple-500 to-pink-600',
      path: '/estatisticas'
    },
    {
      title: '📜 Propostas por Deputado',
      description: 'Veja quais projetos de lei cada deputado propôs',
      color: 'from-indigo-500 to-purple-600',
      path: '/propostas'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <motion.h1
            className="text-4xl md:text-5xl font-display font-bold text-white text-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Portal da Transparência
          </motion.h1>
          <motion.p
            className="text-center text-blue-200 mt-2 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Dados públicos ao alcance de um clique
          </motion.p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {buttons.map((button, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(button.path)}
              className="relative cursor-pointer group"
            >
              <div className={`
                bg-gradient-to-br ${button.color}
                p-8 rounded-2xl
                shadow-2xl shadow-black/50
                border border-white/20
                transition-all duration-300
                hover:shadow-3xl hover:shadow-purple-500/50
              `}>
                {/* Badge se houver */}
                {button.badge && (
                  <div className="absolute -top-3 -right-3 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    {button.badge}
                  </div>
                )}

                <h2 className="text-3xl font-display font-bold text-white mb-3">
                  {button.title}
                </h2>
                <p className="text-white/90 text-lg">
                  {button.description}
                </p>

                {/* Arrow Icon */}
                <div className="absolute bottom-6 right-6 text-white/50 group-hover:text-white group-hover:translate-x-2 transition-all">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Info */}
        <motion.div
          className="text-center mt-16 text-white/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-sm">
            Dados fornecidos pela API da Câmara dos Deputados
          </p>
          <p className="text-xs mt-2">
            Projeto Acadêmico - 2025
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Home;
