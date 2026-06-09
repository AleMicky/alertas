.DEFAULT_GOAL := help

ROOT_DIR   := $(CURDIR)
API_DIR    := ms-alertas
WEB_DIR    := dashboard-web
COMPOSE    := docker compose

# ── Ayuda ──────────────────────────────────────────────────────────────────────

.PHONY: help
help: ## Muestra esta ayuda
	@echo ""
	@echo "  Alertas — comandos disponibles"
	@echo ""
	@grep -E '^[a-zA-Z0-9_-]+:.*##' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'
	@echo ""

# ── Configuración inicial ─────────────────────────────────────────────────────

.PHONY: setup env volumes install install-api install-web
setup: env volumes install up seed ## Setup completo: .env + deps + infra + seeds
	@echo "✓ Setup listo. Ejecuta: make api-dev  y  make web-dev"

env: ## Crea .env desde .env.example si no existe
	@test -f .env || (cp .env.example .env && echo "✓ Creado .env")
	@test -f .env && echo "✓ .env OK"

volumes: ## Crea volúmenes Docker externos (solo la primera vez)
	@docker volume inspect ms-alertas_postgres_data >/dev/null 2>&1 || \
		(docker volume create ms-alertas_postgres_data && echo "✓ Volumen postgres creado")
	@docker volume inspect ms-alertas_n8n_data >/dev/null 2>&1 || \
		(docker volume create ms-alertas_n8n_data && echo "✓ Volumen n8n creado")
	@docker volume inspect ms-alertas_redis_data >/dev/null 2>&1 || \
		(docker volume create ms-alertas_redis_data && echo "✓ Volumen redis creado")
	@echo "✓ Volúmenes OK"

install: install-api install-web ## Instala dependencias de backend y frontend

install-api: ## pnpm install en ms-alertas
	cd $(API_DIR) && pnpm install

install-web: ## pnpm install en dashboard-web
	cd $(WEB_DIR) && pnpm install

# ── Infraestructura (Docker) ──────────────────────────────────────────────────

.PHONY: up down restart ps logs
up: env ## Levanta Postgres, Keycloak, Redis y n8n
	$(COMPOSE) up -d
	@echo "✓ Infra arriba"
	@echo "  Postgres  → localhost:$${DB_PORT:-5432}"
	@echo "  Keycloak  → http://localhost:$${KEYCLOAK_PORT:-8080}"
	@echo "  n8n       → http://localhost:$${N8N_PORT:-5678}"
	@echo "  Redis     → localhost:$${REDIS_PORT:-6379}"

down: ## Detiene y elimina contenedores (conserva volúmenes)
	$(COMPOSE) down

restart: ## Reinicia todos los servicios Docker
	$(COMPOSE) restart

restart-keycloak: ## Reinicia Keycloak (útil tras cambiar el realm)
	$(COMPOSE) restart keycloak

ps: ## Estado de los contenedores
	$(COMPOSE) ps

logs: ## Logs de todos los servicios (Ctrl+C para salir)
	$(COMPOSE) logs -f

logs-api-db: ## Logs solo de Postgres
	$(COMPOSE) logs -f db

logs-keycloak: ## Logs solo de Keycloak
	$(COMPOSE) logs -f keycloak

# ── Backend (ms-alertas / NestJS) ───────────────────────────────────────────

.PHONY: api-dev api-build api-start api-seed api-test api-lint
api-dev: ## Servidor de desarrollo NestJS (puerto 4001)
	cd $(API_DIR) && pnpm start:dev

api-build: ## Build de producción del API
	cd $(API_DIR) && pnpm build

api-start: api-build ## Arranca el API en modo producción
	cd $(API_DIR) && pnpm start:prod

api-seed: up ## Ejecuta seeds de catálogos en la BD
	cd $(API_DIR) && pnpm seed

api-test: ## Tests unitarios del API
	cd $(API_DIR) && pnpm test

api-lint: ## ESLint del API
	cd $(API_DIR) && pnpm lint

# ── Frontend (dashboard-web / Next.js) ────────────────────────────────────────

.PHONY: web-dev web-dev-turbo web-build web-start web-clean web-lint
web-dev: ## Servidor de desarrollo Next.js (puerto 3000, webpack)
	cd $(WEB_DIR) && pnpm dev

web-dev-turbo: ## Servidor de desarrollo Next.js con Turbopack
	cd $(WEB_DIR) && pnpm dev:turbo

web-build: ## Build de producción del dashboard
	cd $(WEB_DIR) && pnpm build

web-start: web-build ## Arranca el dashboard en modo producción
	cd $(WEB_DIR) && pnpm start

web-clean: ## Elimina caché .next del frontend
	cd $(WEB_DIR) && pnpm clean

web-lint: ## ESLint del dashboard
	cd $(WEB_DIR) && pnpm lint

# ── Desarrollo combinado ──────────────────────────────────────────────────────

.PHONY: dev seed build lint test
dev: up ## Levanta infra y muestra cómo arrancar API + frontend
	@echo ""
	@echo "  Infra lista. En terminales separadas:"
	@echo "    make api-dev"
	@echo "    make web-dev"
	@echo ""
	@echo "  URLs:"
	@echo "    Dashboard → http://localhost:3000"
	@echo "    API       → http://localhost:4001/api/v1"
	@echo "    Swagger   → http://localhost:4001/api/v1/docs"
	@echo "    Keycloak  → http://localhost:8080"
	@echo ""

seed: api-seed ## Alias de api-seed

build: api-build web-build ## Build de API y dashboard

lint: api-lint web-lint ## Lint de API y dashboard

test: api-test ## Ejecuta tests del API

# ── Limpieza ──────────────────────────────────────────────────────────────────

.PHONY: clean clean-volumes
clean: web-clean ## Limpia artefactos locales (.next)
	@echo "✓ Caché del frontend eliminada"

clean-volumes: down ## ⚠️  Elimina volúmenes Docker (BORRA DATOS de BD, n8n, Redis)
	@echo "⚠️  Eliminando volúmenes Docker..."
	-docker volume rm ms-alertas_postgres_data ms-alertas_n8n_data ms-alertas_redis_data 2>/dev/null
	@echo "✓ Volúmenes eliminados"
