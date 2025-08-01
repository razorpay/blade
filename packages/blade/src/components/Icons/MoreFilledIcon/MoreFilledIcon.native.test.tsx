import MoreFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<MoreFilledIcon />', () => {
  it('should render MoreFilledIcon', () => {
    const renderTree = renderWithTheme(
      <MoreFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
