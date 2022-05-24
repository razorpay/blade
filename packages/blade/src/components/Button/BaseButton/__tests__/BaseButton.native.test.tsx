/* eslint-disable @typescript-eslint/ban-ts-comment */
import renderWithTheme from '../../../../_helpers/testing/renderWithTheme.native';
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
});
