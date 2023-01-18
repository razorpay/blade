import RewindIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<RewindIcon />', () => {
  it('should render RewindIcon', () => {
    const renderTree = renderWithTheme(
      <RewindIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
