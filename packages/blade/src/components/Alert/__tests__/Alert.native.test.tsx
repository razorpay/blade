import { fireEvent } from '@testing-library/react-native';
import { Alert } from '..';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<Alert />', () => {
  it('should render', () => {
    const { toJSON } = renderWithTheme(
      <Alert description="Currently you can only accept payments in international currencies using PayPal." />,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render positive intent and full width', () => {
    const { toJSON } = renderWithTheme(
      <Alert
        description="Currently you can only accept payments in international currencies using PayPal."
        intent="positive"
        isFullWidth
      />,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should handle onClick on actions', () => {
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
    fireEvent.press(primaryAction);
    fireEvent.press(secondaryAction);

    expect(onClickPrimary).toHaveBeenCalledTimes(1);
    expect(onClickSecondary).toHaveBeenCalledTimes(1);
  });

  it('should dismiss on clicking close button', () => {
    const { getByLabelText, getByRole, queryByRole } = renderWithTheme(
      <Alert
        description="Currently you can only accept payments in international currencies using PayPal."
        intent="notice"
      />,
    );
    const closeButton = getByLabelText('Dismiss alert');

    const alertBeforeDismiss = getByRole('alert');

    /**
     * on native we don't have DOM helpers and utilities to assert appearance and disappearance (as in the corresponding web test)
     * so we assert on element's value from the queries instead
     */
    expect(alertBeforeDismiss).toBeTruthy();

    fireEvent.press(closeButton);

    // getByRole throws error if element is not found so we can't use it after alert has been dismissed
    const alertAfterDismiss = queryByRole('alert');

    // a null value is returned if the element isn't found
    expect(alertAfterDismiss).toBeFalsy();
  });

  it('should have a11y role', () => {
    const { getByRole } = renderWithTheme(
      <Alert
        description="Currently you can only accept payments in international currencies using PayPal."
        intent="negative"
      />,
    );
    const alert = getByRole('alert');

    expect(alert).toBeTruthy();
  });

  it('should throw an error if secondary action is defined without primary action', () => {
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
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(<Alert description="Test" testID="alert-test" />);

    expect(getByTestId('alert-test')).toBeTruthy();
  });
});
