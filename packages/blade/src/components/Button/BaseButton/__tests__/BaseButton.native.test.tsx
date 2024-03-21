/* eslint-disable @typescript-eslint/ban-ts-comment */
import { fireEvent } from '@testing-library/react-native';
import type { BaseButtonProps } from '../BaseButton';
import BaseButton from '../BaseButton';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { CloseIcon, CreditCardIcon } from '~components/Icons';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

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

describe('<BaseButton />', () => {
  it('should render button with default properties', () => {
    const buttonText = 'Pay Now';
    const { toJSON, getByText } = renderWithTheme(<BaseButton>{buttonText}</BaseButton>);
    expect(toJSON()).toMatchSnapshot();
    expect(getByText('Pay Now')).toBeTruthy();
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
    const { toJSON } = renderWithTheme(<BaseButton size="xsmall">{buttonText}</BaseButton>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render small size button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(<BaseButton size="small">{buttonText}</BaseButton>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render medium size button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(<BaseButton size="medium">{buttonText}</BaseButton>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render large size button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(<BaseButton size="large">{buttonText}</BaseButton>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render button with icon without text', () => {
    const { toJSON } = renderWithTheme(<BaseButton icon={CreditCardIcon} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render button with icon with default iconPosition', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(<BaseButton icon={CreditCardIcon}>{buttonText}</BaseButton>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render button with icon with left iconPosition', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(
      <BaseButton iconPosition="left" icon={CreditCardIcon}>
        {buttonText}
      </BaseButton>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render button with icon with right iconPosition', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(
      <BaseButton iconPosition="right" icon={CreditCardIcon}>
        {buttonText}
      </BaseButton>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render button with full width', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(<BaseButton isFullWidth={true}>{buttonText}</BaseButton>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render disabled button', () => {
    const buttonText = 'Pay Now';
    const onClick = jest.fn();
    const { toJSON, getByA11yState } = renderWithTheme(
      <BaseButton isDisabled={true} onClick={onClick}>
        {buttonText}
      </BaseButton>,
    );
    const button = getByA11yState({ disabled: true });
    expect(button.findByProps({ accessibilityRole: 'button' })).toBeTruthy();
    fireEvent.press(button);
    expect(onClick).toHaveBeenCalledTimes(0);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render loading button', () => {
    const buttonText = 'Pay Now';
    const onClick = jest.fn();
    const { toJSON, getByText } = renderWithTheme(
      <BaseButton isLoading={true} onClick={onClick}>
        {buttonText}
      </BaseButton>,
    );
    const button = getByText(buttonText);
    fireEvent.press(button);
    expect(onClick).toHaveBeenCalledTimes(0);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should call function on click', () => {
    const buttonText = 'Pay Now';
    const onClick = jest.fn();
    const { getByText } = renderWithTheme(<BaseButton onClick={onClick}>{buttonText}</BaseButton>);
    const button = getByText(buttonText);
    fireEvent.press(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should call function on click of button variant of link with event callback ', () => {
    const buttonText = 'Pay Now';
    const onClick = jest.fn();
    const { getByRole } = renderWithTheme(<BaseButton onClick={onClick}>{buttonText}</BaseButton>);
    const button = getByRole('button');
    const eventData = {
      nativeEvent: {
        locationX: 8,
        locationY: 4.5,
        pageX: 24,
        pageY: 49.5,
      },
    };

    fireEvent.press(button, eventData);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(eventData);
  });

  colors.forEach((color) => {
    variants.forEach((variant) => {
      // We support only white and default color for tertiary variant
      if (variant === 'tertiary' && color !== 'white' && color !== 'primary') return;

      it(`should render ${color} color ${variant} button`, () => {
        const buttonText = 'Pay Now';
        const { toJSON } = renderWithTheme(
          <BaseButton color={color} variant={variant}>
            {buttonText}
          </BaseButton>,
        );
        expect(toJSON()).toMatchSnapshot();
      });

      it(`should render disabled ${color} color ${variant} button`, () => {
        const buttonText = 'Pay Now';
        const { toJSON } = renderWithTheme(
          <BaseButton color={color} variant={variant} isDisabled={true}>
            {buttonText}
          </BaseButton>,
        );
        expect(toJSON()).toMatchSnapshot();
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
      `"[Blade: BaseButton]: Tertiary variant can only be used with color: "primary" or "white" but received "positive""`,
    );
  });

  it('should have accessibilityLabel', () => {
    const { getByRole } = renderWithTheme(
      <BaseButton accessibilityProps={{ label: 'Close' }} icon={CloseIcon}>
        Pay Now
      </BaseButton>,
    );
    const button = getByRole('button');
    expect(button.findByProps({ accessibilityLabel: 'Close' })).toBeTruthy();
  });
});
