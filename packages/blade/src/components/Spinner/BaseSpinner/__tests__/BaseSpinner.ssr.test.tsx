import { BaseSpinner } from '../BaseSpinner';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<BaseSpinner />', () => {
  it('should render low contrast BaseSpinner with right label', () => {
    const { container, getByText } = renderWithSSR(
      <BaseSpinner
        accessibilityLabel="Loading"
        contrast="low"
        label="Loading"
        labelPosition="right"
      />,
    );
    expect(getByText('Loading')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
