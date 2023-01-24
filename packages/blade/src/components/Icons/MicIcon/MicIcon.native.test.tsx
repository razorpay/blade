import MicIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<MicIcon />', () => {
  it('should render MicIcon', () => {
    const renderTree = renderWithTheme(
      <MicIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
