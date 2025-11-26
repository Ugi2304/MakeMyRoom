export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
  relatedLinks?: { title: string; url: string }[];
}

export enum AppMode {
  UPLOAD = 'UPLOAD',
  DESIGN = 'DESIGN',
}

export interface DesignStyle {
  id: string;
  name: string;
  prompt: string;
  thumbnail: string;
}

export const DESIGN_STYLES: DesignStyle[] = [
  {
    id: 'mid-century',
    name: 'Mid-Century Modern',
    prompt: 'Interior design in Mid-Century Modern style, teak wood, organic curves, clean lines, muted tones, high quality photorealistic',
    thumbnail: 'https://picsum.photos/id/10/100/100',
  },
  {
    id: 'scandinavian',
    name: 'Scandinavian',
    prompt: 'Interior design in Scandinavian style, bright, airy, minimalism, white walls, light wood, cozy textures, high quality photorealistic',
    thumbnail: 'https://picsum.photos/id/20/100/100',
  },
  {
    id: 'industrial',
    name: 'Industrial',
    prompt: 'Interior design in Industrial style, exposed brick, metal accents, raw materials, loft aesthetic, high quality photorealistic',
    thumbnail: 'https://picsum.photos/id/30/100/100',
  },
  {
    id: 'bohemian',
    name: 'Bohemian',
    prompt: 'Interior design in Bohemian style, eclectic patterns, plants, rattan, warm colors, layered textiles, high quality photorealistic',
    thumbnail: 'https://picsum.photos/id/40/100/100',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    prompt: 'Interior design in Cyberpunk style, neon lights, futuristic furniture, dark tones, high tech aesthetic, high quality photorealistic',
    thumbnail: 'https://picsum.photos/id/50/100/100',
  },
];