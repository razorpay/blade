import { downloadBlob } from './downloadBlob.web';

describe('GenUI exportUtils/downloadBlob', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    Object.defineProperty(URL, 'createObjectURL', {
      value: jest.fn().mockReturnValue('blob:mock-url'),
      configurable: true,
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      value: jest.fn(),
      configurable: true,
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('creates an anchor with the filename and clicks it', () => {
    const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    downloadBlob('a,b\r\n1,2', 'table.csv', 'text/csv');

    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    const blobArg = (URL.createObjectURL as jest.Mock).mock.calls[0][0] as Blob;
    expect(blobArg).toBeInstanceOf(Blob);
    expect(blobArg.type).toBe('text/csv');
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('accepts a Blob directly without re-wrapping', () => {
    jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const pngBlob = new Blob(['png-bytes'], { type: 'image/png' });

    downloadBlob(pngBlob, 'card.png', 'image/png');

    expect(URL.createObjectURL).toHaveBeenCalledWith(pngBlob);
  });

  it('revokes the object URL after the download starts', () => {
    jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    downloadBlob('data', 'file.csv', 'text/csv');
    expect(URL.revokeObjectURL).not.toHaveBeenCalled();

    jest.runOnlyPendingTimers();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });
});
