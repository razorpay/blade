import PercentIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PercentIcon />', () => {
  it('should render PercentIcon', () => {
    const renderTree = renderWithTheme(
      <PercentIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
