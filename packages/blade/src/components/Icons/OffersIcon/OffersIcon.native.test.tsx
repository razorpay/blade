import OffersIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<OffersIcon />', () => {
  it('should render OffersIcon', () => {
    const renderTree = renderWithTheme(
      <OffersIcon color="feedback.icon.gray.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
