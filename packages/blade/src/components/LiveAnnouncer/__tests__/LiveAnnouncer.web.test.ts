import { announce, clearAnnouncer, destroyAnnouncer } from '../LiveAnnouncer.web';

describe('LiveAnnouncer (web)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    destroyAnnouncer();
  });

  afterEach(() => {
    destroyAnnouncer();
    jest.useRealTimers();
  });

  it('should create live region container and append to document.body', () => {
    announce('Test notification');

    const container = document.querySelector('[data-live-announcer="true"]');
    expect(container).toBeInTheDocument();
    expect(container?.parentNode).toBe(document.body);
  });

  it('should announce message in assertive log by default', () => {
    announce('Assertive notification');

    const container = document.querySelector('[data-live-announcer="true"]');
    const assertiveLog = container?.querySelector('[aria-live="assertive"]');
    expect(assertiveLog).toBeInTheDocument();
    expect(assertiveLog).toHaveAttribute('role', 'log');
    expect(assertiveLog).toHaveAttribute('aria-relevant', 'additions');
    expect(assertiveLog).toHaveTextContent('Assertive notification');
  });

  it('should announce message in polite log when specified', () => {
    announce('Polite notification', 'polite');

    const container = document.querySelector('[data-live-announcer="true"]');
    const politeLog = container?.querySelector('[aria-live="polite"]');
    expect(politeLog).toBeInTheDocument();
    expect(politeLog).toHaveAttribute('role', 'log');
    expect(politeLog).toHaveAttribute('aria-relevant', 'additions');
    expect(politeLog).toHaveTextContent('Polite notification');
  });

  it('should automatically remove announced message after 1000ms', () => {
    announce('Temporary message', 'assertive');

    const assertiveLog = document.querySelector('[aria-live="assertive"]');
    expect(assertiveLog).toHaveTextContent('Temporary message');

    // Advance time past the 1000ms delay
    jest.advanceTimersByTime(1000);

    expect(assertiveLog).toBeEmptyDOMElement();
  });

  it('should not throw or set timeout when announcing an empty string', () => {
    announce('', 'assertive');

    const assertiveLog = document.querySelector('[aria-live="assertive"]');
    expect(assertiveLog).toHaveTextContent('');
  });

  it('should maintain a singleton instance and reuse the same container on multiple calls', () => {
    announce('First message');
    announce('Second message');
    announce('Third message', 'polite');

    const containers = document.querySelectorAll('[data-live-announcer="true"]');
    expect(containers.length).toBe(1);
  });

  it('should clear assertive log when clearAnnouncer("assertive") is called', () => {
    announce('Assertive alert', 'assertive');
    announce('Polite info', 'polite');

    clearAnnouncer('assertive');

    const assertiveLog = document.querySelector('[aria-live="assertive"]');
    const politeLog = document.querySelector('[aria-live="polite"]');
    expect(assertiveLog).toBeEmptyDOMElement();
    expect(politeLog).toHaveTextContent('Polite info');
  });

  it('should clear polite log when clearAnnouncer("polite") is called', () => {
    announce('Assertive alert', 'assertive');
    announce('Polite info', 'polite');

    clearAnnouncer('polite');

    const assertiveLog = document.querySelector('[aria-live="assertive"]');
    const politeLog = document.querySelector('[aria-live="polite"]');
    expect(assertiveLog).toHaveTextContent('Assertive alert');
    expect(politeLog).toBeEmptyDOMElement();
  });

  it('should clear both logs when clearAnnouncer() is called without argument', () => {
    announce('Assertive alert', 'assertive');
    announce('Polite info', 'polite');

    // @ts-expect-error testing call without parameter
    clearAnnouncer();

    const assertiveLog = document.querySelector('[aria-live="assertive"]');
    const politeLog = document.querySelector('[aria-live="polite"]');
    expect(assertiveLog).toBeEmptyDOMElement();
    expect(politeLog).toBeEmptyDOMElement();
  });

  it('should safely do nothing when clearAnnouncer() is called before any announce()', () => {
    expect(() => {
      clearAnnouncer('assertive');
    }).not.toThrow();
  });

  it('should remove container from DOM when destroyAnnouncer() is called', () => {
    announce('Message before destroy');
    expect(document.querySelector('[data-live-announcer="true"]')).toBeInTheDocument();

    destroyAnnouncer();
    expect(document.querySelector('[data-live-announcer="true"]')).not.toBeInTheDocument();
  });

  it('should safely do nothing when destroyAnnouncer() is called multiple times', () => {
    expect(() => {
      destroyAnnouncer();
      destroyAnnouncer();
    }).not.toThrow();
  });

  it('should recreate announcer container when announce() is called after destroyAnnouncer()', () => {
    announce('First lifecycle');
    expect(document.querySelector('[data-live-announcer="true"]')).toBeInTheDocument();

    destroyAnnouncer();
    expect(document.querySelector('[data-live-announcer="true"]')).not.toBeInTheDocument();

    announce('Second lifecycle');
    const newContainer = document.querySelector('[data-live-announcer="true"]');
    expect(newContainer).toBeInTheDocument();
    expect(newContainer?.querySelector('[aria-live="assertive"]')).toHaveTextContent(
      'Second lifecycle',
    );
  });
});
