import LifeBuoyIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<LifeBuoyIcon />', () => {
  it('should render LifeBuoyIcon', () => {
    const renderTree = renderWithTheme(
      <LifeBuoyIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
