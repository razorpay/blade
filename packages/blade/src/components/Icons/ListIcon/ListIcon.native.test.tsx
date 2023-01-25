import ListIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<ListIcon />', () => {
  it('should render ListIcon', () => {
    const renderTree = renderWithTheme(
      <ListIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
