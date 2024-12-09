import React from 'react';
import { fireNativeEvent } from './fireNativeEvent.web';

describe('fireNativeEvent', () => {
  let ref: React.RefObject<HTMLElement>;

  beforeEach(() => {
    ref = React.createRef();
    // using div as a test element because it don't have  both "change" and "input" events
    document.body.innerHTML = '<div id="test-element"></div>';
    Object.defineProperty(ref, 'current', { value: document.getElementById('test-element') });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch "change" event on the element', () => {
    const handleChange = jest.fn();
    ref.current?.addEventListener('change', handleChange);

    fireNativeEvent(ref, ['change']);
    expect(handleChange).toHaveBeenCalled();
  });

  it('should dispatch "input" event on the element', () => {
    const handleInput = jest.fn();
    ref.current?.addEventListener('input', handleInput);

    fireNativeEvent(ref, ['input']);
    expect(handleInput).toHaveBeenCalled();
  });

  it('should dispatch both "change" and "input" events on the element', () => {
    const handleChange = jest.fn();
    const handleInput = jest.fn();

    ref.current?.addEventListener('change', handleChange);
    ref.current?.addEventListener('input', handleInput);

    fireNativeEvent(ref, ['change', 'input']);
    expect(handleChange).toHaveBeenCalled();
    expect(handleInput).toHaveBeenCalled();
  });
});
