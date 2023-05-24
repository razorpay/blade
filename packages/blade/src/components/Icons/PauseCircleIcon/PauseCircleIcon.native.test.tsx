import PauseCircleIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PauseCircleIcon />', () => {
  it('should render PauseCircleIcon', () => {
    const renderTree = renderWithTheme(
      <PauseCircleIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
