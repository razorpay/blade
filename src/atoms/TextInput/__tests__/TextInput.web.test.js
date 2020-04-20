import React from 'react';
import { renderWithTheme } from '../../../_helpers/testing';
import TextInput from '../index';

describe('Renders <TextInput /> outlined variant correctly', () => {
  it('snapshot testing with label', () => {
    const { container } = renderWithTheme(<TextInput label="Email" />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with filled TextInput', () => {
    const { container } = renderWithTheme(<TextInput label="Email" value="user@domain.com" />);
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
    const { container } = renderWithTheme(<TextInput maxLength={10} />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with help text & character count ', () => {
    const { container } = renderWithTheme(
      <TextInput helpText="You can enter your email here" maxLength={10} />,
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

  it('snapshot testing with small width', () => {
    const { container } = renderWithTheme(<TextInput width="small" />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with auto width', () => {
    const { container } = renderWithTheme(<TextInput width="auto" />);
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
      <TextInput variant="filled" label="Email" value="user@domain.com" />,
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
    const { container } = renderWithTheme(<TextInput variant="filled" maxLength={10} />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with help text & character count (filled TextInput)', () => {
    const { container } = renderWithTheme(
      <TextInput variant="filled" helpText="You can enter your email here" maxLength={10} />,
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

  it('snapshot testing with small width (filled TextInput)', () => {
    const { container } = renderWithTheme(<TextInput variant="filled" width="small" />);
    expect(container).toMatchSnapshot();
  });

  it('snapshot testing with auto width (filled TextInput)', () => {
    const { container } = renderWithTheme(<TextInput variant="filled" width="auto" />);
    expect(container).toMatchSnapshot();
  });

  describe('type', () => {
    it('text', () => {
      const { container } = renderWithTheme(<TextInput type="text" value="Hello world" />);
      expect(container).toMatchSnapshot();
    });
    it('password', () => {
      const { container } = renderWithTheme(<TextInput type="password" value="Hello world" />);
      expect(container).toMatchSnapshot();
    });
    it('email', () => {
      const { container } = renderWithTheme(<TextInput type="password" value="Hello world" />);
      expect(container).toMatchSnapshot();
    });
    it('number', () => {
      const { container } = renderWithTheme(<TextInput type="password" value="Hello world" />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('autoCapitalize', () => {
    it('none', () => {
      const { container } = renderWithTheme(<TextInput autoCapitalize="none" />);
      expect(container).toMatchSnapshot();
    });
    it('words', () => {
      const { container } = renderWithTheme(<TextInput autoCapitalize="words" />);
      expect(container).toMatchSnapshot();
    });
    it('characters', () => {
      const { container } = renderWithTheme(<TextInput autoCapitalize="characters" />);
      expect(container).toMatchSnapshot();
    });
  });
});
