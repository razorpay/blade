import CornerRightDownIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<CornerRightDownIcon />', () => {
  it('should render CornerRightDownIcon', () => {
    const renderTree = renderWithTheme(
      <CornerRightDownIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
