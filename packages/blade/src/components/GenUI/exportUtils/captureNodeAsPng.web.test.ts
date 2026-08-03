import { captureNodeAsPng } from './captureNodeAsPng.web';

const mockToBlob = jest.fn();

jest.mock('html-to-image', () => ({
  toBlob: (...args: unknown[]) => mockToBlob(...args),
}));

describe('GenUI exportUtils/captureNodeAsPng', () => {
  const node = document.createElement('div');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('captures a node via html-to-image and returns the blob', async () => {
    const blob = new Blob(['png'], { type: 'image/png' });
    mockToBlob.mockResolvedValue(blob);

    await expect(captureNodeAsPng(node)).resolves.toBe(blob);
    expect(mockToBlob).toHaveBeenCalledWith(
      node,
      expect.objectContaining({ pixelRatio: 2, cacheBust: true }),
    );
  });

  it('throws when html-to-image yields no blob', async () => {
    mockToBlob.mockResolvedValue(null);
    await expect(captureNodeAsPng(node)).rejects.toThrow(/Failed to capture/);
  });
});
