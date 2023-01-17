import SlackIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<SlackIcon />', () => {
  it('should render SlackIcon', () => {
    const renderTree = renderWithTheme(
      <SlackIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
