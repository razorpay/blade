import HeadphonesIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<HeadphonesIcon />', () => {
  it('should render HeadphonesIcon', () => {
    const renderTree = renderWithTheme(
      <HeadphonesIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
