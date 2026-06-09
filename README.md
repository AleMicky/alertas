# Alertas

Sistema de gestión y notificación de alertas. Monorepo con API NestJS, dashboard Next.js e infraestructura Docker (PostgreSQL, Keycloak, Redis, n8n).

## Estructura

```
alertas/
├── ms-alertas/       # API NestJS (puerto 4001)
├── dashboard-web/    # Dashboard Next.js (puerto 3000)
├── keycloak/         # Realm de Keycloak (import automático)
├── docker-compose.yml
├── Makefile
└── .env.example
```

## Requisitos

- Node.js 20+
- pnpm
- Docker y Docker Compose

## Inicio rápido

```bash
# 1. Variables de entorno
cp .env.example .env

# 2. Volúmenes Docker (solo la primera vez)
make volumes

# 3. Setup completo: dependencias + infra + seeds
make setup

# 4. En terminales separadas
make api-dev    # http://localhost:4001/api/v1
make web-dev    # http://localhost:3000
```

## URLs de desarrollo

| Servicio   | URL |
|------------|-----|
| Dashboard  | http://localhost:3000 |
| API        | http://localhost:4001/api/v1 |
| Swagger    | http://localhost:4001/api/v1/docs |
| Keycloak   | http://localhost:8080 |
| n8n        | http://localhost:5678 |

## Credenciales de desarrollo (Keycloak)

Realm: `alertas`

| Usuario            | Contraseña    | Rol      |
|--------------------|---------------|----------|
| `admin.alertas`    | `Admin123*`   | admin    |
| `operador.alertas` | `Operador123*` | operador |

> Solo para desarrollo local. Cambiar en producción.

## Comandos útiles

```bash
make help           # Lista todos los comandos
make up / make down # Infra Docker
make seed           # Catálogos iniciales (severidad, canales)
make build          # Build API + dashboard
make lint           # ESLint en ambos proyectos
make test           # Tests del API
```

## Variables de entorno

Copiar `.env.example` a `.env` en la raíz. Es compartido por Docker Compose, `ms-alertas` y `dashboard-web`.

**No subir `.env` a Git** — contiene secretos locales.

## Flujo principal

1. Un sistema cliente envía un evento (`POST /api/v1/events`) con token `msa_...`
2. El API crea la alerta y encola notificaciones (BullMQ + Redis)
3. Un worker envía cada notificación al webhook n8n del canal configurado
4. El dashboard permite configurar sistemas, canales, severidades y monitorear eventos

## Subir a Git

```bash
git init
git add .
git status          # Verificar que .env y node_modules NO aparecen
git commit -m "Initial commit"
git remote add origin <url-del-repositorio>
git push -u origin main
```
