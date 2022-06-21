import renderWithTheme from '../../../_helpers/testing/renderWithTheme.native';
import LoaderIcon from '.';

describe('<LoaderIcon />', () => {
  it('should render LoaderIcon', () => {
    const renderTree = renderWithTheme(
      <LoaderIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
