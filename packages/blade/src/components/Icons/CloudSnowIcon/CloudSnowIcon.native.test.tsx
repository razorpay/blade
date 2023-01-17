import CloudSnowIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<CloudSnowIcon />', () => {
  it('should render CloudSnowIcon', () => {
    const renderTree = renderWithTheme(
      <CloudSnowIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
