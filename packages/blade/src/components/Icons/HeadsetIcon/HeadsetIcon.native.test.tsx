import HeadsetIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<HeadsetIcon />', () => {
  it('should render HeadsetIcon', () => {
    const renderTree = renderWithTheme(
      <HeadsetIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
