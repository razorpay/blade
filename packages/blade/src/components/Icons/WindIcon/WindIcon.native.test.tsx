import WindIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<WindIcon />', () => {
  it('should render WindIcon', () => {
    const renderTree = renderWithTheme(
      <WindIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
