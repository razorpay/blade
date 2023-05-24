import DropletIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<DropletIcon />', () => {
  it('should render DropletIcon', () => {
    const renderTree = renderWithTheme(
      <DropletIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
