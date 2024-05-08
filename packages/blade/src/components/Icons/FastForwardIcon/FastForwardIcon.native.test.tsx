import FastForwardIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<FastForwardIcon />', () => {
  it('should render FastForwardIcon', () => {
    const renderTree = renderWithTheme(
      <FastForwardIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
