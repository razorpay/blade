import FastForwardIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<FastForwardIcon />', () => {
  it('should render FastForwardIcon', () => {
    const { container } = renderWithTheme(
      <FastForwardIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
