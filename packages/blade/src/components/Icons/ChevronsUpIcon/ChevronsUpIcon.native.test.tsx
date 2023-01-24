import ChevronsUpIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<ChevronsUpIcon />', () => {
  it('should render ChevronsUpIcon', () => {
    const renderTree = renderWithTheme(
      <ChevronsUpIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
