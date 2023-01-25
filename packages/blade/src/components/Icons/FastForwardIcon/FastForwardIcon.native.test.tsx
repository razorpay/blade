import FastForwardIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<FastForwardIcon />', () => {
  it('should render FastForwardIcon', () => {
    const renderTree = renderWithTheme(
      <FastForwardIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
