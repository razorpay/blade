import PhoneMissedIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PhoneMissedIcon />', () => {
  it('should render PhoneMissedIcon', () => {
    const renderTree = renderWithTheme(
      <PhoneMissedIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
