import PhoneIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<PhoneIcon />', () => {
  it('should render PhoneIcon', () => {
    const renderTree = renderWithTheme(
      <PhoneIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
