package services

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"portal-transparencia/database"
	"time"
)

const API_BASE = "https://dadosabertos.camara.leg.br/api/v2"

// Estruturas de resposta da API
type APIResponse struct {
	Dados []map[string]interface{} `json:"dados"`
	Links []map[string]interface{} `json:"links"`
}

// SincronizarDeputados busca TODOS os deputados da API com paginação
func SincronizarDeputados() error {
	log.Println("🔄 Iniciando sincronização de deputados...")

	pagina := 1
	totalDeputados := 0

	for {
		url := fmt.Sprintf("%s/deputados?ordem=ASC&ordenarPor=nome&itens=100&pagina=%d", API_BASE, pagina)

		resp, err := http.Get(url)
		if err != nil {
			return fmt.Errorf("erro ao buscar deputados página %d: %v", pagina, err)
		}

		body, _ := io.ReadAll(resp.Body)
		resp.Body.Close()

		var apiResp APIResponse
		if err := json.Unmarshal(body, &apiResp); err != nil {
			return fmt.Errorf("erro ao decodificar página %d: %v", pagina, err)
		}

		// Se não há mais dados, termina
		if len(apiResp.Dados) == 0 {
			break
		}

		// Salvar cada deputado
		for _, d := range apiResp.Dados {
			deputado := &database.Deputado{
				ID:        int(d["id"].(float64)),
				Nome:      getStr(d, "nome"),
				NomeCivil: getStr(d, "nomeCivil"),
				Partido:   getStr(d, "siglaPartido"),
				UF:        getStr(d, "siglaUf"),
				Foto:      getStr(d, "urlFoto"),
				Email:     getStr(d, "email"),
			}

			if err := database.SalvarDeputado(deputado); err != nil {
				log.Printf("⚠️  Erro ao salvar deputado %d: %v", deputado.ID, err)
			} else {
				totalDeputados++
			}
		}

		log.Printf("📄 Página %d processada (%d deputados)", pagina, len(apiResp.Dados))

		// Se retornou menos de 100, é a última página
		if len(apiResp.Dados) < 100 {
			break
		}

		pagina++
		time.Sleep(200 * time.Millisecond) // Rate limiting gentil
	}

	log.Printf("✅ %d deputados sincronizados!", totalDeputados)
	return nil
}

// SincronizarGastos busca gastos de todos os deputados para um ano
func SincronizarGastos(ano int) error {
	log.Printf("🔄 Iniciando sincronização de gastos de %d...", ano)

	deputados, err := database.BuscarDeputados()
	if err != nil {
		return err
	}

	totalGastos := 0
	for i, dep := range deputados {
		gastos, err := buscarGastosPaginados(dep.ID, ano)
		if err != nil {
			log.Printf("⚠️  Erro ao buscar gastos do deputado %d: %v", dep.ID, err)
			continue
		}

		for _, gasto := range gastos {
			if err := database.SalvarDespesa(&gasto); err != nil {
				// Ignora erros de duplicação
				continue
			}
			totalGastos++
		}

		if (i+1)%10 == 0 {
			log.Printf("📊 Progresso: %d/%d deputados processados", i+1, len(deputados))
		}

		time.Sleep(100 * time.Millisecond) // Rate limiting
	}

	log.Printf("✅ %d gastos de %d sincronizados!", totalGastos, ano)
	return nil
}

// buscarGastosPaginados busca TODOS os gastos de um deputado (com paginação)
func buscarGastosPaginados(deputadoID, ano int) ([]database.Despesa, error) {
	var todasDespesas []database.Despesa
	pagina := 1

	for {
		url := fmt.Sprintf("%s/deputados/%d/despesas?ano=%d&itens=100&pagina=%d&ordem=DESC&ordenarPor=dataDocumento",
			API_BASE, deputadoID, ano, pagina)

		resp, err := http.Get(url)
		if err != nil {
			return nil, err
		}

		body, _ := io.ReadAll(resp.Body)
		resp.Body.Close()

		var apiResp APIResponse
		if err := json.Unmarshal(body, &apiResp); err != nil {
			return nil, err
		}

		if len(apiResp.Dados) == 0 {
			break
		}

		// Converter para Despesa
		for _, d := range apiResp.Dados {
			despesa := database.Despesa{
				DeputadoID:     deputadoID,
				Ano:            ano,
				Mes:            int(getFloat(d, "mes")),
				TipoDespesa:    getStr(d, "tipoDespesa"),
				DataDocumento:  getStr(d, "dataDocumento"),
				ValorDocumento: getFloat(d, "valorDocumento"),
				ValorLiquido:   getFloat(d, "valorLiquido"),
				NomeFornecedor: getStr(d, "nomeFornecedor"),
				CNPJFornecedor: getStr(d, "cnpjCPFFornecedor"),
				NumDocumento:   getStr(d, "numDocumento"),
			}
			todasDespesas = append(todasDespesas, despesa)
		}

		// Se retornou menos de 100, é a última página
		if len(apiResp.Dados) < 100 {
			break
		}

		pagina++
	}

	return todasDespesas, nil
}

// BuscarProjetosPorDeputado busca TODAS as proposições de um deputado
func BuscarProjetosPorDeputado(deputadoID int) ([]database.Projeto, error) {
	var todosProjetos []database.Projeto
	pagina := 1

	for {
		url := fmt.Sprintf("%s/proposicoes?idDeputadoAutor=%d&itens=100&pagina=%d&ordem=DESC&ordenarPor=id",
			API_BASE, deputadoID, pagina)

		log.Printf("🔍 Buscando propostas: %s", url)

		resp, err := http.Get(url)
		if err != nil {
			log.Printf("❌ Erro na requisição HTTP: %v", err)
			return nil, err
		}

		body, _ := io.ReadAll(resp.Body)
		resp.Body.Close()

		log.Printf("📄 Status HTTP: %d | Tamanho resposta: %d bytes", resp.StatusCode, len(body))

		var apiResp APIResponse
		if err := json.Unmarshal(body, &apiResp); err != nil {
			log.Printf("❌ Erro ao decodificar JSON: %v", err)
			log.Printf("📄 Resposta recebida: %s", string(body))
			return nil, err
		}

		log.Printf("✅ Página %d: %d propostas encontradas", pagina, len(apiResp.Dados))

		if len(apiResp.Dados) == 0 {
			break
		}

		// Converter para Projeto
		for _, p := range apiResp.Dados {
			projeto := database.Projeto{
				ID:               int(getFloat(p, "id")),
				Tipo:             getStr(p, "siglaTipo"),
				Numero:           int(getFloat(p, "numero")),
				Ano:              int(getFloat(p, "ano")),
				Ementa:           getStr(p, "ementa"),
				DataApresentacao: getStr(p, "dataApresentacao"),
				URLInteiro:       getStr(p, "urlInteiroTeor"),
			}
			todosProjetos = append(todosProjetos, projeto)
		}

		// Se retornou menos de 100, é a última página
		if len(apiResp.Dados) < 100 {
			break
		}

		pagina++
		time.Sleep(200 * time.Millisecond) // Rate limiting
	}

	return todosProjetos, nil
}

// Funções auxiliares para extrair valores do map
func getStr(m map[string]interface{}, key string) string {
	if v, ok := m[key]; ok && v != nil {
		if s, ok := v.(string); ok {
			return s
		}
	}
	return ""
}

func getFloat(m map[string]interface{}, key string) float64 {
	if v, ok := m[key]; ok && v != nil {
		if f, ok := v.(float64); ok {
			return f
		}
	}
	return 0
}
