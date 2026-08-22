# Plan: Agent Skill User Story → Frontend Aristeus

## Objetivo
Crear una agent skill en `.kilo/agent/` que permita escribir historias de usuario (HU) para la página web de Aristeus, las valide automáticamente contra la skill de frontend existente (`ui-ux-mapas-aristeus.md`) y luego las implemente.

## Alcance
- Solo frontend: Astro 5 + React 19 + Tailwind CSS + componentes existentes
- Skill nueva consume/lee la skill existente de mapas y estilos
- Salida: implementación lista + reporte de objetivos cumplidos vs fallidos

## Archivos a crear/modificar
1. `.kilo/agent/user-story-frontend-aristeus.md` — skill nueva
2. Sin cambios en código fuente todavía; la skill es solo markdown con instrucciones para Kilo

## Contenido de la skill nueva

### Prompt automático por contexto
Cuando el usuario escriba una historia de usuario con:
- Título/nombre
- Descripción/objetivo
- Funciones/requisitos
- Criterios de aceptación

Kilo hará:

1. **Contraste obligatorio contra `ui-ux-mapas-aristeus.md`**
   - ¿Usa glassmorphism (`.glass`)?
   - ¿Respeta paleta restringida (variables CSS, no hex inventados)?
   - ¿Usa tipografía correcta (`font-heading`, `font-body`, `font-data`)?
   - ¿Mantiene responsive breakpoints (`md:`, `lg:`)?
   - ¿No rompe arquitectura Astro (island architecture, `client:only="react"`)?
   - ¿Maneja i18n si la sección lo requiere?

2. **Propuesta de implementación**
   - Archivos a crear/modificar (ej: `src/components/products/NuevoComponente.astro`)
   - Estructura de datos mock si corresponde
   - Props/interfaces TypeScript necesarias
   - Integración con componentes existentes (`BaseLayout`, `MapDemoReact`, etc.)

3. **Reporte final**
   - Objetivos cumplidos (checklist de la HU)
   - Fallos/desviaciones detectados respecto a la skill de frontend
   - Riesgos o dependencias pendientes (ej: datos reales desde backend)

### Formato de entrada esperado (HU)
```markdown
# HU-XXX: [Título]
## Descripción
## Funciones
## Objetivos
## Criterios de aceptación
```

### Restricciones de implementación
- No inventar colores fuera de variables CSS
- No modificar `dist/` manualmente
- No usar `alert()` ni modals nativos
- Mantener tipografía de marca
- Respetar arquitectura Astro: componentes `.astro` estáticos, lógica interactiva en `.tsx` con islands
- Todos los textos nuevos deben considerar i18n si aplica

### Checklist de validación automática
- [ ] Glassmorphism preservado en panels/controles
- [ ] Paleta Aristeus respetada (navy/green/secondary/graphite/white/gray)
- [ ] Tipografía correcta por tipo de contenido
- [ ] Responsive sin scroll horizontal
- [ ] TypeScript estricto en `.tsx`
- [ ] No hay assets rotos ni URLs hardcodeadas sin fallback
- [ ] Build pasa: `npm run build`

## HU-1: Acceso y Registro a la Plataforma (ejemplo de ejecución)

### Validación contra skill de frontend
- **Rutas separadas** `/login` y `/register` → compatibles con Astro
- **Formularios nombre, correo, contraseña** → compatibles con estilos existentes
- **Demo mock localStorage** → no rompe arquitectura, sin backend
- **Links en Nav** → componente existente, se puede modificar
- **Validación frontend** → se puede implementar en React island con estado local

**Desviaciones**: ninguna bloqueante. El "panel principal" se resolverá con redirect simulado a `/` con query param `?redirect=demo`.

### Archivos a crear/modificar para HU-1
1. `src/pages/login.astro` — página login con layout BaseLayout
2. `src/pages/register.astro` — página registro con layout BaseLayout
3. `src/components/auth/LoginForm.tsx` — componente React island con validación frontend
4. `src/components/auth/RegisterForm.tsx` — componente React island con validación frontend
5. `src/utils/auth.ts` — utilidades mock localStorage para simular backend
6. Modificar `src/components/layout/Nav.astro` — links condicionales auth/no-auth

### Estructura de datos mock
```ts
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}
```

### Flujo de implementación HU-1
1. Crear `auth.ts` con funciones mock: `register()`, `login()`, `logout()`, `isAuthenticated()`, `getCurrentUser()`
2. Crear `LoginForm.tsx`:
   - Estado: email, password, error
   - Validación: email regex, password mínima 6 chars
   - On submit: llamar `auth.login()`, en éxito redirect a `/` con `?dashboard=1`
   - Estilos: glassmorphism, paleta Aristeus, tipografía correcta
3. Crear `RegisterForm.tsx`:
   - Estado: name, email, password, confirmPassword, error
   - Validación: campos obligatorios, passwords coinciden, email válido
   - On submit: llamar `auth.register()`, en éxito redirect a `/login?registered=1`
   - Estilos: mismos lineamientos
4. Crear `login.astro` y `register.astro`:
   - Importar BaseLayout
   - Importar formulario correspondiente con `client:only="react"`
   - Títulos y textos según HU
5. Modificar `Nav.astro`:
   - Si `auth.isAuthenticated()`: mostrar "Mi panel" + "Cerrar sesión"
   - Si no: mostrar "Iniciar sesión" y "Registrarse"
   - Al hacer clic en logout: `auth.logout()` y redirect a `/`

### Validación final HU-1
- Build pasa: `npm run build`
- Preview funcional: `npm run preview`
- Login fallido muestra error en español
- Registro guarda en localStorage
- Nav actualiza según estado auth
- Responsive sin scroll horizontal
- Tipografía y colores respetan skill

## Validación
1. Crear el archivo `.kilo/agent/user-story-frontend-aristeus.md`
2. Escribir una HU de prueba en el chat
3. Verificar que Kilo:
   - Menciona explícitamente la skill de mapas/frontend
   - Lista objetivos cumplidos y fallidos
   - No inventa estilos fuera de la paleta
   - Genera código compatible con el proyecto

## Riesgos
- Si la skill nueva es muy genérica, Kilo podría olvidar contrastar contra la skill de mapas. Mitigación: prompt explícito de "leer `ui-ux-mapas-aristeus.md` primero".
- Si la HU es muy amplia, Kilo podría generar demasiados archivos. Mitigación: limitar a componentes nuevos o modificaciones puntuales.

