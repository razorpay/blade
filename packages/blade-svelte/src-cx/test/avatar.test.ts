import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import AvatarHarness from './fixtures/AvatarHarness.svelte';
import { initialsOf } from '../runes/avatar/group.svelte';
import { resolveAvatar } from '../components/avatar/styles';
import { glyphsIn } from './classes';
import { UserIcon } from '../icons';

describe('Avatar', () => {
  it("shows initials on Figma's tinted disc with the subtle rim, named by `name`", () => {
    const { getByTestId, getByRole } = render(AvatarHarness);
    const root = getByTestId('plain');
    expect(root.className).toContain('w-9 h-9');
    expect(root.className).toContain('rounded-max');
    expect(root.className).toContain('bg-surface-gray-intense');
    const face = getByRole('img', { name: 'Nitin Kumar' });
    expect(face.textContent?.trim()).toBe('NK');
    expect(face.className).toContain('bg-interactive-neutral-faded');
    expect(face.className).toContain('border-thin border-surface-gray-subtle');
  });

  it('square, sized, coloured and selected', () => {
    const { getByTestId } = render(AvatarHarness);
    const root = getByTestId('square');
    expect(root.className).toContain('w-12 h-12 rounded-small');
    const face = root.firstElementChild!;
    expect(face.className).toContain('bg-interactive-primary-faded text-interactive-primary-normal');
    expect(face.className).toContain('border-thicker border-surface-primary-normal');
    expect(face.textContent?.trim()).toBe('RA');
  });

  it('falls back to the user glyph without a name', () => {
    const { getByTestId } = render(AvatarHarness);
    expect(glyphsIn(getByTestId('glyph'), UserIcon)).toHaveLength(1);
  });

  it('is a button with onClick and a link with href, with the focus ring and hover tint', async () => {
    const onClick = vi.fn();
    const { getByRole } = render(AvatarHarness, { props: { onClick } });
    const button = getByRole('button', { name: 'Clickable' });
    expect(button.className).toContain('hover:bg-interactive-neutral-faded-highlighted');
    expect(button.className).toContain('focus-visible:outline-surface-primary-muted');
    await fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(getByRole('link', { name: 'Profile' }).getAttribute('href')).toBe('/me');
  });

  it('shows an image named by `name`, and falls back to the initials when it fails', async () => {
    const { getByTestId, getByAltText } = render(AvatarHarness);
    const image = getByAltText('With image');
    expect(image.className).toContain('object-cover');
    await fireEvent.error(image);
    expect(getByTestId('image').textContent?.trim()).toBe('WI');
  });

  it('hangs the addons at the top and bottom right', () => {
    const { getByTestId } = render(AvatarHarness);
    expect(getByTestId('dot').parentElement!.className).toContain('absolute');
    expect(getByTestId('dot').parentElement!.className).toContain('top-0.5 right-0.5');
    expect(getByTestId('badge').parentElement!.className).toContain('w-3 h-3 bottom-0 right-0');
  });

  it('initials: two letters of one name, else the first and last initials', () => {
    expect(initialsOf('razorpay')).toBe('RA');
    expect(initialsOf('  Asha  Devi Rao ')).toBe('AR');
    expect(initialsOf('')).toBe('');
  });

  it("xlarge sets the initials in the heading face, Figma's 20/26", () => {
    expect(resolveAvatar({ size: 'xlarge' }).initials).toContain('font-heading text-400 leading-400');
  });
});

describe('AvatarGroup', () => {
  it("a labelled group whose size wins, each avatar after the first overlapping the last by the density's amount", () => {
    const { getByRole, getByTestId } = render(AvatarHarness);
    expect(getByRole('group', { name: 'Team' })).toBe(getByTestId('group'));
    const first = getByTestId('member-asha');
    const second = getByTestId('member-dev');
    // The group's small wins over each avatar's xlarge.
    expect(first.className).toContain('w-7 h-7');
    expect(first.className).not.toContain('margin-left');
    expect(second.className).toContain('[margin-left:-16px]');
  });

  it('maxCount folds the rest into a "+N" avatar', () => {
    const { getByTestId, getByRole } = render(AvatarHarness, { props: { maxCount: 3 } });
    expect(getByTestId('member-ira').hidden).toBe(false);
    expect(getByTestId('member-kabir').hidden).toBe(true);
    expect(getByTestId('member-meera').hidden).toBe(true);
    const more = getByRole('img', { name: '2 more' });
    expect(more.textContent?.trim()).toBe('+2');
    expect(more.firstElementChild!.className).toContain('bg-surface-gray-subtle');
  });
});
