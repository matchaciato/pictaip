import { describe, it, expect } from 'vitest';
import {
  ASPECT_RATIO_OPTIONS,
  updatePromptWithAspectRatio,
} from '../constants/aspectRatios';

describe('Aspect Ratio Constants & Dynamic Prompt Updating', () => {
  it('should define all 6 required aspect ratio options with valid configurations', () => {
    expect(ASPECT_RATIO_OPTIONS.length).toBe(6);

    const ratios = ASPECT_RATIO_OPTIONS.map((o) => o.ratio);
    expect(ratios).toEqual(['1:1', '9:16', '16:9', '4:5', '4:6', '21:9']);

    ASPECT_RATIO_OPTIONS.forEach((opt) => {
      expect(opt.width).toBeGreaterThan(0);
      expect(opt.height).toBeGreaterThan(0);
      expect(['portrait', 'landscape', 'square', 'ultrawide']).toContain(opt.orientation);
      expect(opt.description.length).toBeGreaterThan(0);
    });
  });

  describe('updatePromptWithAspectRatio', () => {
    it('appends [rasio: X:Y] when prompt does not contain any ratio tag', () => {
      const basePrompt = 'cyberpunk neon city in rainy night, 8k resolution';
      const updated = updatePromptWithAspectRatio(basePrompt, '16:9');

      expect(updated).toBe('cyberpunk neon city in rainy night, 8k resolution [rasio: 16:9]');
    });

    it('replaces existing [rasio: ...] tag with the new ratio', () => {
      const promptWithRatio = 'majestic dragon flying over snowy mountain [rasio: 1:1] photorealistic';
      const updated = updatePromptWithAspectRatio(promptWithRatio, '4:6');

      expect(updated).toBe('majestic dragon flying over snowy mountain [rasio: 4:6] photorealistic');
    });

    it('replaces existing [rasio ...] (without colon) tag gracefully', () => {
      const promptWithRatio = 'retro futuristic car driving into sunset [rasio 9:16] ultra detailed';
      const updated = updatePromptWithAspectRatio(promptWithRatio, '21:9');

      expect(updated).toBe('retro futuristic car driving into sunset [rasio: 21:9] ultra detailed');
    });

    it('handles Midjourney style --ar syntax cleanly', () => {
      const mjPrompt = 'cinematic portrait of an astronaut on Mars --ar 16:9';
      const updated = updatePromptWithAspectRatio(mjPrompt, '9:16');

      expect(updated).toContain('[rasio: 9:16]');
    });

    it('handles empty or whitespace-only prompt strings safely', () => {
      expect(updatePromptWithAspectRatio('', '1:1')).toBe('[rasio: 1:1]');
      expect(updatePromptWithAspectRatio('   ', '9:16')).toBe('[rasio: 9:16]');
    });
  });
});
