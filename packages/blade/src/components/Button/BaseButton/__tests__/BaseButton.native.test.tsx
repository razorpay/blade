/* eslint-disable @typescript-eslint/ban-ts-comment */
import { fireEvent } from '@testing-library/react-native';
import renderWithTheme from '../../../../_helpers/testing/renderWithTheme.native';
import { CreditCardIcon } from '../../../Icons';
import BaseButton from '../BaseButton';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

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
    const { toJSON, getByText } = renderWithTheme(
      <BaseButton isDisabled={true} onClick={onClick}>
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

  it('should render secondary variant button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(<BaseButton variant="secondary">{buttonText}</BaseButton>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render disabled secondary variant button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(
      <BaseButton variant="secondary" isDisabled={true}>
        {buttonText}
      </BaseButton>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render tertiary variant button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(<BaseButton variant="tertiary">{buttonText}</BaseButton>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render disabled tertiary variant button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(
      <BaseButton variant="tertiary" isDisabled={true}>
        {buttonText}
      </BaseButton>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render positive intent low contrast button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(
      <BaseButton intent="positive" contrast="low">
        {buttonText}
      </BaseButton>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('should render disabled positive intent low contrast button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(
      <BaseButton intent="positive" contrast="low" isDisabled={true}>
        {buttonText}
      </BaseButton>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render negative intent low contrast button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(
      <BaseButton intent="negative" contrast="low">
        {buttonText}
      </BaseButton>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('should render disabled negative intent low contrast button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(
      <BaseButton intent="negative" contrast="low" isDisabled={true}>
        {buttonText}
      </BaseButton>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render neutral intent low contrast button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(
      <BaseButton intent="neutral" contrast="low">
        {buttonText}
      </BaseButton>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('should render disabled neutral intent low contrast button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(
      <BaseButton intent="neutral" contrast="low" isDisabled={true}>
        {buttonText}
      </BaseButton>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render notice intent low contrast button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(
      <BaseButton intent="notice" contrast="low">
        {buttonText}
      </BaseButton>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('should render disabled notice intent low contrast button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(
      <BaseButton intent="notice" contrast="low" isDisabled={true}>
        {buttonText}
      </BaseButton>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render information intent low contrast button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(
      <BaseButton intent="information" contrast="low">
        {buttonText}
      </BaseButton>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('should render disabled information intent low contrast button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(
      <BaseButton intent="information" contrast="low" isDisabled={true}>
        {buttonText}
      </BaseButton>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render positive intent high contrast button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(
      <BaseButton intent="positive" contrast="high">
        {buttonText}
      </BaseButton>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('should render disabled positive intent high contrast button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(
      <BaseButton intent="positive" contrast="high" isDisabled={true}>
        {buttonText}
      </BaseButton>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render negative intent high contrast button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(
      <BaseButton intent="negative" contrast="high">
        {buttonText}
      </BaseButton>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('should render disabled negative intent high contrast button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(
      <BaseButton intent="negative" contrast="high" isDisabled={true}>
        {buttonText}
      </BaseButton>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render neutral intent high contrast button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(
      <BaseButton intent="neutral" contrast="high">
        {buttonText}
      </BaseButton>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('should render disabled neutral intent high contrast button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(
      <BaseButton intent="neutral" contrast="high" isDisabled={true}>
        {buttonText}
      </BaseButton>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render notice intent high contrast button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(
      <BaseButton intent="notice" contrast="high">
        {buttonText}
      </BaseButton>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('should render disabled notice intent high contrast button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(
      <BaseButton intent="notice" contrast="high" isDisabled={true}>
        {buttonText}
      </BaseButton>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render information intent high contrast button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(
      <BaseButton intent="information" contrast="high">
        {buttonText}
      </BaseButton>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('should render disabled information intent high contrast button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(
      <BaseButton intent="information" contrast="high" isDisabled={true}>
        {buttonText}
      </BaseButton>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
