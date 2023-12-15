import AlignRightIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<AlignRightIcon />', () => {
  it('should render AlignRightIcon', () => {
    const renderTree = renderWithTheme(
      <AlignRightIcon color="feedback.icon.gray.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
