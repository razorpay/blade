import TargetIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<TargetIcon />', () => {
  it('should render TargetIcon', () => {
    const renderTree = renderWithTheme(
      <TargetIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
