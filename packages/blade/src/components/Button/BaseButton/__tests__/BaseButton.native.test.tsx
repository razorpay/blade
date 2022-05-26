/* eslint-disable @typescript-eslint/ban-ts-comment */
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
      // @ts-expect-error
      renderWithTheme(<BaseButton />);
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual(
          `[Blade: BaseButton]: Cannot render a BaseButton without an icon or text`,
        );
      }
    }
  });
  it('should render large size button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(<BaseButton size="large">{buttonText}</BaseButton>);
    expect(toJSON()).toMatchSnapshot();
  });
  it('should render medium size button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(<BaseButton size="medium">{buttonText}</BaseButton>);
    expect(toJSON()).toMatchSnapshot();
  });
  it('should render small size button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(<BaseButton size="small">{buttonText}</BaseButton>);
    expect(toJSON()).toMatchSnapshot();
  });
  it('should render xsmall size button', () => {
    const buttonText = 'Pay Now';
    const { toJSON } = renderWithTheme(<BaseButton size="xsmall">{buttonText}</BaseButton>);
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
});
