import BoldIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<BoldIcon />', () => {
  it('should render BoldIcon', () => {
    const renderTree = renderWithTheme(
      <BoldIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
