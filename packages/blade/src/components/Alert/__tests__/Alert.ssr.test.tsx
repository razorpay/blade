/* eslint-disable @typescript-eslint/no-empty-function */
import renderWithSSR from '~utils/testing/renderWithSSR.web';

import { Alert } from '../';

describe('<Alert />', () => {
  it('should render Alert on server', () => {
    const { container } = renderWithSSR(
      <Alert
        description="Currently you can only accept payments in international currencies using PayPal."
        color="positive"
        actions={{
          primary: { text: 'Primary', onClick: () => {} },
          secondary: { text: 'Link', onClick: () => {} },
        }}
      />,
    );

    expect(container).toMatchSnapshot();
  });
});
