package database

import "time"

// Deputado representa um deputado federal
type Deputado struct {
	ID           int       `json:"id"`
	Nome         string    `json:"nome"`
	NomeCivil    string    `json:"nomeCivil"`
	Partido      string    `json:"siglaPartido"`
	UF           string    `json:"siglaUf"`
	Foto         string    `json:"urlFoto"`
	Email        string    `json:"email"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

// Despesa representa uma despesa de deputado
type Despesa struct {
	ID              int       `json:"id"`
	DeputadoID      int       `json:"deputadoId"`
	Ano             int       `json:"ano"`
	Mes             int       `json:"mes"`
	TipoDespesa     string    `json:"tipoDespesa"`
	DataDocumento   string    `json:"dataDocumento"`
	ValorDocumento  float64   `json:"valorDocumento"`
	ValorLiquido    float64   `json:"valorLiquido"`
	NomeFornecedor  string    `json:"nomeFornecedor"`
	CNPJFornecedor  string    `json:"cnpjCPFFornecedor"`
	NumDocumento    string    `json:"numDocumento"`
	CreatedAt       time.Time `json:"createdAt"`
}

// RankingDeputado representa um deputado no ranking
type RankingDeputado struct {
	Deputado
	TotalGasto  float64 `json:"totalGasto"`
	NumeroGastos int    `json:"numeroGastos"`
	Posicao     int     `json:"posicao"`
}

// Projeto representa uma proposição (projeto de lei) de um deputado
type Projeto struct {
	ID               int    `json:"id"`
	Tipo             string `json:"siglaTipo"`
	Numero           int    `json:"numero"`
	Ano              int    `json:"ano"`
	Ementa           string `json:"ementa"`
	DataApresentacao string `json:"dataApresentacao"`
	URLInteiro       string `json:"urlInteiroTeor"`
}
