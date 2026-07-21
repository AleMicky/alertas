.DEFAULT_GOAL := help

ROOT_DIR   := $(CURDIR)
API_DIR    := apps/api
WEB_DIR    := apps/web
COMPOSE         := docker compose
COMPOSE_PROD    := $(COMPOSE) -f docker-compose.yml -f docker-compose.prod.yml
COMPOSE_VPS     := $(COMPOSE) --env-file .env.vps -f docker-compose.vps.yml
COMPOSE_PRUEBAS := $(COMPOSE) --env-file .env.pruebas -f docker-compose.pruebas.yml

# ── Ayuda ──────────────────────────────────────────────────────────────────────

.PHONY: help
help: ## Muestra esta ayuda
	@echo ""
	@echo "  ms-notificaciones — comandos disponibles"
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
up: env ## Levanta Postgres, Redis y Keycloak
	$(COMPOSE) --profile keycloak up -d
	@echo "✓ Infra arriba"
	@echo "  Postgres  → localhost:$${DB_PORT:-5432}"
	@echo "  Redis     → localhost:$${REDIS_PORT:-6379}"
	@echo "  Keycloak  → http://localhost:$${KEYCLOAK_PORT:-8080} (admin/admin)"
	@echo "  Realm     → alertas  |  Issuer → http://localhost:$${KEYCLOAK_PORT:-8080}/realms/alertas"

down: ## Detiene y elimina contenedores (conserva volúmenes)
	$(COMPOSE) --profile keycloak down

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

# ── VPS (API + web; Postgres/Redis externos) ─────────────────────────────────

.PHONY: vps-env vps-build vps-up vps-down vps-restart vps-ps vps-logs vps-seed
vps-env: ## Crea .env.vps desde .env.vps.example si no existe
	@test -f .env.vps || (cp .env.vps.example .env.vps && echo "✓ Creado .env.vps — edita secretos y URLs")
	@test -f .env.vps && echo "✓ .env.vps OK"

vps-build: vps-env ## Construye imágenes para el VPS
	$(COMPOSE_VPS) build

vps-up: vps-env ## Levanta API + dashboard en el VPS (infra externa)
	@docker network inspect $$(grep -E '^DOCKER_NETWORK=' .env.vps 2>/dev/null | cut -d= -f2 || echo infraestructura) >/dev/null 2>&1 \
		|| docker network create $$(grep -E '^DOCKER_NETWORK=' .env.vps 2>/dev/null | cut -d= -f2 || echo infraestructura)
	$(COMPOSE_VPS) up -d --build
	@echo "✓ Stack VPS arriba"
	@echo "  Dashboard → $$(grep -E '^ALLOWED_ORIGINS=' .env.vps | cut -d= -f2 | cut -d, -f1)"
	@echo "  API       → $$(grep -E '^NEXT_PUBLIC_API_URL=' .env.vps | cut -d= -f2)"
	@echo ""
	@echo "  Primera vez: make vps-seed"

vps-down: ## Detiene API y dashboard del VPS
	$(COMPOSE_VPS) down

vps-restart: ## Reinicia API y dashboard del VPS
	$(COMPOSE_VPS) restart

vps-ps: ## Estado de contenedores VPS
	$(COMPOSE_VPS) ps

vps-logs: ## Logs del stack VPS (Ctrl+C para salir)
	$(COMPOSE_VPS) logs -f

vps-seed: vps-env ## Seeds contra la BD del VPS (usa DB_* de .env.vps)
	@set -a && . ./.env.vps && set +a && cd $(API_DIR) && pnpm seed

# ── Servidor de pruebas (API + web; infra externa) ───────────────────────────

.PHONY: pruebas-env pruebas-build pruebas-up pruebas-down pruebas-restart pruebas-ps pruebas-logs pruebas-seed
pruebas-env: ## Crea .env.pruebas desde .env.pruebas.example si no existe
	@test -f .env.pruebas || (cp .env.pruebas.example .env.pruebas && echo "✓ Creado .env.pruebas — edita secretos y URLs")
	@test -f .env.pruebas && echo "✓ .env.pruebas OK"

pruebas-build: pruebas-env ## Construye imágenes para el servidor de pruebas
	$(COMPOSE_PRUEBAS) build

pruebas-up: pruebas-env ## Levanta API + dashboard en pruebas (Postgres/Redis/Keycloak externos)
	@docker network inspect $$(grep -E '^DOCKER_NETWORK=' .env.pruebas 2>/dev/null | cut -d= -f2 || echo infraestructura) >/dev/null 2>&1 \
		|| (echo "✗ Red Docker 'infraestructura' no existe en este host" && exit 1)
	$(COMPOSE_PRUEBAS) up -d --build
	@echo "✓ Stack de pruebas arriba"
	@echo "  Dashboard → http://172.31.32.208:$${WEB_PORT:-7000}"
	@echo "  API       → $$(grep -E '^NEXT_PUBLIC_API_URL=' .env.pruebas | cut -d= -f2)"
	@echo ""
	@echo "  Primera vez: make pruebas-seed"

pruebas-down: ## Detiene API y dashboard de pruebas
	$(COMPOSE_PRUEBAS) down

pruebas-restart: ## Reinicia API y dashboard de pruebas
	$(COMPOSE_PRUEBAS) restart

pruebas-ps: ## Estado de contenedores de pruebas
	$(COMPOSE_PRUEBAS) ps

pruebas-logs: ## Logs del stack de pruebas (Ctrl+C para salir)
	$(COMPOSE_PRUEBAS) logs -f

pruebas-seed: pruebas-env ## Seeds contra la BD de pruebas (usa DB_* de .env.pruebas)
	@set -a && . ./.env.pruebas && set +a && cd $(API_DIR) && pnpm seed

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
