# Guía de estilos shadcn/ui — Complejo Educacional Valle del Itata
Versión: 1.0 (institucional)  
Base: **shadcn/ui + Tailwind CSS + Radix UI**  
Enfoque: **colegio / institución** (sobrio, claro, accesible, confiable)

---

## 0) Identidad visual (extraída del logo)
A partir del archivo del logo, los colores dominantes son:

- **Azul Institucional (Valle Blue)**: `#2C4C9A` (RGB 44, 76, 154)
- **Blanco**: `#FFFFFF`

> Nota: el logo parece ser principalmente un solo azul + blanco. Para UI necesitamos una **escala** (tintas/sombras) y neutrales; abajo se propone una derivación consistente.

### 0.1 Escala derivada del Azul Institucional (recomendada para UI)
(Generada como mezclas controladas con blanco/negro; mantiene el carácter del logo)

- **Primary 900** `#1D3164`
- **Primary 800** `#213974`
- **Primary 700** `#254183`
- **Primary 600** `#2A4892`
- **Primary 500** `#2C4C9A`  ← (el del logo)
- **Primary 400** `#5670AE`
- **Primary 300** `#768BBD`
- **Primary 200** `#A0AED2`
- **Primary 100** `#CAD2E6`
- **Primary 50**  `#E6EAF3`

**Regla institucional:** el azul del logo se usa para **acciones primarias, énfasis institucional y navegación**, no para “decorar” todos los módulos.

---

## 1) Principios de diseño (institucional)
1. **Claridad sobre estética**: lo primero es comprender.
2. **Consistencia**: mismo patrón → mismo comportamiento.
3. **Accesibilidad por defecto**: foco visible, contraste, teclado.
4. **Sobriedad**: color y animación con moderación.
5. **Confianza**: microcopy formal, feedback claro y oportuno.

---

## 2) Sistema de color (tokens shadcn)
shadcn/ui funciona mejor cuando el color se controla por **tokens semánticos** (CSS variables):
- `primary / primary-foreground`
- `secondary / secondary-foreground`
- `muted / muted-foreground`
- `accent / accent-foreground`
- `destructive / destructive-foreground`
- `background / foreground`
- `card / card-foreground`
- `border / input / ring`

### 2.1 Neutros institucionales (recomendados)
Para textos, fondos, bordes y tablas (estilo “administrativo”, legible):
- **Ink (texto principal):** `#0F172A`
- **Border/Input:** `#E2E8F0`
- **Muted bg:** `#F1F5F9`
- **Muted fg:** `#64748B`

---

## 3) Tema oficial (Light / Dark) listo para `globals.css`
Abajo va una propuesta completa (OKLCH) pensada para shadcn moderno.  
Si tu proyecto usa HSL en vez de OKLCH, te dejo un apéndice al final.

> Decisiones clave:
> - En **modo claro**, `primary` = azul del logo (`#2C4C9A`).
> - En **modo oscuro**, `primary` sube a `#5670AE` para destacar sobre fondo oscuro manteniendo el “ADN” del azul.

```css
:root {
  /* Tip: comentarios con HEX para que el equipo los reconozca rápido */

  /* Superficies */
  --background: oklch(1 0 0);                 /* #FFFFFF */
  --foreground: oklch(0.208 0.040 265.8);     /* #0F172A */

  --card: oklch(1 0 0);                       /* #FFFFFF */
  --card-foreground: oklch(0.208 0.040 265.8);/* #0F172A */

  --popover: oklch(1 0 0);                    /* #FFFFFF */
  --popover-foreground: oklch(0.208 0.040 265.8);

  /* Institucional */
  --primary: oklch(0.437 0.133 264.7);        /* #2C4C9A */
  --primary-foreground: oklch(1 0 0);         /* #FFFFFF */

  /* Secundarios (neutros sobrios) */
  --secondary: oklch(0.968 0.007 247.9);      /* #F1F5F9 */
  --secondary-foreground: oklch(0.278 0.030 256.8); /* #1F2937 */

  --muted: oklch(0.984 0.003 247.9);          /* #F8FAFC */
  --muted-foreground: oklch(0.554 0.041 257.4);/* #64748B */

  /* Acento (highlight suave institucional) */
  --accent: oklch(0.937 0.013 266.7);         /* #E6EAF3 */
  --accent-foreground: oklch(0.278 0.030 256.8); /* #1F2937 */

  /* Peligro */
  --destructive: oklch(0.505 0.190 27.0);     /* aprox rojo institucional UI */
  --destructive-foreground: oklch(1 0 0);

  /* Bordes y foco */
  --border: oklch(0.929 0.013 255.5);         /* #E2E8F0 */
  --input: oklch(0.929 0.013 255.5);          /* #E2E8F0 */
  --ring: oklch(0.640 0.079 266.6);           /* #768BBD */

  /* Radio institucional */
  --radius: 0.75rem;

  /* (Opcional) Estados semánticos extra */
  --success: oklch(0.613 0.142 146.0);
  --success-foreground: oklch(1 0 0);
  --warning: oklch(0.769 0.140 75.0);
  --warning-foreground: oklch(0.208 0.040 265.8);
  --info: oklch(0.640 0.079 266.6);           /* usa el azul claro */
  --info-foreground: oklch(0.208 0.040 265.8);
}

.dark {
  /* Fondo oscuro sobrio (navy-neutro) */
  --background: oklch(0.140 0.020 265.0);     /* aprox #0B1020 */
  --foreground: oklch(0.929 0.013 255.5);     /* #E2E8F0 */

  --card: oklch(0.208 0.040 265.8);           /* #0F172A */
  --card-foreground: oklch(0.929 0.013 255.5);

  --popover: oklch(0.208 0.040 265.8);
  --popover-foreground: oklch(0.929 0.013 255.5);

  /* Primary más visible en dark */
  --primary: oklch(0.535 0.095 266.0);        /* #5670AE */
  --primary-foreground: oklch(1 0 0);

  --secondary: oklch(0.278 0.030 256.8);      /* #1F2937 */
  --secondary-foreground: oklch(0.929 0.013 255.5);

  --muted: oklch(0.228 0.020 260.0);
  --muted-foreground: oklch(0.869 0.020 252.9); /* #CBD5E1 */

  --accent: oklch(0.214 0.045 266.0);         /* aprox #17254B */
  --accent-foreground: oklch(0.929 0.013 255.5);

  --destructive: oklch(0.550 0.200 27.0);
  --destructive-foreground: oklch(1 0 0);

  --border: oklch(0.278 0.030 256.8);         /* #1F2937 */
  --input: oklch(0.278 0.030 256.8);
  --ring: oklch(0.640 0.079 266.6);           /* #768BBD */

  --success: oklch(0.700 0.160 146.0);
  --success-foreground: oklch(0.140 0.020 265.0);
  --warning: oklch(0.820 0.150 75.0);
  --warning-foreground: oklch(0.140 0.020 265.0);
  --info: oklch(0.640 0.079 266.6);
  --info-foreground: oklch(0.140 0.020 265.0);
}
4) Jerarquía tipográfica (estilo “colegio”)
Objetivo: lectura cómoda para comunicados + eficiencia en paneles.
4.1 Reglas generales
Titulares: sobrios, sin mayúsculas sostenidas.
Cuerpo: tamaño estándar y buen interlineado.
Evitar texto demasiado claro en fondos blancos (usar muted-foreground).
4.2 Escala recomendada (Tailwind)
H1: text-3xl md:text-4xl font-semibold tracking-tight
H2: text-2xl font-semibold tracking-tight
H3: text-xl font-semibold
Body: text-base leading-7
Small: text-sm leading-6
Helper: text-xs text-muted-foreground
5) Componentes shadcn/ui (normas institucionales)
5.1 Button (gobernanza estricta)
Reglas
Máximo 1 botón primary por bloque/sección.
destructive siempre con confirmación (Dialog).
outline para alternativas (descargar, ver detalle).
ghost solo para toolbars (acciones de baja prioridad).
Mapeo institucional
Primary: “Guardar”, “Enviar”, “Confirmar”, “Postular”
Secondary/Outline: “Volver”, “Cancelar”, “Vista previa”
Ghost: iconos en tablas (ver, editar, más)
5.2 Card
Módulo base de portal: avisos, noticias, resumen de curso.
Título + descripción breve + contenido.
Acciones al pie, alineadas a la derecha.
5.3 Alert / Callout (comunicación oficial)
Estructura:
Título (qué es)
Descripción (qué hacer)
Si corresponde, acción (botón/link)
Estados sugeridos:
Info (usa --info)
Success (--success)
Warning (--warning)
Destructive (--destructive)
5.4 Dialog / Sheet
Dialog: confirmaciones y edición corta.
Sheet: formularios medianos / detalle lateral.
Siempre: foco visible + botón de cierre claro + título.
5.5 Tables (panel administrativo)
Checklist obligatorio por tabla:
Loading / Empty / Error
Filtros + “Limpiar filtros”
Columna de acciones al final
Paginación visible
6) Formularios (estándar apoderados/docentes)
Reglas:
Label siempre visible (no solo placeholder).
Validación: error claro bajo el campo.
Formato explícito en campos sensibles (RUT, correo, teléfono).
Microcopy recomendado:
“Campo obligatorio.”
“Ingresa un correo válido (ej: nombre@dominio.cl).”
“No se pudo guardar. Intenta nuevamente.”
7) Accesibilidad (mínimos por vista)
Navegación completa por teclado
Foco visible (ring)
Contraste adecuado en texto y botones
Títulos semánticos (H1/H2/H3)
Mensajes de error entendibles (sin tecnicismos)
8) Uso del logo (digital)
Fondos claros: logo azul original.
Fondos oscuros: usar variante en blanco (monocroma) si está disponible.
Mantener “aire” alrededor (zona de seguridad): al menos el alto del escudo.
No aplicar sombras, gradientes ni cambios de color al logo.
9) Reglas rápidas “Do / Don’t”
✅ Usar tokens: bg-primary text-primary-foreground
❌ Hardcodear colores: bg-blue-600 “porque se ve bien”
✅ Un CTA principal por sección
❌ Tres botones primary compitiendo

✅ Avisos con título + acción clara
❌ Mensajes ambiguos tipo “Error 500”

