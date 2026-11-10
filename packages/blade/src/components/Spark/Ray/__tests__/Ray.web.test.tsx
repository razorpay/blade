import React from 'react';
import { fireEvent } from '@testing-library/react';
import { Ray } from '../Ray';
import { RAY_BOX } from '../rayBox';
import { rayBoxSize } from '../RayMount';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<Ray />', () => {
  it('should render Ray with default props', () => {
    const { container } = renderWithTheme(<Ray />);
    expect(container).toMatchSnapshot();
  });

  it('should render his box at his rest size for each size', () => {
    const medium = renderWithTheme(<Ray testID="ray-medium" />);
    expect(medium.getByTestId('ray-medium')).toHaveStyle({ width: '48px' });
    const small = renderWithTheme(<Ray testID="ray-small" size="small" />);
    expect(small.getByTestId('ray-small')).toHaveStyle({ width: '38px' });
  });

  it('should be hidden from assistive tech when no accessibilityLabel is passed', () => {
    const { getByTestId } = renderWithTheme(<Ray testID="ray-test" />);
    expect(getByTestId('ray-test')).toHaveAttribute('aria-hidden', 'true');
  });

  it('should expose an image role when accessibilityLabel is passed', () => {
    const { getByRole } = renderWithTheme(
      <Ray accessibilityLabel="Ray is searching" state="searching" />,
    );
    const ray = getByRole('img');
    expect(ray).toHaveAttribute('aria-label', 'Ray is searching');
    expect(ray).not.toHaveAttribute('aria-hidden');
  });

  it('should hide his label from assistive tech while he is not visible', () => {
    const { getByTestId, queryByRole } = renderWithTheme(
      <Ray testID="ray-test" accessibilityLabel="Ray is searching" isVisible={false} />,
    );
    expect(queryByRole('img')).not.toBeInTheDocument();
    expect(getByTestId('ray-test')).toHaveAttribute('aria-hidden', 'true');
  });

  it('should remove his box while hidden with shouldUnmountWhenHidden, and lay it out again when shown', () => {
    const Row = (): React.ReactElement => {
      const [isVisible, setIsVisible] = React.useState(true);
      return (
        <>
          <Ray testID="ray-test" shouldUnmountWhenHidden isVisible={isVisible} />
          <button onClick={() => setIsVisible((v) => !v)}>toggle</button>
        </>
      );
    };
    const { queryByTestId, getByRole } = renderWithTheme(<Row />);
    expect(queryByTestId('ray-test')).toBeInTheDocument();
    fireEvent.click(getByRole('button'));
    expect(queryByTestId('ray-test')).not.toBeInTheDocument();
    fireEvent.click(getByRole('button'));
    expect(queryByTestId('ray-test')).toBeInTheDocument();
  });

  it('should keep his box while hidden without shouldUnmountWhenHidden', () => {
    const { getByTestId } = renderWithTheme(<Ray testID="ray-test" isVisible={false} />);
    expect(getByTestId('ray-test')).toBeInTheDocument();
  });

  it('should lay out his box at the size his engine works out (without loading it)', () => {
    (['small', 'medium'] as const).forEach((size) =>
      expect(RAY_BOX[size]).toEqual(rayBoxSize(size)),
    );
  });

  it('should take the ref an app makes for its text field (React 18 and 19 types)', () => {
    const ChatBox = (): React.ReactElement => {
      const textareaRef = React.useRef<HTMLTextAreaElement>(null);
      const inputRef = React.useRef<HTMLInputElement | null>(null);
      return (
        <>
          <Ray testID="ray-textarea" watchedInputRef={textareaRef} />
          <Ray testID="ray-input" watchedInputRef={inputRef} />
          <textarea ref={textareaRef} />
          <input ref={inputRef} />
        </>
      );
    };
    const { getByTestId } = renderWithTheme(<ChatBox />);
    expect(getByTestId('ray-textarea')).toBeInTheDocument();
    expect(getByTestId('ray-input')).toBeInTheDocument();
  });

  it('should pass data-analytics attributes to his box', () => {
    const { getByTestId } = renderWithTheme(
      <Ray testID="ray-test" data-analytics-section="chat" data-analytics-action="ray" />,
    );
    expect(getByTestId('ray-test')).toHaveAttribute('data-analytics-section', 'chat');
    expect(getByTestId('ray-test')).toHaveAttribute('data-analytics-action', 'ray');
  });

  it('should render without a canvas to draw on (jsdom) for every state', () => {
    const states = ['idle', 'searching', 'calling', 'writing', 'working'] as const;
    states.forEach((state) => {
      const { getByTestId, unmount } = renderWithTheme(
        <Ray testID={`ray-${state}`} state={state} isVisible={state !== 'working'} />,
      );
      expect(getByTestId(`ray-${state}`)).toBeInTheDocument();
      unmount();
    });
  });
});
