import StarIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<StarIcon />', () => {
  it('should render StarIcon', () => {
    const renderTree = renderWithTheme(
      <StarIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
