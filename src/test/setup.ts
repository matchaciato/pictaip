import { vi } from 'vitest';

// 1. Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// 2. Mock URL.createObjectURL and URL.revokeObjectURL
if (typeof window.URL.createObjectURL === 'undefined') {
  window.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
}
if (typeof window.URL.revokeObjectURL === 'undefined') {
  window.URL.revokeObjectURL = vi.fn();
}

// 3. Mock navigator.clipboard
if (!navigator.clipboard) {
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: vi.fn().mockResolvedValue(undefined),
      readText: vi.fn().mockResolvedValue(''),
    },
    writable: true,
  });
}

// 4. Mock window.scrollTo
window.scrollTo = vi.fn();
