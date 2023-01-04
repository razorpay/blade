import PhoneIncomingIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<PhoneIncomingIcon />', () => {
  it('should render PhoneIncomingIcon', () => {
    const renderTree = renderWithTheme(
      <PhoneIncomingIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
