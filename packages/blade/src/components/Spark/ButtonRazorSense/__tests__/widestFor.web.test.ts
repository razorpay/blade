import { widestFor } from '../ButtonRazorSenseLayer.web';
import { buttonSenseLight } from '../comps';
import type { FreshDoc } from '../../RazorSenseEngine';

describe('ButtonRazorSense: the widest button it plays on', () => {
  it('is 300px for flow 9’s comp, past which its bands crowd the button', () => {
    expect(widestFor(buttonSenseLight)).toBe(300);
  });

  it('is the comp’s own width when that is narrower (made at 2x)', () => {
    expect(widestFor({ comp: { w: 400, h: 200 } } as FreshDoc)).toBe(200);
  });
});
