import React from 'react';
import { fireEvent, act } from '@testing-library/react-native';
import { renderWithTheme } from '../../../_helpers/testing';
import TextArea from '../index';

describe('Renders <TextArea /> outlined variant correctly', () => {
  it('snapshot testing with label', () => {
    const { container } = renderWithTheme(<TextArea label="Email" />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with filled TextArea', () => {
    const { container } = renderWithTheme(<TextArea label="Email">{'user@domain.com'}</TextArea>);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with prefix', () => {
    const { container } = renderWithTheme(<TextArea prefix="kg" />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with suffix', () => {
    const { container } = renderWithTheme(<TextArea suffix="kg" />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with prefix & suffix', () => {
    const { container } = renderWithTheme(<TextArea suffix="kg" />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with iconLeft ', () => {
    const { container } = renderWithTheme(<TextArea iconLeft="info" />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with iconRight ', () => {
    const { container } = renderWithTheme(<TextArea iconRight="info" />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with iconLeft & iconRight ', () => {
    const { container } = renderWithTheme(<TextArea iconLeft="info" iconRight="info" />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with help text ', () => {
    const { container } = renderWithTheme(<TextArea helpText="You can enter your email here" />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with character count ', () => {
    const { container } = renderWithTheme(<TextArea showCharacterCount maxLength={10} />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with help text & character count ', () => {
    const { container } = renderWithTheme(
      <TextArea helpText="You can enter your email here" showCharacterCount maxLength={10} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with error ', () => {
    const { container } = renderWithTheme(
      <TextArea prefix="info" iconRight="info" label="Email" errorText="Some error has occurred" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with disabled ', () => {
    const { container } = renderWithTheme(
      <TextArea
        prefix="info"
        iconRight="info"
        label="Email"
        helpText="You can enter your email here"
        disabled={true}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('snapshot after focus', () => {
    const { getByTestId, container } = renderWithTheme(
      <TextArea label="Email" testID="snap-test-text-area" />,
    );
    const textArea = getByTestId('snap-test-text-area');
    expect(container).toMatchSnapshot();
    jest.useFakeTimers(); // Uses fake timer to resolve setTimeout
    act(() => {
      fireEvent.focus(textArea);
      jest.runAllTimers(); // Resolve timers after focus events
    });
    expect(container).toMatchSnapshot();
  });
});

describe('Renders <TextArea /> filled variant correctly', () => {
  it('snapshot testing with label', () => {
    const { container } = renderWithTheme(<TextArea variant="filled" label="Email" />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing (filled TextArea)', () => {
    const { container } = renderWithTheme(
      <TextArea variant="filled" label="Email">
        {'user@domain.com'}
      </TextArea>,
    );
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with prefix (filled TextArea)', () => {
    const { container } = renderWithTheme(<TextArea variant="filled" prefix="kg" />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with suffix (filled TextArea)', () => {
    const { container } = renderWithTheme(<TextArea variant="filled" suffix="kg" />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with prefix & suffix (filled TextArea)', () => {
    const { container } = renderWithTheme(<TextArea variant="filled" suffix="kg" />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with iconLeft (filled TextArea)', () => {
    const { container } = renderWithTheme(<TextArea variant="filled" iconLeft="info" />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with iconRight (filled TextArea)', () => {
    const { container } = renderWithTheme(<TextArea variant="filled" iconRight="info" />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with iconLeft & iconRight (filled TextArea)', () => {
    const { container } = renderWithTheme(
      <TextArea variant="filled" iconLeft="info" iconRight="info" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with help text (filled TextArea)', () => {
    const { container } = renderWithTheme(
      <TextArea variant="filled" helpText="You can enter your email here" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with character count (filled TextArea)', () => {
    const { container } = renderWithTheme(
      <TextArea variant="filled" showCharacterCount maxLength={10} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with help text & character count (filled TextArea)', () => {
    const { container } = renderWithTheme(
      <TextArea
        variant="filled"
        helpText="You can enter your email here"
        showCharacterCount
        maxLength={10}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with error (filled TextArea)', () => {
    const { container } = renderWithTheme(
      <TextArea
        variant="filled"
        prefix="info"
        iconRight="info"
        label="Email"
        errorText="Some error has occurred"
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with disabled (filled TextArea)', () => {
    const { container } = renderWithTheme(
      <TextArea
        variant="filled"
        prefix="info"
        iconRight="info"
        label="Email"
        helpText="You can enter your email here"
        disabled={true}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('snapshot after focus (filled TextArea)', () => {
    const { getByTestId, container } = renderWithTheme(
      <TextArea label="Email" testID="snap-test-text-area" variant="filled" />,
    );
    const textArea = getByTestId('snap-test-text-area');
    expect(container).toMatchSnapshot();
    jest.useFakeTimers(); // Uses fake timer to resolve setTimeout
    act(() => {
      fireEvent.focus(textArea);
      jest.runAllTimers(); // Resolve timers after focus events
    });
    expect(container).toMatchSnapshot();
  });
});
