import SourceToPayIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<SourceToPayIcon />', () => {
  it('should render SourceToPayIcon', () => {
    const renderTree = renderWithTheme(
      <SourceToPayIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
