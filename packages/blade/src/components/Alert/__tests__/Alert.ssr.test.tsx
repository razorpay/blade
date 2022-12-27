/* eslint-disable @typescript-eslint/no-empty-function */
import { Alert } from '../';
import renderWithSSR from '~src/_helpers/testing/renderWithSSR.web';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Alert />', () => {
  it('should render Alert on server', () => {
    const { container } = renderWithSSR(
      <Alert
        description="Currently you can only accept payments in international currencies using PayPal."
        intent="positive"
        actions={{
          primary: { text: 'Primary', onClick: () => {} },
          secondary: { text: 'Link', onClick: () => {} },
        }}
      />,
    );

    expect(container).toMatchSnapshot();
  });
});
