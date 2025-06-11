export const hexAlphaToRgba = (hexAlpha: string): { r: number; g: number; b: number; a: number } => {
  const [hex, alphaStr] = hexAlpha.split("@");
  const alpha = parseFloat(alphaStr ?? "1");

  if (!/^#([0-9a-fA-F]{6})$/.test(hex)) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);

  return { r, g, b, a: isNaN(alpha) ? 1 : alpha };
};


export const rgbaToHexAlpha = ({ r, g, b, a }: { r: number; g: number; b: number; a: number }) => {
  const toHex = (value: number) => value.toString(16).padStart(2, "0");
  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  return `${hex}@${a.toFixed(2)}`;
};

