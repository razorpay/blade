import RupeesIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<RupeesIcon />', () => {
  it('should render RupeesIcon', () => {
    const renderTree = renderWithTheme(
      <RupeesIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
