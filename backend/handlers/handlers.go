package handlers

import (
	"log"
	"portal-transparencia/database"
	"portal-transparencia/services"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

// ListarDeputados retorna todos os deputados do banco
func ListarDeputados(c *fiber.Ctx) error {
	deputados, err := database.BuscarDeputados()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Erro ao buscar deputados",
		})
	}

	return c.JSON(deputados)
}

// BuscarGastosDeputado retorna gastos de um deputado em um ano
func BuscarGastosDeputado(c *fiber.Ctx) error {
	idParam := c.Params("id")
	anoParam := c.Query("ano", strconv.Itoa(2024))

	id, err := strconv.Atoi(idParam)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "ID inválido",
		})
	}

	ano, err := strconv.Atoi(anoParam)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Ano inválido",
		})
	}

	gastos, err := database.BuscarGastos(id, ano)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Erro ao buscar gastos",
		})
	}

	return c.JSON(gastos)
}

// BuscarRanking retorna ranking de gastos
func BuscarRanking(c *fiber.Ctx) error {
	anoParam := c.Query("ano", "2024")
	limiteParam := c.Query("limite", "20")

	ano, _ := strconv.Atoi(anoParam)
	limite, _ := strconv.Atoi(limiteParam)

	ranking, err := database.BuscarRanking(ano, limite)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Erro ao buscar ranking",
		})
	}

	return c.JSON(ranking)
}

// SincronizarDados sincroniza dados da API Câmara
func SincronizarDados(c *fiber.Ctx) error {
	// Sincronizar deputados
	if err := services.SincronizarDeputados(); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Erro ao sincronizar deputados: " + err.Error(),
		})
	}

	// Sincronizar gastos de 2024 e 2025
	anos := []int{2024, 2025}
	for _, ano := range anos {
		if err := services.SincronizarGastos(ano); err != nil {
			return c.Status(500).JSON(fiber.Map{
				"error": "Erro ao sincronizar gastos de " + strconv.Itoa(ano),
			})
		}
	}

	return c.JSON(fiber.Map{
		"message": "Sincronização concluída com sucesso!",
	})
}

// Estatisticas retorna estatísticas gerais
func Estatisticas(c *fiber.Ctx) error {
	totalDeputados, _ := database.ContarDeputados()
	total2024, _ := database.ContarDespesas(2024)
	total2025, _ := database.ContarDespesas(2025)

	return c.JSON(fiber.Map{
		"totalDeputados":   totalDeputados,
		"totalGastos2024":  total2024,
		"totalGastos2025":  total2025,
		"ultimaAtualizacao": "Agora",
	})
}

// BuscarProjetosDeputado retorna proposições de um deputado
func BuscarProjetosDeputado(c *fiber.Ctx) error {
	idParam := c.Params("id")

	id, err := strconv.Atoi(idParam)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "ID inválido",
		})
	}

	log.Printf("🔍 Buscando projetos do deputado ID: %d", id)

	projetos, err := services.BuscarProjetosPorDeputado(id)
	if err != nil {
		log.Printf("❌ Erro ao buscar projetos: %v", err)
		return c.Status(500).JSON(fiber.Map{
			"error": "Erro ao buscar projetos",
		})
	}

	log.Printf("✅ Retornando %d projetos", len(projetos))
	return c.JSON(projetos)
}
