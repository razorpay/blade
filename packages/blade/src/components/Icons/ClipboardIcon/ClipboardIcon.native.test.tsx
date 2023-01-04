import ClipboardIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<ClipboardIcon />', () => {
  it('should render ClipboardIcon', () => {
    const renderTree = renderWithTheme(
      <ClipboardIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
