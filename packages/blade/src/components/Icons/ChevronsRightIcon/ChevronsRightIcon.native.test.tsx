import ChevronsRightIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<ChevronsRightIcon />', () => {
  it('should render ChevronsRightIcon', () => {
    const renderTree = renderWithTheme(
      <ChevronsRightIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
