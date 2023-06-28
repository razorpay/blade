import userEvent from '@testing-library/user-event';

import { Alert } from '..';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';

describe('<Alert />', () => {
  it('should render', () => {
    const { container } = renderWithTheme(
      <Alert description="Currently you can only accept payments in international currencies using PayPal." />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render positive intent and full width', () => {
    const { container } = renderWithTheme(
      <Alert
        description="Currently you can only accept payments in international currencies using PayPal."
        intent="positive"
        isFullWidth
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should handle onClick on actions', async () => {
    const user = userEvent.setup();
    const onClickPrimary = jest.fn();
    const onClickSecondary = jest.fn();
    const { getByText } = renderWithTheme(
      <Alert
        description="Currently you can only accept payments in international currencies using PayPal."
        actions={{
          primary: { text: 'Primary', onClick: onClickPrimary },
          secondary: { text: 'Link', onClick: onClickSecondary },
        }}
      />,
    );
    const primaryAction = getByText('Primary');
    const secondaryAction = getByText('Link');
    await user.click(primaryAction);
    await user.click(secondaryAction);

    expect(onClickPrimary).toHaveBeenCalledTimes(1);
    expect(onClickSecondary).toHaveBeenCalledTimes(1);
  });

  it('should dismiss on clicking close button', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole, queryByRole } = renderWithTheme(
      <Alert
        description="Currently you can only accept payments in international currencies using PayPal."
        intent="notice"
      />,
    );
    const closeButton = getByLabelText('Dismiss alert');

    const alertBeforeDismiss = getByRole('alert');
    expect(alertBeforeDismiss).toBeVisible();

    await user.click(closeButton);

    // getByRole throws error if element is not found so we can't use it after alert has been dismissed
    const alertAfterDismiss = queryByRole('alert');

    expect(alertAfterDismiss).not.toBeInTheDocument();
  });

  it('should pass a11y for alert role', async () => {
    const { getByRole } = renderWithTheme(
      <Alert
        description="Currently you can only accept payments in international currencies using PayPal."
        intent="notice"
      />,
    );
    const alert = getByRole('alert');

    await assertAccessible(alert);
  });

  it('should pass a11y for status role', async () => {
    const { getByRole } = renderWithTheme(
      <Alert
        description="Currently you can only accept payments in international currencies using PayPal."
        intent="positive"
      />,
    );
    const alert = getByRole('status');

    await assertAccessible(alert);
  });

  it('should throw an error if secondary action is defined without primary action', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    const onClickSecondary = jest.fn();
    expect(() =>
      renderWithTheme(
        <Alert
          description="Currently you can only accept payments in international currencies using PayPal."
          // @ts-expect-error testing failure case when there is no primary action passed
          actions={{
            secondary: { text: 'Link', onClick: onClickSecondary },
          }}
        />,
      ),
    ).toThrow(`[Blade: Alert]: SecondaryAction is allowed only when PrimaryAction is defined.`);
    mockConsoleError.mockRestore();
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(<Alert description="Test" testID="alert-test" />);

    expect(getByTestId('alert-test')).toBeTruthy();
  });
});
