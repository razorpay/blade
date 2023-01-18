import PhoneOutgoingIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<PhoneOutgoingIcon />', () => {
  it('should render PhoneOutgoingIcon', () => {
    const renderTree = renderWithTheme(
      <PhoneOutgoingIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
