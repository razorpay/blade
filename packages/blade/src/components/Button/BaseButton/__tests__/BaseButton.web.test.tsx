/* eslint-disable @typescript-eslint/ban-ts-comment */
import { fireEvent } from '@testing-library/react';
import userEvents from '@testing-library/user-event';
import React from 'react';
import type { BaseButtonProps } from '../BaseButton';
import BaseButton, { getBackgroundColorToken, getBoxShadowToken } from '../BaseButton';
import assertAccessible from '~utils/testing/assertAccessible.web';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { CloseIcon, CreditCardIcon } from '~components/Icons';

const variants: BaseButtonProps['variant'][] = ['primary', 'secondary', 'tertiary'];
const colors: BaseButtonProps['color'][] = [
  'primary',
  'white',
  'positive',
  'negative',
  'notice',
  'information',
  'neutral',
];

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<BaseButton />', () => {
  it('should render button with default properties', () => {
    const buttonText = 'Pay Now';
    const { container, getByText, getByRole } = renderWithTheme(
      <BaseButton>{buttonText}</BaseButton>,
    );
    expect(container).toMatchSnapshot();
    expect(getByRole('button')).toBeInTheDocument();
    expect(getByText('Pay Now')).toBeInTheDocument();
  });

  it('should throw an error when there is no icon or text passed to the button', () => {
    try {
      // @ts-expect-error testing failure case when there is no icon or text passed
      renderWithTheme(<BaseButton />);
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual(
          `[Blade: BaseButton]: At least one of icon or text is required to render a button.`,
        );
      }
    }
  });

  it('should render xsmall size button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(<BaseButton size="xsmall">{buttonText}</BaseButton>);
    expect(container).toMatchSnapshot();
  });

  it('should render small size button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(<BaseButton size="small">{buttonText}</BaseButton>);
    expect(container).toMatchSnapshot();
  });

  it('should render medium size button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(<BaseButton size="medium">{buttonText}</BaseButton>);
    expect(container).toMatchSnapshot();
  });

  it('should render large size button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(<BaseButton size="large">{buttonText}</BaseButton>);
    expect(container).toMatchSnapshot();
  });

  it('should render button with icon without text', () => {
    const { container } = renderWithTheme(<BaseButton icon={CreditCardIcon} />);
    expect(container).toMatchSnapshot();
  });

  it('should render button with icon with default iconPosition', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <BaseButton icon={CreditCardIcon}>{buttonText}</BaseButton>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render button with icon with left iconPosition', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <BaseButton iconPosition="left" icon={CreditCardIcon}>
        {buttonText}
      </BaseButton>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render button with icon with right iconPosition', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <BaseButton iconPosition="right" icon={CreditCardIcon}>
        {buttonText}
      </BaseButton>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render button with full width', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(<BaseButton isFullWidth={true}>{buttonText}</BaseButton>);
    expect(container).toMatchSnapshot();
  });

  it('should render disabled button', () => {
    const buttonText = 'Pay Now';
    const { container, getByRole } = renderWithTheme(
      <BaseButton isDisabled={true}>{buttonText}</BaseButton>,
    );
    expect(container).toMatchSnapshot();
    expect(getByRole('button')).toBeDisabled();
  });

  it('should render button of type "submit"', () => {
    const buttonText = 'Pay Now';
    const { getByRole } = renderWithTheme(<BaseButton type="submit">{buttonText}</BaseButton>);
    expect(getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('should render button of type "reset"', () => {
    const buttonText = 'Pay Now';
    const { getByRole } = renderWithTheme(<BaseButton type="reset">{buttonText}</BaseButton>);
    expect(getByRole('button')).toHaveAttribute('type', 'reset');
  });

  it('should call function on click', () => {
    const buttonText = 'Pay Now';
    const onClick = jest.fn();
    const { getByRole } = renderWithTheme(<BaseButton onClick={onClick}>{buttonText}</BaseButton>);
    const button = getByRole('button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should call function on click of button with event callback', () => {
    const buttonText = 'Pay Now';
    const onClick = jest.fn();
    const { getByRole } = renderWithTheme(<BaseButton onClick={onClick}>{buttonText}</BaseButton>);
    const button = getByRole('button');
    fireEvent(
      button,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        screenX: 20,
        screenY: 20,
      }),
    );
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toBeCalledWith(
      expect.objectContaining({
        bubbles: true,
        cancelable: true,
        screenX: 20,
        screenY: 20,
      }),
    );
  });

  colors.forEach((color) => {
    variants.forEach((variant) => {
      // We support only white and default color for tertiary variant
      if (variant === 'tertiary' && color !== 'white' && color !== 'primary') return;

      it(`should render ${color} color ${variant} button`, () => {
        const buttonText = 'Pay Now';
        const { container } = renderWithTheme(
          <BaseButton color={color} variant={variant}>
            {buttonText}
          </BaseButton>,
        );
        expect(container).toMatchSnapshot();
      });

      it(`should render disabled ${color} color ${variant} button`, () => {
        const buttonText = 'Pay Now';
        const { container } = renderWithTheme(
          <BaseButton color={color} variant={variant} isDisabled={true}>
            {buttonText}
          </BaseButton>,
        );
        expect(container).toMatchSnapshot();
      });
    });
  });

  it('should throw error if tertiary variant is passed with positive color', () => {
    const buttonText = 'Pay Now';
    expect(() =>
      renderWithTheme(
        <BaseButton variant="tertiary" color="positive">
          {buttonText}
        </BaseButton>,
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"[Blade: BaseButton]: Tertiary variant can only be used with color: "primary" or "white" or "transparent" but received "positive""`,
    );
  });

  it('should use ghost tokens for tertiary primary button', () => {
    expect(
      getBackgroundColorToken({ variant: 'tertiary', color: 'primary', state: 'default' }),
    ).toBe('transparent');
    expect(getBackgroundColorToken({ variant: 'tertiary', color: 'primary', state: 'hover' })).toBe(
      'interactive.background.gray.faded',
    );
    expect(
      getBackgroundColorToken({ variant: 'tertiary', color: 'primary', state: 'active' }),
    ).toBe('interactive.background.gray.fadedHighlighted');
    expect(getBoxShadowToken({ variant: 'tertiary', color: 'primary', state: 'default' })).toEqual(
      [],
    );
    expect(getBoxShadowToken({ variant: 'tertiary', color: 'primary', state: 'hover' })).toEqual(
      [],
    );
  });

  it('should use ghost tokens for tertiary white button', () => {
    expect(getBackgroundColorToken({ variant: 'tertiary', color: 'white', state: 'default' })).toBe(
      'transparent',
    );
    expect(getBackgroundColorToken({ variant: 'tertiary', color: 'white', state: 'hover' })).toBe(
      'interactive.background.staticWhite.faded',
    );
    expect(getBackgroundColorToken({ variant: 'tertiary', color: 'white', state: 'active' })).toBe(
      'interactive.background.staticWhite.fadedHighlighted',
    );
    expect(getBoxShadowToken({ variant: 'tertiary', color: 'white', state: 'default' })).toEqual(
      [],
    );
    expect(getBoxShadowToken({ variant: 'tertiary', color: 'white', state: 'hover' })).toEqual([]);
  });

  it('should keep tertiary primary and white layout spacing same as primary button', () => {
    const { getAllByRole } = renderWithTheme(
      <>
        <BaseButton icon={CreditCardIcon}>Primary</BaseButton>
        <BaseButton variant="tertiary" icon={CreditCardIcon}>
          Tertiary Primary
        </BaseButton>
        <BaseButton color="white" icon={CreditCardIcon}>
          White
        </BaseButton>
        <BaseButton variant="tertiary" color="white" icon={CreditCardIcon}>
          Tertiary White
        </BaseButton>
      </>,
    );

    const [primaryButton, tertiaryButton, whiteButton, tertiaryWhiteButton] = getAllByRole(
      'button',
    );
    const getLayoutStyles = (button: HTMLElement): Record<string, string> => {
      const styles = getComputedStyle(button);
      return {
        minHeight: styles.minHeight,
        paddingTop: styles.paddingTop,
        paddingBottom: styles.paddingBottom,
        paddingLeft: styles.paddingLeft,
        paddingRight: styles.paddingRight,
        justifyContent: styles.justifyContent,
        alignItems: styles.alignItems,
      };
    };

    expect(getLayoutStyles(tertiaryButton)).toEqual(getLayoutStyles(primaryButton));
    expect(getLayoutStyles(tertiaryWhiteButton)).toEqual(getLayoutStyles(whiteButton));

    const expectedMediumLayout = {
      minHeight: '36px',
      paddingTop: '0px',
      paddingBottom: '0px',
      paddingLeft: '12px',
      paddingRight: '12px',
      justifyContent: 'center',
      alignItems: 'center',
    };
    expect(getLayoutStyles(tertiaryButton)).toEqual(expectedMediumLayout);
    expect(getLayoutStyles(tertiaryWhiteButton)).toEqual(expectedMediumLayout);
  });

  it('should have accessibilityLabel', () => {
    const buttonText = 'Pay Now';
    const { getByRole } = renderWithTheme(
      <BaseButton accessibilityProps={{ label: 'Close' }} icon={CloseIcon}>
        {buttonText}
      </BaseButton>,
    );

    expect(getByRole('button')).toHaveAccessibleName('Close');
  });

  it('should announce button loading accessibilityLabel', async () => {
    const user = userEvents.setup();

    const ButtonLoading = (): React.ReactElement => {
      const [loading, setLoading] = React.useState(false);
      return (
        <>
          <BaseButton onClick={(): void => setLoading(!loading)}>Toggle loading</BaseButton>
          <BaseButton isLoading={loading}>Pay Now</BaseButton>
        </>
      );
    };

    const { getByText, container } = renderWithTheme(<ButtonLoading />);
    const loadingButton = getByText(/toggle loading/i);

    await user.click(loadingButton);
    expect(getByText(/Started loading/i)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
    await user.click(loadingButton);
    expect(getByText(/Stopped loading/i)).toBeInTheDocument();
  });

  it('should not have accessibility violations', async () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <BaseButton color="information" variant="primary" isDisabled={true}>
        {buttonText}
      </BaseButton>,
    );
    await assertAccessible(container);
  });
  it('should support passing data-analytics attribute', () => {
    const buttonText = 'Pay Now';
    const { getByRole } = renderWithTheme(
      <BaseButton data-analytics-name="pay-now" onClick={jest.fn()}>
        {buttonText}
      </BaseButton>,
    );
    const button = getByRole('button');
    expect(button).toHaveAttribute('data-analytics-name', 'pay-now');
  });
});
