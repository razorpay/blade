// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { jsxToSvg, toKebab, updateLockfile } from '../../scripts/icon-svgs/extract-blade.mjs';

describe('extract-blade', () => {
  it('names glyphs in kebab case from Blade component names', () => {
    expect(toKebab('ArrowRightIcon')).toBe('arrow-right');
    expect(toKebab('CheckCircle2Icon')).toBe('check-circle-2');
    expect(toKebab('QRCodeIcon')).toBe('qr-code');
    expect(toKebab('Battery100PercentIcon')).toBe('battery-100-percent');
  });

  it('turns an icon component into currentColor SVG, without its clip box', () => {
    const source = `
      <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
        <G clipPath="url(#a)">
          <Path fillRule="evenodd" clipRule="evenodd" d="M1 1H5V5Z" fill={iconColor} />
        </G>
        <Defs><ClipPath id="a"><Rect width="24" height="24" fill={iconColor} /></ClipPath></Defs>
      </Svg>`;
    expect(jsxToSvg(source, 'TestIcon')).toBe(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M1 1H5V5Z"/></svg>\n',
    );
  });

  it('keeps codes stable: new names append, removed names retire for good', () => {
    const first = updateLockfile({ glyphs: {}, retired: {} }, ['info', 'close']);
    expect(first.glyphs).toEqual({ close: 0xe000, info: 0xe001 });

    const added = updateLockfile(first, ['info', 'close', 'alpha']);
    expect(added.glyphs).toEqual({ alpha: 0xe002, close: 0xe000, info: 0xe001 });

    const removed = updateLockfile(added, ['info', 'alpha', 'beta']);
    expect(removed.glyphs).toEqual({ alpha: 0xe002, beta: 0xe003, info: 0xe001 });
    expect(removed.retired).toEqual({ close: 0xe000 });

    const back = updateLockfile(removed, ['info', 'alpha', 'beta', 'close']);
    expect(back.glyphs.close).toBe(0xe000);
    expect(back.retired).toEqual({});
  });
});
