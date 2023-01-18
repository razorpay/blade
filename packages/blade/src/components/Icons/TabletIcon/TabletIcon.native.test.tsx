import TabletIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<TabletIcon />', () => {
  it('should render TabletIcon', () => {
    const renderTree = renderWithTheme(
      <TabletIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
