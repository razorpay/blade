import renderWithSSR from '~utils/testing/renderWithSSR.web';

import { BaseSpinner } from '../BaseSpinner';

describe('<BaseSpinner />', () => {
  it('should render low contrast BaseSpinner with right label', () => {
    const { container, getByText } = renderWithSSR(
      <BaseSpinner accessibilityLabel="Loading" label="Loading" labelPosition="right" />,
    );
    expect(getByText('Loading')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
