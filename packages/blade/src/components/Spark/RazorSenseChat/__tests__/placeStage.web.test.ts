import { placeStage } from '../placement';

// RazorSenseChat's stage, cut to the strip at rest and whole again (thinking, the voice look): laid with `inset: 0`, it must stay as
// tall as its chat when it's whole again (a cleared top took the shorthand's top with it: 0 px tall)
describe('placeStage', () => {
  it('cut, then whole again: its top is 0px, never cleared', () => {
    const box = document.createElement('div');
    box.style.cssText = 'position:absolute;inset:0;';
    placeStage(box, 680);
    expect(box.style.top).toBe('680px');
    placeStage(box, 0);
    // (jsdom doesn't expand the inset shorthand: what's checked is that top is set, not cleared)
    expect(box.style.top).toBe('0px');
  });
});
