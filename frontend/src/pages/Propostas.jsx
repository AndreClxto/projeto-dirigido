import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Propostas = () => {
  const [idDeputado, setIdDeputado] = useState('');
  const [deputado, setDeputado] = useState(null);
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const buscarPropostas = async () => {
    if (!idDeputado) {
      alert('Digite o ID do deputado');
      return;
    }

    try {
      setLoading(true);
      setSearched(true);

      const [projetosData, deputadosData] = await Promise.all([
        axios.get(`http://localhost:8080/api/deputados/${idDeputado}/projetos`),
        axios.get('http://localhost:8080/api/deputados')
      ]);

      const depData = deputadosData.data.find(d => d.id === parseInt(idDeputado));

      console.log('📋 Projetos recebidos:', projetosData.data);
      if (projetosData.data && projetosData.data.length > 0) {
        console.log('🔍 Primeiro projeto:', projetosData.data[0]);
      }

      setDeputado(depData);
      setProjetos(projetosData.data || []);
    } catch (error) {
      alert('Erro ao buscar propostas. Verifique o ID do deputado.');
      setDeputado(null);
      setProjetos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="text-indigo-400 hover:text-indigo-300 mb-2 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </button>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
            📜 Propostas por Deputado
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
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onKeyPress={(e) => e.key === 'Enter' && buscarPropostas()}
              />
              <button
                onClick={buscarPropostas}
                disabled={loading}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Deputado Info */}
        {!loading && deputado && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto mb-8"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 border-2 border-indigo-400 shadow-2xl">
              <div className="flex items-center gap-6 flex-wrap">
                <img
                  src={deputado.urlFoto}
                  alt={deputado.nome}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                />
                <div className="flex-1 min-w-[200px]">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {deputado.nome}
                  </h2>
                  <p className="text-white/90">
                    {deputado.siglaPartido} - {deputado.siglaUf}
                  </p>
                  {deputado.email && (
                    <p className="text-white/70 text-sm mt-1">{deputado.email}</p>
                  )}
                </div>
                <div className="text-center bg-white/20 px-6 py-4 rounded-lg">
                  <div className="text-xs text-white/80 mb-1">Total de Propostas</div>
                  <div className="text-3xl font-bold text-white">
                    {projetos.length}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Lista de Propostas */}
        {!loading && projetos.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-2xl font-bold text-indigo-400">
                Proposições Legislativas
              </h3>
              <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                {projetos.length} projetos
              </span>
            </div>
            <div className="space-y-4">
              {projetos.map((projeto, index) => (
                <motion.div
                  key={projeto.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all"
                >
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {projeto.siglaTipo} {projeto.numero}/{projeto.ano}
                      </span>
                      {projeto.dataApresentacao && (
                        <span className="text-indigo-300 text-sm">
                          {new Date(projeto.dataApresentacao).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-white/90 text-base leading-relaxed mb-4">
                    {projeto.ementa}
                  </p>
                  <a
                    href={`https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=${projeto.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Ver detalhes na Câmara
                  </a>
                </motion.div>
              ))}
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

        {/* Mensagem se não tem propostas */}
        {!loading && searched && deputado && projetos.length === 0 && (
          <div className="text-center py-10">
            <p className="text-white/60 text-lg">
              Este deputado não possui propostas cadastradas.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Propostas;
