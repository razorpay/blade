import CircleIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CircleIcon />', () => {
  it('should render CircleIcon', () => {
    const renderTree = renderWithTheme(
      <CircleIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
