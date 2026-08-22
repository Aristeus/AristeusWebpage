# User Story Frontend - Aristeus

## Contexto
Esta skill se activa cuando el usuario presente una historia de usuario (HU) para la landing de Aristeus. Debes validarla contra la skill de frontend/mapas y luego implementarla.

## Trigger
El usuario escribe una historia de usuario con formato similar a:
```markdown
# HU-XXX: [Título]
## Descripción
## Funciones
## Objetivos
## Criterios de aceptación
```

## Flujo obligatorio

### 1. Leer skill de frontend primero
Antes de proponer cualquier cambio, lee obligatoriamente:
- `.kilo/agent/ui-ux-mapas-aristeus.md`

Extrae de ahí:
- Paleta restringida (no inventar colores)
- Tipografía (`font-heading`, `font-body`, `font-data`)
- Glassmorphism (`.glass`)
- Breakpoints responsive (`md:`, `lg:`)
- Arquitectura Astro (islands, `client:only="react"`)
- Anti-patrones prohibidos

### 2. Validar la HU contra la skill de frontend
Para cada requisito/función de la HU, verifica:

| Criterio | Regla |
|---|---|
| Colores | Solo variables CSS definidas en `global.css` |
| Tipografía | `font-heading` para títulos, `font-body` para cuerpo, `font-data` para números |
| Layout | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` |
| Componentes interactivos | Van en `.tsx` con `client:only="react"` |
| Componentes estáticos | Van en `.astro` |
| Responsive | Mobile-first, sin scroll horizontal |
| Accesibilidad | `aria-label`, contraste 4.5:1, focus visible |
| i18n | Si aplica, usar `src/data/es.json` y `src/data/en.json` |

### 3. Reporte de validación
Antes de implementar, mostrá:

**✅ Objetivos que se cumplen contra la skill:**
- Lista de requisitos alineados con el estilo existente

**❌ Fallos/desviaciones detectadas:**
- Requisitos que contradicen la skill (ej: color no permitido, tipografía incorrecta)
- Sugerencias de corrección

**⚠️ Riesgos:**
- Dependencias externas (API, datos reales)
- Breaking changes en componentes existentes

### 4. Implementación
Una vez validada, implementá:

1. **Estructura de archivos:**
   - Componentes nuevos en `src/components/[categoría]/`
   - Páginas nuevas en `src/pages/`
   - Datos mock en el mismo archivo o `src/data/`

2. **Código:**
   - TypeScript estricto en `.tsx`
   - Props tipadas con interfaces
   - Sin `alert()` ni modals nativos
   - Sin hardcodear URLs de assets sin fallback

3. **Integración:**
   - Importar en página correspondiente
   - Mantener `BaseLayout` como layout base
   - Usar `ScrollReveal` para animaciones de entrada

### 5. Reporte final
Después de implementar, mostrá:

**Objetivos cumplidos:**
- [ ] Requisito 1
- [ ] Requisito 2
...

**Fallos/limitaciones:**
- Lo que no se pudo implementar y por qué
- Placeholders o datos mock que requieren backend

**Archivos modificados/creados:**
- Lista de archivos con rutas relativas

## Formato de salida esperado

```markdown
## Validación contra skill de frontend
### ✅ Cumplidos
- ...

### ❌ Desviaciones
- ...

### ⚠️ Riesgos
- ...

## Implementación
### Archivos
- ...

### Código
(bloques de código)

## Reporte final
### Objetivos cumplidos
- ...

### Fallos
- ...

### Archivos modificados
- ...
```

## Anti-patrones (no hacer)
- No implementar sin antes mostrar la validación
- No inventar estilos fuera de la paleta Aristeus
- No mezclar clases de producto (`gg-*`, `cv-*`) fuera de su sección
- No modificar `dist/` manualmente
- No usar `any` en TypeScript
- No crear componentes sin tipo ni interfaz

## Ejecución
Cuando recibas una HU:
1. Leé `.kilo/agent/ui-ux-mapas-aristeus.md`
2. Validá cada requisito
3. Mostrá reporte de validación
4. Implementá
5. Mostrá reporte final con build incluido
