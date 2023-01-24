import AtSignIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<AtSignIcon />', () => {
  it('should render AtSignIcon', () => {
    const renderTree = renderWithTheme(
      <AtSignIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
