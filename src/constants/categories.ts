import type { MediaCategory } from '../types/media';

export interface CategoryItem {
  id: MediaCategory;
  label: string;
  iconName: string;
  description: string;
}

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'All',
    label: 'Semua',
    iconName: 'Sparkles',
    description: 'Semua karya visual AI',
  },
  {
    id: 'Photorealistic',
    label: 'Fotorealistik',
    iconName: 'Camera',
    description: 'Potret manusia, fotografi jalanan, dan komposisi realistis',
  },
  {
    id: 'Cinematic',
    label: 'Sinematik',
    iconName: 'Film',
    description: 'Pencahayaan film 35mm, visual atmosferik, dan drama visual',
  },
  {
    id: 'Cyberpunk',
    label: 'Cyberpunk & Sci-Fi',
    iconName: 'Cpu',
    description: 'Kota neon, robot humanoid, dan distopia masa depan',
  },
  {
    id: 'Anime & Manga',
    label: 'Anime & Manga',
    iconName: 'Palette',
    description: 'Gaya visual Studio Ghibli, Makoto Shinkai, dan seni komik',
  },
  {
    id: '3D & Clay',
    label: '3D Render & Clay',
    iconName: 'Box',
    description: 'Karakter tanah liat, miniatur tilt-shift, dan rendering Octane',
  },
  {
    id: 'Architecture',
    label: 'Arsitektur',
    iconName: 'Building',
    description: 'Desain interior modern, vila minimalis, dan lanskap urban',
  },
  {
    id: 'Nature & Animals',
    label: 'Alam & Satwa',
    iconName: 'Leaf',
    description: 'Lanskap pegunungan, hutan lebat, dan satwa liar',
  },
  {
    id: 'Logos & Vector',
    label: 'Logo & Grafis',
    iconName: 'PenTool',
    description: 'Ikon modern, ilustrasi vektor, dan identitas visual',
  },
];
