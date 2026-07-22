import { razorSenseMoodFragmentShader } from '../razorSenseMoodShader';

describe('RazorSense mood shader coordinate ownership', () => {
  it('warps source sampling without moving flute or hue-trail topology', () => {
    expect(razorSenseMoodFragmentShader).toContain('vec2 sourceWarpUv = pointerWarp(vUv);');
    expect(razorSenseMoodFragmentShader).toContain('vec2 sourceUv = coverUv(sourceWarpUv);');
    expect(razorSenseMoodFragmentShader).toContain('float flute = fluteMap(vUv);');
    expect(razorSenseMoodFragmentShader).toContain('float trail = trailAt(vUv);');
    expect(razorSenseMoodFragmentShader).not.toContain('fluteMap(sourceWarpUv)');
    expect(razorSenseMoodFragmentShader).not.toContain('trailAt(sourceWarpUv)');
  });
});
