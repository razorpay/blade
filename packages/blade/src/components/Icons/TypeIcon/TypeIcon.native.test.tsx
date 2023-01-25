import TypeIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<TypeIcon />', () => {
  it('should render TypeIcon', () => {
    const renderTree = renderWithTheme(
      <TypeIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
