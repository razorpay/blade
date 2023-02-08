import BaseBoxIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<BaseBoxIcon />', () => {
  it('should render BoxIcon', () => {
    const renderTree = renderWithTheme(
      <BaseBoxIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
