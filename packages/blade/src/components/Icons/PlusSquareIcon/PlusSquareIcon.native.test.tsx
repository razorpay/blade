import PlusSquareIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<PlusSquareIcon />', () => {
  it('should render PlusSquareIcon', () => {
    const renderTree = renderWithTheme(
      <PlusSquareIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
