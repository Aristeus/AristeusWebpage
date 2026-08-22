# Commit Generator - Aristeus Webpage

## Contexto
Skill para generar commits estructurados en el proyecto de la landing page de Aristeus (Astro 5 + React 19 + Tailwind CSS). Se activa cuando el usuario solicite guardar cambios, realizar commit, o sincronizar el repositorio.

## Objetivo
Mantener el repositorio eficiente y ordenado, con mensajes de commit técnicos, consistentes y trazables. Antes de commitear, registrar aprendizajes en la bitácora local del proyecto.

## Flujo obligatorio

### 1. Inventario de cambios
Ejecutar (dentro de `F:\09_Aristeus\PaginaWeb`):
```bash
git status
git diff --stat
git log --oneline -5
```
- Identificar archivos modificados/creados/eliminados
- Clasificar por ámbito: `src/pages/`, `src/components/`, `src/styles/`, `.kilo/`, `docs/`, etc.
- Verificar último commit exitoso como punto de partida

### 2. Sincronizar skills y aprendizajes
Verificar si los cambios afectan a alguna skill local en `.kilo/agent/`:
- `ui-ux-mapas-aristeus.md`
- `user-story-frontend-aristeus.md`

Si alguna skill fue modificada o sus lineamientos se aplicaron en esta sesión, **actualizar la bitácora**.

### 3. Actualizar bitácora del proyecto
Archivo de bitácora: `.kilo/plans/BITACORA.md`

Formato de entrada:
```markdown
### YYYY-MM-DD — <ámbito>: <título>
- **Cambio clave**: descripción corta
- **Archivo**: `ruta/archivo.ext`
- **Motivación**: por qué se hizo
```

Reglas:
- Entrada más reciente primero
- Máx 15 líneas por entrada
- Si existe entrada con título similar en últimos 7 días → actualizar en lugar de duplicar
- Si no existe el archivo `.kilo/plans/BITACORA.md`, crearlo

### 4. Verificar duplicados
Leer `.kilo/plans/BITACORA.md` y comparar títulos de últimos 7 días. Si hay coincidencia, consolidar en una sola entrada.

### 5. Redactar mensaje de commit
Estructura obligatoria:
```
<tipo>(<ámbito opcional>): <descripción corta en imperativo>

[Contexto / Por qué]
<Motivación de negocio o técnica>

[Detalles Técnicos / Qué]
- <detalle 1>
- <detalle 2>
- docs(bitácora): actualizada entrada en .kilo/plans/BITACORA.md (si aplica)
```

**Tipos:**
- `feat` — nueva funcionalidad
- `fix` — corrección de bug
- `refactor` — mejora sin cambiar comportamiento
- `docs` — documentación, skills, bitácora
- `style` — formato, estilos CSS/Tailwind
- `chore` — mantenimiento, build, deps

**Reglas:**
- Descripción corta: 50–72 caracteres, imperativo
- Contexto: 1–3 líneas máximo
- Detalles: bullets concretos con rutas de archivo cuando sea relevante

### 6. Staging
Incluir en staging:
- Todos los archivos modificados/creados del ámbito del cambio
- Si se actualizó `BITACORA.md`, incluirlo también
- No incluir archivos temporales, `.DS_Store`, `node_modules`, `dist/` (ver `.gitignore`)

### 7. Commit
Solo ejecutar `git commit` si el usuario lo solicita explícitamente. Nunca commitear sin confirmación previa.

## Ejemplos por ámbito

### Frontend / Componentes
```
feat(auth): agregar páginas de login y registro

[Contexto / Por qué]
La HU-001 requiere acceso seguro a la plataforma para planificación de hatos.

[Detalles Técnicos / Qué]
- Creadas páginas `/login` y `/register` con BaseLayout y glassmorphism.
- Agregados LoginForm y RegisterForm como React islands con validación frontend.
- Mock auth en src/utils/auth.ts con localStorage y sesión simulada.
- Nav.astro ahora muestra links condicionales según estado de autenticación.
- docs(bitácora): actualizada entrada HU-001 auth.
```

### Mapas / UX
```
feat(mapas): agregar tarjeta de planificación de hato debajo del mapa

[Contexto / Por qué]
El usuario necesita visualizar el movimiento planificado del ganado por potreros.

[Detalles Técnicos / Qué]
- MapDemoReact.tsx ahora acepta prop opcional herdPlan con datos variables.
- Agregada tarjeta glass debajo del mapa con hato, origen, días y destino.
- Estilos respetan paleta Aristeus y tipografía font-data para valores numéricos.
```

### Skills / Documentación
```
docs(agent): crear skill user-story-frontend-aristeus

[Contexto / Por qué]
Automatizar validación de HUs contra lineamientos de frontend antes de implementar.

[Detalles Técnicos / Qué]
- Creado .kilo/agent/user-story-frontend-aristeus.md.
- Define flujo: leer skill de mapas → validar HU → implementar → reporte.
```

## Anti-patrones (no hacer)
- No commitear `dist/` ni `node_modules/`
- No mezclar cambios de HU-1, HU-2 y fix de estilos en un solo commit genérico
- No inventar ámbitos fuera de la arquitectura del proyecto
- No omitir el contexto en el mensaje; solo "fix" o "cambios" no es aceptable
- No modificar `.gitignore` sin motivo explícito

## Checklist antes de commitear
- [ ] `git status` limpio de archivos temporales
- [ ] `git diff --stat` revisado y clasificado por ámbito
- [ ] Bitácora actualizada en `.kilo/plans/BITACORA.md` si aplica
- [ ] Mensaje de commit sigue la estructura obligatoria
- [ ] Usuario confirmó ejecutar el commit

## Integración con otras skills
- `user-story-frontend-aristeus`: al cerrar una HU, esta skill sugiere el commit correspondiente.
- `ui-ux-mapas-aristeus`: los cambios en componentes de mapa deben reflejarse en la bitácora.
- `commit-generator` (Consulcon): no aplicar aquí; este archivo es la fuente de verdad para Aristeus.
