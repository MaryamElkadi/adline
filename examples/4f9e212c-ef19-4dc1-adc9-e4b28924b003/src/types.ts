export interface Color {
  hex: string;
  rgb: string;
  hsl: string;
  locked: boolean;
}

export interface ColorScheme {
  id: string;
  name: string;
  colors: Color[];
  createdAt: string;
  usageCount: number;
}