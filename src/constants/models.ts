import { AIModelId } from '../types/media';

export interface AIModelConfig {
  id: AIModelId;
  name: string;
  badgeLabel: string;
  category: 'image' | 'video' | 'multimodal';
  color: {
    bg: string;
    text: string;
    border: string;
  };
  description: string;
}

export const AI_MODELS: Record<AIModelId, AIModelConfig> = {
  'flux-1-dev': {
    id: 'flux-1-dev',
    name: 'FLUX.1-dev',
    badgeLabel: 'FLUX.1',
    category: 'image',
    color: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-500/30',
    },
    description: 'Black Forest Labs state-of-the-art open-weights image generator',
  },
  'midjourney-v6': {
    id: 'midjourney-v6',
    name: 'Midjourney v6.1',
    badgeLabel: 'Midjourney v6.1',
    category: 'image',
    color: {
      bg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
      text: 'text-indigo-700 dark:text-indigo-300',
      border: 'border-indigo-500/30',
    },
    description: 'Hyper-photorealistic and artistic composition engine',
  },
  'sdxl-1-0': {
    id: 'sdxl-1-0',
    name: 'Stable Diffusion XL',
    badgeLabel: 'SDXL 1.0',
    category: 'image',
    color: {
      bg: 'bg-purple-500/10 dark:bg-purple-500/20',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-500/30',
    },
    description: 'Stability AI open-source flagship model',
  },
  'dalle-3': {
    id: 'dalle-3',
    name: 'DALL-E 3',
    badgeLabel: 'DALL-E 3',
    category: 'image',
    color: {
      bg: 'bg-teal-500/10 dark:bg-teal-500/20',
      text: 'text-teal-700 dark:text-teal-300',
      border: 'border-teal-500/30',
    },
    description: 'OpenAI highly semantic prompt-following visual model',
  },
  'runway-gen3': {
    id: 'runway-gen3',
    name: 'Runway Gen-3 Alpha',
    badgeLabel: 'Runway Gen-3',
    category: 'video',
    color: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/20',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-500/30',
    },
    description: 'Cinematic temporal consistency and photorealistic camera motion',
  },
  'luma-dream-machine': {
    id: 'luma-dream-machine',
    name: 'Luma Dream Machine',
    badgeLabel: 'Luma AI',
    category: 'video',
    color: {
      bg: 'bg-rose-500/10 dark:bg-rose-500/20',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-500/30',
    },
    description: 'Ultra-fast high-fidelity video generation with physical realism',
  },
  'kling-ai': {
    id: 'kling-ai',
    name: 'Kling AI 1.5',
    badgeLabel: 'Kling 1.5',
    category: 'video',
    color: {
      bg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
      text: 'text-cyan-700 dark:text-cyan-300',
      border: 'border-cyan-500/30',
    },
    description: 'Advanced motion simulation and long-duration video generation',
  },
  'openai-sora': {
    id: 'openai-sora',
    name: 'OpenAI Sora',
    badgeLabel: 'Sora',
    category: 'video',
    color: {
      bg: 'bg-sky-500/10 dark:bg-sky-500/20',
      text: 'text-sky-700 dark:text-sky-300',
      border: 'border-sky-500/30',
    },
    description: 'Diffusion model for generating 60-second complex cinematic scenes',
  },
};

export const AI_MODEL_LIST = Object.values(AI_MODELS);
