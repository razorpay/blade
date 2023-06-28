import DiscIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<DiscIcon />', () => {
  it('should render DiscIcon', () => {
    const renderTree = renderWithTheme(
      <DiscIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
