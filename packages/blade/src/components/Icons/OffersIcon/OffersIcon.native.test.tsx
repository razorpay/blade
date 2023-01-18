import OffersIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<OffersIcon />', () => {
  it('should render OffersIcon', () => {
    const renderTree = renderWithTheme(
      <OffersIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
