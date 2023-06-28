import HashIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<HashIcon />', () => {
  it('should render HashIcon', () => {
    const renderTree = renderWithTheme(
      <HashIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
