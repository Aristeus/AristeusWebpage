# Bitácora - Aristeus Webpage

### 2026-08-22 — auth: HU-001 Acceso y Registro a la Plataforma
- **Cambios**: páginas `/login` y `/register`, mock auth en `src/utils/auth.ts`, links condicionales en `Nav.astro`
- **Archivos**: `src/pages/login.astro`, `src/pages/register.astro`, `src/components/auth/LoginForm.tsx`, `src/components/auth/RegisterForm.tsx`, `src/utils/auth.ts`, `src/components/layout/Nav.astro`
- **Motivación**: HU-001 requiere acceso seguro con demo mock preparado para backend
- **Evitar**: mezclar lógica de auth con estilos de producto `gg-*`/`cv-*`

### 2026-08-22 — mapas: tarjeta de planificación de hato en MapDemoReact
- **Cambio**: agregada tarjeta `herdPlan` debajo del mapa con variables `herdId`, `originPasture`, `daysUntilMove`, `targetPasture`
- **Archivo**: `src/components/shared/MapDemoReact.tsx`, `src/components/shared/MapDemo.astro`
- **Motivación**: visualizar movimiento planificado del ganado por potreros
- **Evitar**: hardcodear coordenadas sin fallback

### 2026-08-22 — skills: crear skills de frontend y commits para Aristeus
- **Cambios**: creadas `ui-ux-mapas-aristeus.md` y `commit-aristeus.md` en `.kilo/agent/`
- **Archivos**: `.kilo/agent/ui-ux-mapas-aristeus.md`, `.kilo/agent/commit-aristeus.md`
- **Motivación**: estandarizar implementación UI/UX y commits estructurados
- **Evitar**: inventar colores o estilos fuera de variables CSS definidas
