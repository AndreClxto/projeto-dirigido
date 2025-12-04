import axios from 'axios';

// Backend local (Go + SQLite)
const API_BASE = 'http://localhost:8080/api';

export const camaraAPI = {
  // Lista todos os deputados (do banco local)
  async getDeputados() {
    try {
      const response = await axios.get(`${API_BASE}/deputados`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar deputados:', error);
      throw error;
    }
  },

  // Busca gastos de um deputado específico (do banco local)
  async getGastos(idDeputado, ano = new Date().getFullYear()) {
    try {
      const response = await axios.get(`${API_BASE}/deputados/${idDeputado}/gastos`, {
        params: { ano }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar gastos:', error);
      throw error;
    }
  },

  // Busca ranking de gastos (do banco local - RÁPIDO!)
  async getRankingGastos(ano, limite = 20) {
    try {
      const response = await axios.get(`${API_BASE}/ranking`, {
        params: { ano, limite }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar ranking:', error);
      throw error;
    }
  },

  // Busca estatísticas gerais
  async getEstatisticas() {
    try {
      const response = await axios.get(`${API_BASE}/estatisticas`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  },

  // Sincroniza dados da API Câmara
  async sincronizarDados() {
    try {
      const response = await axios.post(`${API_BASE}/sync`);
      return response.data;
    } catch (error) {
      console.error('Erro ao sincronizar:', error);
      throw error;
    }
  }
};
