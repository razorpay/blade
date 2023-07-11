import MinusIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<MinusIcon />', () => {
  it('should render MinusIcon', () => {
    const renderTree = renderWithTheme(
      <MinusIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
