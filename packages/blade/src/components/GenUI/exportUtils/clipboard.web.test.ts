import { copyToClipboard } from './clipboard.web';

describe('GenUI exportUtils/clipboard', () => {
  const originalClipboard = navigator.clipboard;

  const setClipboard = (value: unknown): void => {
    Object.defineProperty(navigator, 'clipboard', { value, configurable: true });
  };

  afterEach(() => {
    setClipboard(originalClipboard);
    jest.restoreAllMocks();
  });

  it('writes text via the Clipboard API and returns true', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    setClipboard({ writeText });

    await expect(copyToClipboard('hello')).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith('hello');
  });

  it('returns false when the clipboard write fails', async () => {
    setClipboard({ writeText: jest.fn().mockRejectedValue(new Error('denied')) });

    await expect(copyToClipboard('nope')).resolves.toBe(false);
  });
});
