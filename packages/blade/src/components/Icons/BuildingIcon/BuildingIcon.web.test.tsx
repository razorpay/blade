import BuildingIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<BuildingIcon />', () => {
  it('should render BuildingIcon', () => {
    const { container } = renderWithTheme(
      <BuildingIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
