import HeartIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<HeartIcon />', () => {
  it('should render HeartIcon', () => {
    const renderTree = renderWithTheme(
      <HeartIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
