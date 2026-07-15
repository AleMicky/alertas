.DEFAULT_GOAL := help

ROOT_DIR   := $(CURDIR)
API_DIR    := apps/api
WEB_DIR    := apps/web
COMPOSE      := docker compose
COMPOSE_PROD := $(COMPOSE) -f docker-compose.yml -f docker-compose.prod.yml

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

.PHONY: setup env install install-api install-web
setup: env install up seed ## Setup completo: .env + deps + infra + seeds
	@echo "✓ Setup listo. Ejecuta: make api-dev  y  make web-dev"

env: ## Crea .env desde .env.example si no existe
	@test -f .env || (cp .env.example .env && echo "✓ Creado .env")
	@test -f .env && echo "✓ .env OK"

install: install-api install-web ## Instala dependencias de backend y frontend

install-api: ## pnpm install en apps/api
	cd $(API_DIR) && pnpm install

install-web: ## pnpm install en apps/web
	cd $(WEB_DIR) && pnpm install

# ── Infraestructura (Docker) ──────────────────────────────────────────────────

.PHONY: up down restart ps logs
up: env ## Levanta Postgres y Redis
	$(COMPOSE) up -d
	@echo "✓ Infra arriba"
	@echo "  Postgres  → localhost:$${DB_PORT:-5432}"
	@echo "  Redis     → localhost:$${REDIS_PORT:-6379}"

down: ## Detiene y elimina contenedores (conserva volúmenes)
	$(COMPOSE) down

restart: ## Reinicia todos los servicios Docker
	$(COMPOSE) restart

ps: ## Estado de los contenedores
	$(COMPOSE) ps

logs: ## Logs de todos los servicios (Ctrl+C para salir)
	$(COMPOSE) logs -f

logs-api-db: ## Logs solo de Postgres
	$(COMPOSE) logs -f db

# ── Producción (Docker) ───────────────────────────────────────────────────────

.PHONY: prod-build prod-up prod-down prod-restart prod-ps prod-logs prod-seed
prod-build: env ## Construye imágenes Docker de API y dashboard
	$(COMPOSE_PROD) build

prod-up: env ## Levanta stack completo en modo producción
	$(COMPOSE_PROD) up -d --build
	@echo "✓ Stack de producción arriba"
	@echo "  Dashboard → http://localhost:$${WEB_PORT:-3000}"
	@echo "  API       → http://localhost:$${PORT:-4001}/$${API_PREFIX:-api/v1}"
	@echo "  Swagger   → http://localhost:$${PORT:-4001}/$${API_PREFIX:-api/v1}/docs"
	@echo ""
	@echo "  Primera vez: make prod-seed"

prod-down: ## Detiene el stack de producción
	$(COMPOSE_PROD) down

prod-restart: ## Reinicia el stack de producción
	$(COMPOSE_PROD) restart

prod-ps: ## Estado de contenedores (modo producción)
	$(COMPOSE_PROD) ps

prod-logs: ## Logs del stack de producción (Ctrl+C para salir)
	$(COMPOSE_PROD) logs -f

prod-seed: ## Ejecuta seeds contra la BD expuesta por Docker
	cd $(API_DIR) && pnpm seed

# ── Backend (apps/api / NestJS) ───────────────────────────────────────────────

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

# ── Frontend (apps/web / Next.js) ─────────────────────────────────────────────

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
	@echo ""

seed: api-seed ## Alias de api-seed

build: api-build web-build ## Build de API y dashboard

lint: api-lint web-lint ## Lint de API y dashboard

test: api-test ## Ejecuta tests del API

# ── Limpieza ──────────────────────────────────────────────────────────────────

.PHONY: clean clean-volumes
clean: web-clean ## Limpia artefactos locales (.next)
	@echo "✓ Caché del frontend eliminada"

clean-volumes: ## ⚠️  Elimina volúmenes Docker (BORRA DATOS de BD y Redis)
	@echo "⚠️  Eliminando volúmenes Docker..."
	$(COMPOSE) down -v
	@echo "✓ Volúmenes eliminados"
