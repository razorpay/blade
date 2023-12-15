import PhoneIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PhoneIcon />', () => {
  it('should render PhoneIcon', () => {
    const renderTree = renderWithTheme(
      <PhoneIcon color="feedback.icon.gray.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
