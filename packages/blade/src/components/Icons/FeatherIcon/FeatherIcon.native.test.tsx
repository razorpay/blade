import FeatherIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<FeatherIcon />', () => {
  it('should render FeatherIcon', () => {
    const renderTree = renderWithTheme(
      <FeatherIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
