import CornerRightUpIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<CornerRightUpIcon />', () => {
  it('should render CornerRightUpIcon', () => {
    const renderTree = renderWithTheme(
      <CornerRightUpIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
