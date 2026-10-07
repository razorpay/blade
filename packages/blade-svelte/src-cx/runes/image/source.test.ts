import { describe, it, expect } from 'vitest';
import { imageUrl, isImageMarkup } from './source';

const svg = '<svg viewBox="0 0 16 16"><path d="M1 1h2" fill="currentColor"/></svg>';

describe('isImageMarkup', () => {
  it('tells markup from a URL', () => {
    expect(isImageMarkup(svg)).toBe(true);
    expect(isImageMarkup(`\n  ${svg}`)).toBe(true);
    expect(isImageMarkup('/assets/images/lock.1a2b3c4d.svg')).toBe(false);
    expect(isImageMarkup('https://cdn.razorpay.com/app/paytm.svg')).toBe(false);
    expect(isImageMarkup('data:image/svg+xml;utf8,%3Csvg%3E')).toBe(false);
  });
});

describe('imageUrl', () => {
  it('passes a URL through', () => {
    expect(imageUrl('/icons/lock.svg')).toBe('/icons/lock.svg');
  });

  it('encodes markup as a data URI that decodes back', () => {
    const url = imageUrl(`${svg}\n`);
    const prefix = 'data:image/svg+xml;utf8,';
    expect(url.startsWith(prefix)).toBe(true);
    expect(url).not.toContain('<');
    expect(url).not.toContain('#');
    expect(decodeURIComponent(url.slice(prefix.length))).toBe(svg);
  });
});
