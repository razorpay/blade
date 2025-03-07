/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import userEvents from '@testing-library/user-event';
import React from 'react';
import { Switch } from '../Switch';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Button } from '~components/Button';
import assertAccessible from '~utils/testing/assertAccessible.web';

describe('<Switch />', () => {
  it('should render switch', () => {
    const name = 'Toggle Darkmode';
    const { container, getByRole } = renderWithTheme(<Switch accessibilityLabel={name} />);
    expect(container).toMatchSnapshot();
    expect(getByRole('switch')).toBeInTheDocument();
  });

  it('should set disabled state with isDisabled', () => {
    const name = 'Toggle Darkmode';
    const { container, getByRole } = renderWithTheme(
      <Switch accessibilityLabel={name} isDisabled />,
    );
    expect(container).toMatchSnapshot();
    expect(getByRole('switch', { name })).toBeDisabled();
  });

  test('user should be able to toggle state', async () => {
    const user = userEvents.setup();
    const name = 'Toggle Darkmode';
    const { getByRole } = renderWithTheme(<Switch accessibilityLabel={name} />);

    expect(getByRole('switch', { name })).not.toBeChecked();
    await user.click(getByRole('switch', { name }));
    expect(getByRole('switch', { name })).toBeChecked();
    await user.click(getByRole('switch', { name }));
    expect(getByRole('switch', { name })).not.toBeChecked();
  });

  test('user should be able to toggle checkbox with keyboard', async () => {
    const user = userEvents.setup();
    const name = 'Toggle darkmode';
    const { getByRole } = renderWithTheme(<Switch accessibilityLabel={name} />);

    expect(getByRole('switch', { name })).not.toBeChecked();
    await user.tab();
    expect(getByRole('switch', { name })).toHaveFocus();
    await user.keyboard('[Space]');
    expect(getByRole('switch', { name })).toBeChecked();
    await user.keyboard('[Space]');
    expect(getByRole('switch', { name })).not.toBeChecked();
  });

  it('should set defaultChecked', () => {
    const name = 'Toggle Darkmode';
    const { getByRole } = renderWithTheme(<Switch defaultChecked accessibilityLabel={name} />);

    expect(getByRole('switch', { name })).toBeChecked();
  });

  it('should support isChecked prop', async () => {
    const user = userEvents.setup();
    const name = 'Toggle Darkmode';
    const { getByRole } = renderWithTheme(<Switch isChecked accessibilityLabel={name} />);

    expect(getByRole('switch', { name })).toBeChecked();
    // should not toggle
    await user.click(getByRole('switch', { name }));
    expect(getByRole('switch', { name })).toBeChecked();
  });

  it('should support uncontrolled state', async () => {
    const user = userEvents.setup();
    const checkFn = jest.fn();
    const name = 'Toggle Darkmode';
    const { getByRole } = renderWithTheme(
      <Switch
        value="darkmode"
        name="darkmode-toggle"
        accessibilityLabel={name}
        defaultChecked={true}
        onChange={checkFn}
      />,
    );

    expect(getByRole('switch', { name })).toBeChecked();
    expect(checkFn).not.toBeCalled();
    await user.click(getByRole('switch', { name }));
    expect(getByRole('switch', { name })).not.toBeChecked();
    expect(checkFn).toBeCalledWith(
      expect.objectContaining({
        isChecked: false,
        value: 'darkmode',
      }),
    );
    expect(checkFn.mock.calls[0][0].event).not.toBeUndefined();
    await user.click(getByRole('switch', { name }));
    expect(getByRole('switch', { name })).toBeChecked();
    expect(checkFn).toBeCalledWith(
      expect.objectContaining({
        isChecked: true,
        value: 'darkmode',
      }),
    );
    expect(checkFn.mock.calls[0][0].event).not.toBeUndefined();
  });

  it('should support controlled state', async () => {
    const user = userEvents.setup();
    const name = 'Toggle Darkmode';
    const Example = () => {
      const [checked, setChecked] = React.useState(false);
      return (
        <>
          <Switch
            accessibilityLabel={name}
            isChecked={checked}
            onChange={({ isChecked }) => setChecked(isChecked)}
          />
          <p>{checked ? 'checked' : 'unchecked'}</p>
        </>
      );
    };
    const { getByRole, getByText } = renderWithTheme(<Example />);

    expect(getByText('unchecked')).toBeInTheDocument();
    await user.click(getByRole('switch', { name }));
    expect(getByText('checked')).toBeInTheDocument();
    await user.click(getByRole('switch', { name }));
    expect(getByText('unchecked')).toBeInTheDocument();
  });

  it(`should expose native element methods via ref`, async () => {
    const name = 'Accept';
    const focusButtonLabel = 'Focus';

    const Example = (): React.ReactElement => {
      const ref = React.useRef<HTMLInputElement>(null);

      return (
        <>
          <Switch ref={ref} accessibilityLabel={name} />
          <Button
            onClick={() => {
              ref.current?.focus();
            }}
          >
            {focusButtonLabel}
          </Button>
        </>
      );
    };
    const { getByRole } = renderWithTheme(<Example />);

    const input = getByRole('switch', { name });
    const button = getByRole('button', { name: focusButtonLabel });

    expect(input).not.toHaveFocus();
    expect(input).toHaveAttribute('type', 'checkbox');

    await userEvents.click(button);
    expect(input).toHaveFocus();
  });

  it('should accept testID', () => {
    const name = 'Toggle Darkmode';
    const { getByTestId } = renderWithTheme(
      <Switch testID="switch-test" accessibilityLabel={name} />,
    );
    expect(getByTestId('switch-test')).toBeTruthy();
  });

  it('should pass a11y', async () => {
    const name = 'Toggle Darkmode';
    const { getByRole } = renderWithTheme(
      <Switch testID="switch-test" accessibilityLabel={name} />,
    );
    await assertAccessible(getByRole('switch', { name }), {
      rules: {
        // axe doesn't like that we are setting aria-required=false to role=switch
        // This should not cause any a11y regression, so ignoring it because
        // in https://www.w3.org/TR/wai-aria-1.2/#switch it says that switch inherits checkbox's props
        // which also includes aria-required.
        'aria-allowed-attr': { enabled: false },
      },
    });
  });

  it('should support adding data-analytics attribute', () => {
    const name = 'Toggle Darkmode';
    const { container, getByTestId } = renderWithTheme(
      <Switch
        data-analytics-switch="darkmode-switch"
        testID="darkmode-switch"
        accessibilityLabel={name}
      />,
    );
    expect(container).toMatchSnapshot();
    expect(getByTestId('darkmode-switch')).toHaveAttribute(
      'data-analytics-switch',
      'darkmode-switch',
    );
  });
});
