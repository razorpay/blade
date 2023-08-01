import { throwBladeError, logger } from './logger';

describe('throwBladeError', () => {
  it('should throw an error with the correct message', () => {
    expect(() => throwBladeError({ message: 'Test Error' })).toThrowError('[Blade]: Test Error');
  });

  it('should throw an error with the correct message and moduleName', () => {
    expect(() => throwBladeError({ message: 'Test Error', moduleName: 'ModuleX' })).toThrowError(
      '[Blade: ModuleX]: Test Error',
    );
  });
});

describe('logger', () => {
  // Mock console methods to capture logs during tests
  const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
  const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
  const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

  afterEach(() => {
    // Clear mock console methods after each test
    mockConsoleError.mockClear();
    mockConsoleWarn.mockClear();
    mockConsoleLog.mockClear();
  });

  it('should log an error message without the module name', () => {
    logger({ message: 'Test Error', type: 'error' });
    expect(mockConsoleError).toHaveBeenCalledWith('[Blade]: Test Error');
  });

  it('should log an error message with the correct prefix', () => {
    logger({ message: 'Test Error', moduleName: 'ModuleX', type: 'error' });
    expect(mockConsoleError).toHaveBeenCalledWith('[Blade: ModuleX]: Test Error');
  });

  it('should log a warning message with the correct prefix', () => {
    logger({ message: 'Test Warning', moduleName: 'ModuleY', type: 'warn' });
    expect(mockConsoleWarn).toHaveBeenCalledWith('[Blade: ModuleY]: Test Warning');
  });

  it('should log a regular message with the correct prefix', () => {
    logger({ message: 'Test Log', moduleName: 'ModuleZ', type: 'log' });
    expect(mockConsoleLog).toHaveBeenCalledWith('[Blade: ModuleZ]: Test Log');
  });
});
