import CopyIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<CopyIcon />', () => {
  it('should render CopyIcon', () => {
    const renderTree = renderWithTheme(
      <CopyIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
