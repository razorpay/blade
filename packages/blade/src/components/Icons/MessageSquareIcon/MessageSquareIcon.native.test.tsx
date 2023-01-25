import MessageSquareIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<MessageSquareIcon />', () => {
  it('should render MessageSquareIcon', () => {
    const renderTree = renderWithTheme(
      <MessageSquareIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
