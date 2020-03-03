import React from 'react';
import { fireEvent, act } from '@testing-library/react-native';
import { renderWithTheme } from '../../../_helpers/testing';
import TextInput from '../index';

describe('Renders <TextInput /> outlined variant correctly', () => {
  it('snapshot testing with label', () => {
    const { container } = renderWithTheme(<TextInput label="Email" />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with filled TextInput', () => {
    const { container } = renderWithTheme(<TextInput label="Email">{'user@domain.com'}</TextInput>);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with prefix', () => {
    const { container } = renderWithTheme(<TextInput prefix="kg" />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with suffix', () => {
    const { container } = renderWithTheme(<TextInput suffix="kg" />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with prefix & suffix', () => {
    const { container } = renderWithTheme(<TextInput suffix="kg" />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with iconLeft ', () => {
    const { container } = renderWithTheme(<TextInput iconLeft="info" />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with iconRight ', () => {
    const { container } = renderWithTheme(<TextInput iconRight="info" />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with iconLeft & iconRight ', () => {
    const { container } = renderWithTheme(<TextInput iconLeft="info" iconRight="info" />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with help text ', () => {
    const { container } = renderWithTheme(<TextInput helpText="You can enter your email here" />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with character count ', () => {
    const { container } = renderWithTheme(<TextInput showCharacterCount maxLength={10} />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with help text & character count ', () => {
    const { container } = renderWithTheme(
      <TextInput helpText="You can enter your email here" showCharacterCount maxLength={10} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with error ', () => {
    const { container } = renderWithTheme(
      <TextInput
        prefix="info"
        iconRight="info"
        label="Email"
        errorText="Some error has occurred"
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with disabled ', () => {
    const { container } = renderWithTheme(
      <TextInput
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
      <TextInput label="Email" testID="snap-test-text-input" />,
    );
    const textInput = getByTestId('snap-test-text-input');
    expect(container).toMatchSnapshot();
    jest.useFakeTimers(); // Uses fake timer to resolve setTimeout
    act(() => {
      fireEvent.focus(textInput);
      jest.runAllTimers(); // Resolve timers after focus events
    });
    expect(container).toMatchSnapshot();
  });
});

describe('Renders <TextInput /> filled variant correctly', () => {
  it('snapshot testing with label', () => {
    const { container } = renderWithTheme(<TextInput variant="filled" label="Email" />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing (filled TextInput)', () => {
    const { container } = renderWithTheme(
      <TextInput variant="filled" label="Email">
        {'user@domain.com'}
      </TextInput>,
    );
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with prefix (filled TextInput)', () => {
    const { container } = renderWithTheme(<TextInput variant="filled" prefix="kg" />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with suffix (filled TextInput)', () => {
    const { container } = renderWithTheme(<TextInput variant="filled" suffix="kg" />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with prefix & suffix (filled TextInput)', () => {
    const { container } = renderWithTheme(<TextInput variant="filled" suffix="kg" />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with iconLeft (filled TextInput)', () => {
    const { container } = renderWithTheme(<TextInput variant="filled" iconLeft="info" />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with iconRight (filled TextInput)', () => {
    const { container } = renderWithTheme(<TextInput variant="filled" iconRight="info" />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with iconLeft & iconRight (filled TextInput)', () => {
    const { container } = renderWithTheme(
      <TextInput variant="filled" iconLeft="info" iconRight="info" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with help text (filled TextInput)', () => {
    const { container } = renderWithTheme(
      <TextInput variant="filled" helpText="You can enter your email here" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with character count (filled TextInput)', () => {
    const { container } = renderWithTheme(
      <TextInput variant="filled" showCharacterCount maxLength={10} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with help text & character count (filled TextInput)', () => {
    const { container } = renderWithTheme(
      <TextInput
        variant="filled"
        helpText="You can enter your email here"
        showCharacterCount
        maxLength={10}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with error (filled TextInput)', () => {
    const { container } = renderWithTheme(
      <TextInput
        variant="filled"
        prefix="info"
        iconRight="info"
        label="Email"
        errorText="Some error has occurred"
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with disabled (filled TextInput)', () => {
    const { container } = renderWithTheme(
      <TextInput
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

  it('snapshot after focus (filled TextInput)', () => {
    const { getByTestId, container } = renderWithTheme(
      <TextInput label="Email" testID="snap-test-text-input" variant="filled" />,
    );
    const textInput = getByTestId('snap-test-text-input');
    expect(container).toMatchSnapshot();
    jest.useFakeTimers(); // Uses fake timer to resolve setTimeout
    act(() => {
      fireEvent.focus(textInput);
      jest.runAllTimers(); // Resolve timers after focus events
    });
    expect(container).toMatchSnapshot();
  });
});
