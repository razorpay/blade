import CommandIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<CommandIcon />', () => {
  it('should render CommandIcon', () => {
    const renderTree = renderWithTheme(
      <CommandIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
