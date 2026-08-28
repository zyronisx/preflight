import { describe, expect, it } from 'vitest';
import { isAllowedOrigin } from '../src/cors.js';

describe('api CORS origin validation', () => {
  it('accepts a localhost dev port when Vite chooses a different port', () => {
    expect(isAllowedOrigin('http://localhost:5174', ['http://localhost:5173'], false)).toBe(true);
  });

  it('allows configured non-localhost origins', () => {
    expect(isAllowedOrigin('https://app.example.com', ['https://app.example.com'], false)).toBe(true);
  });
});
