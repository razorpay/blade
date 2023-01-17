import OffersIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<OffersIcon />', () => {
  it('should render OffersIcon', () => {
    const { container } = renderWithTheme(
      <OffersIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
