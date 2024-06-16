import RadioIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<RadioIcon />', () => {
  it('should render RadioIcon', () => {
    const renderTree = renderWithTheme(
      <RadioIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
