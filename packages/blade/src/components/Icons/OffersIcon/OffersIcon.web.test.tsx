import OffersIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<OffersIcon />', () => {
  it('should render OffersIcon', () => {
    const { container } = renderWithTheme(
      <OffersIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
