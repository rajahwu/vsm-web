import colors from '@rsys-os/design-source/tokens/colors.json';
import phases from '@rsys-os/design-source/tokens/phases.json';
import spacing from '@rsys-os/design-source/tokens/spacing.json';
import typography from '@rsys-os/design-source/tokens/typography.json';

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
  static getTokens() {
    return { colors, phases, spacing, typography };
  }

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
}
