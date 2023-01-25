import CloudOffIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<CloudOffIcon />', () => {
  it('should render CloudOffIcon', () => {
    const renderTree = renderWithTheme(
      <CloudOffIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
