import RepeatIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<RepeatIcon />', () => {
  it('should render RepeatIcon', () => {
    const renderTree = renderWithTheme(
      <RepeatIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
