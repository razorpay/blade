import InboxIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<InboxIcon />', () => {
  it('should render InboxIcon', () => {
    const renderTree = renderWithTheme(
      <InboxIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
