import PhoneCallIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<PhoneCallIcon />', () => {
  it('should render PhoneCallIcon', () => {
    const renderTree = renderWithTheme(
      <PhoneCallIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
