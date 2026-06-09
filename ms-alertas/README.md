# MS Alert

Microservicio **NestJS** para gestión de **eventos**, **alertas**, **reglas**, **severidades**, **canales de notificación**, **sistemas cliente** y **tokens**, con integración a **PostgreSQL** y **n8n**.

## Requisitos

- Node.js 20+
- [pnpm](https://pnpm.io/)
- Docker (opcional, para base de datos y n8n)

## Configuración

1. Clona el repositorio e instala dependencias:

```bash
pnpm install
```

2. Copia las variables de entorno y ajústalas:

```bash
cp .env.example .env
```

3. Levanta PostgreSQL y n8n (opcional):

```bash
docker compose up -d
```

4. Ejecuta las semillas de catálogos:

```bash
pnpm run seed
```

5. Inicia en modo desarrollo:

```bash
pnpm run start:dev
```

La API queda en `http://localhost:4001/api/v1` (según tu `.env`).  
Documentación Swagger: `http://localhost:4001/api/v1/docs`

## Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm run start:dev` | Servidor con recarga en caliente |
| `pnpm run build` | Compila a `dist/` |
| `pnpm run start:prod` | Ejecuta build de producción |
| `pnpm run seed` | Carga datos iniciales (severidades, canales, etc.) |
| `pnpm run lint` | ESLint |
| `pnpm run test` | Tests unitarios |

## Estructura

```
src/
├── app/              # Servicios de aplicación
├── domain/           # Entidades y contratos de repositorio
├── infrastructure/   # TypeORM, mappers, repositorios
├── presentation/     # Controladores, DTOs, schemas Swagger
└── config/           # Base de datos, Swagger, seeds
```

## Documentación adicional

Informes técnicos en la carpeta [`docs/`](./docs/).

## Subir a GitHub

```bash
# En la raíz del proyecto (recomendado: carpeta renombrada a ms-alert)
git add .
git commit -m "Initial commit: microservicio MS Alert"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/ms-alert.git
git push -u origin main
```

Crea antes el repositorio vacío en GitHub con el nombre **ms-alert** (sin README si ya tienes uno local).

## Licencia

UNLICENSED — uso privado del proyecto.
