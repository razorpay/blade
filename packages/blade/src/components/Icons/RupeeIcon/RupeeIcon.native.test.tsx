import renderWithTheme from '../../../_helpers/testing/renderWithTheme.native';
import RupeeIcon from '.';

describe('<RupeeIcon />', () => {
  it('should render RupeeIcon', () => {
    const renderTree = renderWithTheme(
      <RupeeIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
