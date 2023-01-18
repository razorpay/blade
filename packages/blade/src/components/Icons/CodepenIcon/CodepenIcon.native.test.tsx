import CodepenIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<CodepenIcon />', () => {
  it('should render CodepenIcon', () => {
    const renderTree = renderWithTheme(
      <CodepenIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
