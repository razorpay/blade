import ReticleIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ReticleIcon />', () => {
  it('should render ReticleIcon', () => {
    const renderTree = renderWithTheme(
      <ReticleIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
