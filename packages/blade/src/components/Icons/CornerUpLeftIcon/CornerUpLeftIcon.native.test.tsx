import CornerUpLeftIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<CornerUpLeftIcon />', () => {
  it('should render CornerUpLeftIcon', () => {
    const renderTree = renderWithTheme(
      <CornerUpLeftIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
