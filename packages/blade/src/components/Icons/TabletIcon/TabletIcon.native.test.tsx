import TabletIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<TabletIcon />', () => {
  it('should render TabletIcon', () => {
    const renderTree = renderWithTheme(
      <TabletIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
