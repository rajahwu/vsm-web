import colors from '../../../design-source/TOKENS_SOURCE/colors.json';
import phases from '../../../design-source/TOKENS_SOURCE/phases.json';
import spacing from '../../../design-source/TOKENS_SOURCE/spacing.json';
import typography from '../../../design-source/TOKENS_SOURCE/typography.json';

type AnyJson = Record<string, any>;

const COLORS = colors as AnyJson;
const PHASES = phases as AnyJson;
const SPACING = spacing as AnyJson;
const TYPOGRAPHY = typography as AnyJson;

export interface Phase {
  id: string;
  name: string;
  description?: string;
  duration?: number;
  color?: string;
}


export class RitualBrand {
  /**
   * Returns the raw token objects for use in TS/JS logic.
   */
  static getTokens() {
    return { colors, phases, spacing, typography };
  }


  /**   
   * Compiles the Design Source into CSS Variables.
   */
  static toCSSVariables() {
    const vars: string[] = [":root {"];

    // --- PALETTE ---
    Object.entries(colors.palette as AnyJson).forEach(([hue, shades]) => {
      Object.entries(shades).forEach(([shade, value]) => {
        vars.push(`  --color-${hue}-${shade}: ${value};`);
      });
    });

    // --- BASE SEMANTICS ---
    Object.entries(colors.base as AnyJson).forEach(([key, value]) => {
      if (typeof value === "string" && value.includes("-")) {
        const [hue, shade] = value.split("-");
        vars.push(`  --color-base-${key}: var(--color-${hue}-${shade});`);
      } else {
        vars.push(`  --color-base-${key}: ${value};`);
      }
    });

    // --- PHASE SEMANTICS ---
    Object.entries(colors.phases as AnyJson).forEach(([key, config]) => {
      const colorRef = config.color;
      if (colorRef && typeof colorRef === "string" && colorRef.includes("-")) {
        const [hue, shade] = colorRef.split("-");
        vars.push(`  --color-phase-${key}: var(--color-${hue}-${shade});`);
      }
    });

    // --- SPACING & RADIUS ---
    Object.entries(spacing.spacing as AnyJson).forEach(([key, value]) => {
      vars.push(`  --spacing-${key}: ${value};`);
    });

    Object.entries(spacing.radius as AnyJson).forEach(([key, value]) => {
      vars.push(`  --radius-${key}: ${value};`);
    });

    // --- CONTAINER & GRID ---
    if (spacing.container?.maxWidth) {
      Object.entries(spacing.container.maxWidth).forEach(([key, value]) => {
        vars.push(`  --breakpoint-${key}: ${value};`);
      });
    }

    if (spacing.container?.padding) {
      Object.entries(spacing.container.padding).forEach(([key, value]) => {
        vars.push(`  --spacing-container-padding-${key}: ${value};`);
      });
    }

    if (spacing.grid) {
      if (spacing.grid.columns) vars.push(`  --grid-columns: ${spacing.grid.columns};`);
      if (spacing.grid.gutter) vars.push(`  --grid-gutter: ${spacing.grid.gutter};`);
    }

    // --- TYPOGRAPHY ---
    Object.entries(typography.fonts as AnyJson).forEach(([key, config]) => {
      vars.push(`  --font-${key}: ${config.family};`);
    });

    Object.entries(typography.special as AnyJson).forEach(([key, config]) => {
      vars.push(`  --font-special-${key}: ${config.font};`);
    });

    vars.push("}");
    return vars.join("\n");
  }


  /**
   * Compiles the Design Source into a Tailwind 4 CSS Theme.
   */
  static toTailwindCSS() {
    const lines = ['@theme {'];

    // --- 1. PALETTE (The Raw Paint) ---
    // Maps colors.palette.zinc.950 -> --color-zinc-950: #09090b;
    lines.push('\n  /* --- PALETTE --- */');
    Object.entries(colors.palette as AnyJson).forEach(([hue, shades]) => {
      Object.entries(shades).forEach(([shade, value]) => {
        lines.push(`  --color-${hue}-${shade}: ${value};`);
      });
    });

    // --- 2. BASE SEMANTICS (The Context) ---
    // Maps colors.base.background ("zinc-950") -> --color-base-background: var(--color-zinc-950);
    lines.push('\n  /* --- BASE SEMANTICS --- */');
    Object.entries(colors.base as AnyJson).forEach(([key, value]) => {
      // Check if value is a color reference (e.g. "zinc-950") or raw hex
      if (typeof value === 'string' && value.includes('-')) {
        const [hue, shade] = value.split('-');
        lines.push(`  --color-base-${key}: var(--color-${hue}-${shade});`);
      } else {
        lines.push(`  --color-base-${key}: ${value};`);
      }
    });

    // --- 3. PHASE SEMANTICS ---
    // Maps colors.phases.plan.color ("amber-500") -> --color-phase-plan: var(--color-amber-500);
    lines.push('\n  /* --- PHASE SEMANTICS --- */');
    Object.entries(colors.phases as AnyJson).forEach(([key, config]) => {
      // FIX: config is an object { color: "amber-500", ... }, not a string.
      // We assume the 'color' property holds the reference string.
      const colorRef = config.color;

      if (colorRef && typeof colorRef === 'string' && colorRef.includes('-')) {
        const [hue, shade] = colorRef.split('-');
        lines.push(`  --color-phase-${key}: var(--color-${hue}-${shade});`);
      }
    });

    // --- 4. SPACING & RADIUS ---
    lines.push('\n  /* --- SPACING & RADIUS --- */');
    Object.entries(spacing.spacing as AnyJson).forEach(([key, value]) => {
      lines.push(`  --spacing-${key}: ${value};`);
    });
    Object.entries(spacing.radius as AnyJson).forEach(([key, value]) => {
      lines.push(`  --radius-${key}: ${value};`);
    });

    // --- 5. CONTAINER & GRID ---
    lines.push('\n  /* --- CONTAINER & GRID --- */');
    if (spacing.container) {
      const container = spacing.container as AnyJson;
      if (container.maxWidth) {
        Object.entries(container.maxWidth).forEach(([key, value]) => {
          lines.push(`  --breakpoint-${key}: ${value};`);
        });
      }
      if (container.padding) {
        Object.entries(container.padding).forEach(([key, value]) => {
          lines.push(`  --spacing-container-padding-${key}: ${value};`);
        });
      }
    }
    if (spacing.grid) {
      const grid = spacing.grid as AnyJson;
      if (grid.columns) lines.push(`  --grid-columns: ${grid.columns};`);
      if (grid.gutter) lines.push(`  --grid-gutter: ${grid.gutter};`);
    }

    // --- 6. TYPOGRAPHY ---
    lines.push('\n  /* --- TYPOGRAPHY --- */');
    Object.entries(typography.fonts as AnyJson).forEach(([key, config]) => {
      lines.push(`  --font-${key}: ${config.family};`);
    });

    // Special Fonts (Timer, Prompt)
    Object.entries(typography.special as AnyJson).forEach(([key, config]) => {
      lines.push(`  --font-special-${key}: ${config.font};`);
    });

    lines.push('}');
    return lines.join('\n');
  }
}