import renderWithTheme from '../../../_helpers/testing/renderWithTheme.native';
import CloseIcon from '.';

describe('<CloseIcon />', () => {
  it('should render CloseIcon', () => {
    const renderTree = renderWithTheme(
      <CloseIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
