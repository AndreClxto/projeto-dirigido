package main

import (
	"log"
	"portal-transparencia/database"
	"portal-transparencia/handlers"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	// Inicializar banco de dados
	if err := database.InitDB(); err != nil {
		log.Fatal("❌ Erro ao conectar ao banco:", err)
	}
	defer database.DB.Close()

	// Criar app Fiber
	app := fiber.New(fiber.Config{
		AppName: "Portal da Transparência API v1.0",
	})

	// Middlewares
	app.Use(logger.New(logger.Config{
		Format:     "${time} | ${status} | ${latency} | ${method} ${path}\n",
		TimeFormat: "15:04:05",
		TimeZone:   "America/Sao_Paulo",
	}))

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// Rotas
	api := app.Group("/api")

	// Deputados
	api.Get("/deputados", handlers.ListarDeputados)
	api.Get("/deputados/:id/gastos", handlers.BuscarGastosDeputado)
	api.Get("/deputados/:id/projetos", handlers.BuscarProjetosDeputado)

	// Ranking
	api.Get("/ranking", handlers.BuscarRanking)

	// Estatísticas
	api.Get("/estatisticas", handlers.Estatisticas)

	// Sincronização (manual)
	api.Post("/sync", handlers.SincronizarDados)

	// Health check
	api.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status": "ok",
			"time":   time.Now(),
		})
	})

	// Rota raiz
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "🏛️ Portal da Transparência API",
			"version": "1.0",
			"endpoints": []string{
				"GET  /api/deputados",
				"GET  /api/deputados/:id/gastos?ano=2024",
				"GET  /api/deputados/:id/projetos",
				"GET  /api/ranking?ano=2024&limite=20",
				"GET  /api/estatisticas",
				"POST /api/sync",
			},
		})
	})

	log.Println("🚀 Servidor rodando em http://localhost:8080")
	log.Println("📊 Para sincronizar dados: POST http://localhost:8080/api/sync")
	log.Fatal(app.Listen(":8080"))
}
