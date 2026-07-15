# Dashboard Web

Frontend para la gestión de alertas: niveles de severidad, reglas, eventos, canales de notificación y panel operativo.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4 + [shadcn/ui](https://ui.shadcn.com)
- TanStack Query y TanStack Form
- Axios

## Requisitos

- Node.js 20+
- [pnpm](https://pnpm.io) 10+

## Configuración

1. Clona el repositorio:

```bash
git clone https://github.com/<tu-org>/web.git
cd web
```

2. Instala dependencias:

```bash
pnpm install
```

3. Copia las variables de entorno:

```bash
cp .env.example .env.local
```

4. Ajusta `NEXT_PUBLIC_API_URL` en `.env.local` según tu API.

## Scripts

| Comando       | Descripción              |
|---------------|--------------------------|
| `pnpm dev`    | Servidor de desarrollo   |
| `pnpm build`  | Build de producción      |
| `pnpm start`  | Servidor de producción   |
| `pnpm lint`   | ESLint                   |

La app queda disponible en [http://localhost:3000](http://localhost:3000).

## Estructura

```
src/
  app/              # Rutas y layouts (App Router)
  components/       # UI (shadcn) y layout de la app
  features/         # Módulos por dominio (ej. severity-levels)
  shared/           # Componentes y utilidades compartidas
  lib/              # HTTP client, utils
  navigation/       # Configuración del menú lateral
```

## Subir a GitHub

Si aún no tienes remoto configurado:

```bash
git remote add origin https://github.com/<tu-org>/web.git
git add .
git commit -m "chore: inicializar Dashboard Web"
git push -u origin main
```

Crea el repositorio vacío `web` en GitHub antes del primer push.