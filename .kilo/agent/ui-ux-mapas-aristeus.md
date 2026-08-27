# UI/UX - Mapas Interactivos Aristeus

## Contexto
Skill para implementar interfaces de mapa interactivas en la landing de Aristeus, enfocada en la sección **"Visualiza tu campo"** y apps satellite/ganadería que usen visualización geoespacial.

## Stack obligatorio
- Astro 5 + React 19 (island architecture)
- React-Leaflet 5 + Leaflet 1.9
- Tailwind CSS 3.4 + variables CSS custom en `global.css`
- TypeScript estricto en componentes `.tsx`

## Sección objetivo
`src/components/shared/MapDemo.astro` → texto: **"Visualiza tu campo como nunca antes"**
Componente React: `src/components/shared/MapDemoReact.tsx`

## Objetivos UI/UX
1. **Confiabilidad rural**: el usuario debe entender el estado del campo en <3 segundos
2. **Capas claras**: satelital, biomasa, plan de pastoreo sin saturar
3. **Feedback inmediato**: click en potrero → panel lateral con datos actualizados
4. **Mobile-first**: controles táctiles grandes, panel lateral apilado debajo del mapa en `<1024px`

## Patrones de diseño existentes (OBLIGATORIO mantener)
- **Glassmorphism**: clase `.glass` en `global.css` para panels y controles
- **Paleta restringida**:
  - `--aristeus-navy: #0B2341`
  - `--aristeus-green: #6BA539`
  - `--aristeus-secondary: #355E3B`
  - `--technical-graphite: #2B2F36`
  - `--mineral-white: #F5F7F4`
  - `--mist-gray: #D8DEE3`
- **Tipografía**:
  - `font-heading` → Space Grotesk (títulos)
  - `font-body` → IBM Plex Sans (cuerpo)
  - `font-data` → JetBrains Mono (números, datos)
- **Layout**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Animaciones**: usar `ScrollReveal.astro` para entrada de sección

## Estructura de componente React de mapa
```tsx
export default function MapDemoReact() {
  const [layer, setLayer] = useState('dark');
  const [selectedPasture, setSelectedPasture] = useState<PastureProps>(...);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);
  
  if (!mounted) return <Skeleton />; // evitar hidratación
}
```

## Capas de mapa permitidas
| ID | Tile URL | Uso |
|---|---|---|
| `dark` | CARTO dark_all | Vista base nocturna |
| `satellite` | ESRI World Imagery | Vista satelital real |
| `biomass` | Capa de círculos superpuestos | Mapa de calor biomasa |
| `plan` | Polígonos GeoJSON | Plan de pastoreo |

## Estructura de datos GeoJSON (mock)
```ts
interface PastureProps {
  name: string;
  status: 'available' | 'resting' | 'depleted';
  biomass: number; // kg MS/ha
  size: number; // hectáreas
}
```
- Coordenadas: centro en `[-17.42, -63.28]` (Santa Cruz, Bolivia)
- Zoom inicial: `14`
- Polígonos irregulares tipo potrero real (no rectángulos perfectos)

## Panel lateral de datos (derecha en desktop, abajo en mobile)
```astro
<div class="lg:col-span-1 glass rounded-2xl p-6">
  <h3 class="font-heading font-semibold text-text-primary mb-4">Datos del potrero</h3>
  <!-- Bloques: nombre, biomasa, estado, recomendación -->
</div>
```

## Accesibilidad mapa
- `aria-label` en botones de capa
- Contraste mínimo 4.5:1 en texto sobre glass
- Focus visible en controles (Tailwind `focus:ring-2`)
- Texto alternativo en imágenes estáticas del mapa

## Responsive breakpoints
- `md: 768px` → controles en fila
- `lg: 1024px` → panel lateral a la derecha del mapa
- Móvil: panel debajo del mapa, controles apilados

## Anti-patrones prohibidos
- No hardcodear URLs de tiles sin fallback
- No usar `alert()` ni modals nativos para selección
- No romper el glassmorphism con fondos opacos sólidos
- No mezclar clases de color producto (gg-*, cv-*) fuera de su sección

## Checklist antes de merge
- [ ] Build pasa: `npm run build`
- [ ] Preview funcional: `npm run preview`
- [ ] Mapa carga en mobile sin scroll horizontal
- [ ] Click en potrero actualiza panel sin parpadear
- [ ] Cambio de capa no rompe GeoJSON
- [ ] Tipografía `font-data` en números de biomasa
- [ ] Colores usan variables CSS, no hex directos (excepto BRAND_COLORS en TS)

## Extensiones futuras
- Cargar polígonos reales desde API backend
- Filtros por fecha de dron
- Modo comparación lado a lado (antes/después)
- Exportar reporte PDF del potrero