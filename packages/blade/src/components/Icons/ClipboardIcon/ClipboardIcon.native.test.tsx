import ClipboardIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ClipboardIcon />', () => {
  it('should render ClipboardIcon', () => {
    const renderTree = renderWithTheme(
      <ClipboardIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
