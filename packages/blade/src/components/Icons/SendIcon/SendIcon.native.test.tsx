import SendIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<SendIcon />', () => {
  it('should render SendIcon', () => {
    const renderTree = renderWithTheme(
      <SendIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
