import MinusSquareIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<MinusSquareIcon />', () => {
  it('should render MinusSquareIcon', () => {
    const renderTree = renderWithTheme(
      <MinusSquareIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
