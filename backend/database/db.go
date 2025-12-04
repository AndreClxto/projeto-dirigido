package database

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

// InitDB inicializa o banco de dados SQLite
func InitDB() error {
	var err error
	DB, err = sql.Open("sqlite3", "./transparencia.db")
	if err != nil {
		return err
	}

	// Testar conexão
	if err = DB.Ping(); err != nil {
		return err
	}

	log.Println("✅ Banco de dados SQLite conectado")

	// Criar tabelas
	return createTables()
}

func createTables() error {
	// Tabela de deputados
	deputadosTable := `
	CREATE TABLE IF NOT EXISTS deputados (
		id INTEGER PRIMARY KEY,
		nome TEXT NOT NULL,
		nome_civil TEXT,
		partido TEXT,
		uf TEXT,
		foto TEXT,
		email TEXT,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	CREATE INDEX IF NOT EXISTS idx_deputados_partido ON deputados(partido);
	CREATE INDEX IF NOT EXISTS idx_deputados_uf ON deputados(uf);
	`

	// Tabela de despesas
	despesasTable := `
	CREATE TABLE IF NOT EXISTS despesas (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		deputado_id INTEGER NOT NULL,
		ano INTEGER NOT NULL,
		mes INTEGER,
		tipo_despesa TEXT,
		data_documento TEXT,
		valor_documento REAL,
		valor_liquido REAL,
		nome_fornecedor TEXT,
		cnpj_fornecedor TEXT,
		num_documento TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (deputado_id) REFERENCES deputados(id),
		UNIQUE(deputado_id, ano, num_documento, valor_documento)
	);
	CREATE INDEX IF NOT EXISTS idx_despesas_deputado ON despesas(deputado_id);
	CREATE INDEX IF NOT EXISTS idx_despesas_ano ON despesas(ano);
	`

	// Tabela de cache de rankings
	rankingTable := `
	CREATE TABLE IF NOT EXISTS ranking_cache (
		ano INTEGER PRIMARY KEY,
		data TEXT NOT NULL,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);
	`

	tables := []string{deputadosTable, despesasTable, rankingTable}

	for _, table := range tables {
		if _, err := DB.Exec(table); err != nil {
			return err
		}
	}

	log.Println("✅ Tabelas criadas/verificadas")
	return nil
}

// SalvarDeputado salva ou atualiza um deputado
func SalvarDeputado(d *Deputado) error {
	query := `
	INSERT INTO deputados (id, nome, nome_civil, partido, uf, foto, email, updated_at)
	VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
	ON CONFLICT(id) DO UPDATE SET
		nome = excluded.nome,
		nome_civil = excluded.nome_civil,
		partido = excluded.partido,
		uf = excluded.uf,
		foto = excluded.foto,
		email = excluded.email,
		updated_at = CURRENT_TIMESTAMP
	`
	_, err := DB.Exec(query, d.ID, d.Nome, d.NomeCivil, d.Partido, d.UF, d.Foto, d.Email)
	return err
}

// SalvarDespesa salva uma despesa (ignora duplicatas)
func SalvarDespesa(d *Despesa) error {
	query := `
	INSERT OR IGNORE INTO despesas
	(deputado_id, ano, mes, tipo_despesa, data_documento, valor_documento, valor_liquido,
	 nome_fornecedor, cnpj_fornecedor, num_documento)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`
	_, err := DB.Exec(query, d.DeputadoID, d.Ano, d.Mes, d.TipoDespesa, d.DataDocumento,
		d.ValorDocumento, d.ValorLiquido, d.NomeFornecedor, d.CNPJFornecedor, d.NumDocumento)
	return err
}

// BuscarDeputados retorna todos os deputados
func BuscarDeputados() ([]Deputado, error) {
	query := `SELECT id, nome, nome_civil, partido, uf, foto, email FROM deputados ORDER BY nome`
	rows, err := DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var deputados []Deputado
	for rows.Next() {
		var d Deputado
		err := rows.Scan(&d.ID, &d.Nome, &d.NomeCivil, &d.Partido, &d.UF, &d.Foto, &d.Email)
		if err != nil {
			return nil, err
		}
		deputados = append(deputados, d)
	}

	return deputados, nil
}

// BuscarGastos retorna gastos de um deputado em um ano
func BuscarGastos(deputadoID, ano int) ([]Despesa, error) {
	query := `
	SELECT id, deputado_id, ano, mes, tipo_despesa, data_documento,
	       valor_documento, valor_liquido, nome_fornecedor, cnpj_fornecedor, num_documento
	FROM despesas
	WHERE deputado_id = ? AND ano = ?
	ORDER BY data_documento DESC
	`
	rows, err := DB.Query(query, deputadoID, ano)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var despesas []Despesa
	for rows.Next() {
		var d Despesa
		err := rows.Scan(&d.ID, &d.DeputadoID, &d.Ano, &d.Mes, &d.TipoDespesa,
			&d.DataDocumento, &d.ValorDocumento, &d.ValorLiquido,
			&d.NomeFornecedor, &d.CNPJFornecedor, &d.NumDocumento)
		if err != nil {
			return nil, err
		}
		despesas = append(despesas, d)
	}

	return despesas, nil
}

// BuscarRanking retorna ranking de gastos por ano
func BuscarRanking(ano, limite int) ([]RankingDeputado, error) {
	query := `
	SELECT
		d.id, d.nome, d.nome_civil, d.partido, d.uf, d.foto, d.email,
		COALESCE(SUM(desp.valor_documento), 0) as total_gasto,
		COUNT(desp.id) as num_gastos
	FROM deputados d
	LEFT JOIN despesas desp ON d.id = desp.deputado_id AND desp.ano = ?
	GROUP BY d.id
	HAVING total_gasto > 0
	ORDER BY total_gasto DESC
	LIMIT ?
	`
	rows, err := DB.Query(query, ano, limite)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var ranking []RankingDeputado
	posicao := 1
	for rows.Next() {
		var r RankingDeputado
		err := rows.Scan(&r.ID, &r.Nome, &r.NomeCivil, &r.Partido, &r.UF, &r.Foto,
			&r.Email, &r.TotalGasto, &r.NumeroGastos)
		if err != nil {
			return nil, err
		}
		r.Posicao = posicao
		ranking = append(ranking, r)
		posicao++
	}

	return ranking, nil
}

// ContarDeputados retorna o número de deputados no banco
func ContarDeputados() (int, error) {
	var count int
	err := DB.QueryRow("SELECT COUNT(*) FROM deputados").Scan(&count)
	return count, err
}

// ContarDespesas retorna o número de despesas de um ano
func ContarDespesas(ano int) (int, error) {
	var count int
	err := DB.QueryRow("SELECT COUNT(*) FROM despesas WHERE ano = ?", ano).Scan(&count)
	return count, err
}
