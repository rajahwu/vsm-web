import colors from '@rsys-os/design-source/tokens/colors.json';
import spacing from '@rsys-os/design-source/tokens/spacing.json';
import typography from '@rsys-os/design-source/tokens/typography.json';

type AnyJson = Record<string, any>;

export class GttmBrand {
  static getTokens() {
    return { colors, spacing, typography };
  }

  static toCSSVariables() {
    const vars: string[] = [':root {'];

    // Palette
    Object.entries(colors.palette as AnyJson).forEach(([hue, shades]) => {
      Object.entries(shades).forEach(([shade, value]) => {
        vars.push(`  --color-${hue}-${shade}: ${value};`);
      });
    });

    // Brand Specific - GTTM often uses teal/emerald
    vars.push('  --color-brand-primary: var(--color-teal-500);');
    vars.push('  --color-brand-secondary: var(--color-emerald-500);');

    // Spacing
    Object.entries(spacing.spacing as AnyJson).forEach(([key, value]) => {
      vars.push(`  --spacing-${key}: ${value};`);
    });

    // Typography
    Object.entries(typography.fonts as AnyJson).forEach(([key, config]) => {
      vars.push(`  --font-${key}: ${config.family};`);
    });

    vars.push('}');
    return vars.join("\n");
  }

  static toTailwindCSS() {
    const lines: string[] = ['@theme {'];
    Object.entries(colors.palette as AnyJson).forEach(([hue, shades]) => {
      Object.entries(shades).forEach(([shade, value]) => {
        lines.push(`  --color-${hue}-${shade}: ${value};`);
      });
    });
    lines.push('}');
    return lines.join("\n");
  }
}
