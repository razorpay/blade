import userEvent from '@testing-library/user-event';

import { Alert } from '..';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';
import assertAccessible from '~src/_helpers/testing/assertAccessible.web';

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

  it('should render negative intent and borderless', () => {
    const { container } = renderWithTheme(
      <Alert
        description="Currently you can only accept payments in international currencies using PayPal."
        intent="negative"
        isBorderless
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
});
