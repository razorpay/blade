import FastForwardIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<FastForwardIcon />', () => {
  it('should render FastForwardIcon', () => {
    const { container } = renderWithTheme(
      <FastForwardIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
