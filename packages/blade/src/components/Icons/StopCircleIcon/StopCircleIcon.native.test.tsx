import StopCircleIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<StopCircleIcon />', () => {
  it('should render StopCircleIcon', () => {
    const renderTree = renderWithTheme(
      <StopCircleIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
