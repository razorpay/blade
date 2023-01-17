import BellOffIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<BellOffIcon />', () => {
  it('should render BellOffIcon', () => {
    const renderTree = renderWithTheme(
      <BellOffIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
