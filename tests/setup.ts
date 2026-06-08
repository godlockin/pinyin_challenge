import '@testing-library/jest-dom';
import { vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// Load local JSON files for dictionary mocking
const publicDir = path.resolve(__dirname, '../public');
const dictCache: Record<string, string> = {};

function loadLocalFile(urlPath: string): string | null {
  if (dictCache[urlPath]) return dictCache[urlPath];
  try {
    const filePath = path.join(publicDir, urlPath);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      dictCache[urlPath] = content;
      return content;
    }
  } catch {
    // File not found
  }
  return null;
}

// Mock global fetch to serve local public files
const originalFetch = globalThis.fetch;
globalThis.fetch = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;

  // Handle relative paths (e.g., /dict/polyphone-default.json)
  const localContent = loadLocalFile(url.startsWith('/') ? url.slice(1) : url);
  if (localContent !== null) {
    return Promise.resolve(new Response(localContent, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }));
  }

  // Fallback to real fetch for other URLs
  return originalFetch(input, init);
}) as unknown as typeof globalThis.fetch;

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock;

// Mock matchMedia
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

// Mock URL.createObjectURL
Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: vi.fn().mockReturnValue('blob:mock-url'),
});

Object.defineProperty(URL, 'revokeObjectURL', {
  writable: true,
  value: vi.fn(),
});

// Mock window.print
Object.defineProperty(window, 'print', {
  writable: true,
  value: vi.fn(),
});
