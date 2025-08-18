import EngageFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<EngageFilledIcon />', () => {
  it('should render EngageFilledIcon', () => {
    const renderTree = renderWithTheme(
      <EngageFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
