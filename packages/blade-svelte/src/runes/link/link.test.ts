import { describe, it, expect } from 'vitest';
import { isInternalHref, isRoutableClick, linkRel } from './link';
import type { LinkClick } from './link';

const plain: LinkClick = {
  button: 0,
  metaKey: false,
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
  defaultPrevented: false,
};

describe('isInternalHref', () => {
  it('accepts paths, queries and hashes; rejects schemes and hosts', () => {
    expect(isInternalHref('/card')).toBe(true);
    expect(isInternalHref('upi/collect?step=2')).toBe(true);
    expect(isInternalHref('#terms')).toBe(true);
    expect(isInternalHref('https://razorpay.com')).toBe(false);
    expect(isInternalHref('//cdn.razorpay.com/x')).toBe(false);
    expect(isInternalHref('mailto:care@razorpay.com')).toBe(false);
    expect(isInternalHref('tel:+911234')).toBe(false);
    expect(isInternalHref('')).toBe(false);
    expect(isInternalHref(undefined)).toBe(false);
  });
});

describe('isRoutableClick', () => {
  it('takes a plain primary click on an internal link', () => {
    expect(isRoutableClick(plain, { href: '/card' })).toBe(true);
    expect(isRoutableClick(plain, { href: '/card', target: '_self' })).toBe(true);
  });

  it('leaves everything the browser treats specially', () => {
    expect(isRoutableClick({ ...plain, metaKey: true }, { href: '/x' })).toBe(false);
    expect(isRoutableClick({ ...plain, ctrlKey: true }, { href: '/x' })).toBe(false);
    expect(isRoutableClick({ ...plain, shiftKey: true }, { href: '/x' })).toBe(false);
    expect(isRoutableClick({ ...plain, button: 1 }, { href: '/x' })).toBe(false);
    expect(isRoutableClick({ ...plain, defaultPrevented: true }, { href: '/x' })).toBe(false);
    expect(isRoutableClick(plain, { href: '/x', target: '_blank' })).toBe(false);
    expect(isRoutableClick(plain, { href: 'https://razorpay.com' })).toBe(false);
  });
});

describe('linkRel', () => {
  it('guards a new browsing context and keeps the caller tokens', () => {
    expect(linkRel('_blank', undefined)).toBe('noopener noreferrer');
    expect(linkRel('_blank', 'nofollow noopener')).toBe('nofollow noopener noreferrer');
    expect(linkRel(undefined, 'nofollow')).toBe('nofollow');
    expect(linkRel('_self', undefined)).toBeUndefined();
  });
});
