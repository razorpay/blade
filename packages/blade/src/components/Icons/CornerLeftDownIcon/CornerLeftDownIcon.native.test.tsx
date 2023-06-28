import CornerLeftDownIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CornerLeftDownIcon />', () => {
  it('should render CornerLeftDownIcon', () => {
    const renderTree = renderWithTheme(
      <CornerLeftDownIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
