import ChevronsDownIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<ChevronsDownIcon />', () => {
  it('should render ChevronsDownIcon', () => {
    const renderTree = renderWithTheme(
      <ChevronsDownIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
