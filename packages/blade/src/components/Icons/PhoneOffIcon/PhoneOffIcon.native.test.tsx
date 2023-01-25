import PhoneOffIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<PhoneOffIcon />', () => {
  it('should render PhoneOffIcon', () => {
    const renderTree = renderWithTheme(
      <PhoneOffIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
