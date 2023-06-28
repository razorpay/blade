import ChevronsLeftIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ChevronsLeftIcon />', () => {
  it('should render ChevronsLeftIcon', () => {
    const renderTree = renderWithTheme(
      <ChevronsLeftIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
