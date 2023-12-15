import FastForwardIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<FastForwardIcon />', () => {
  it('should render FastForwardIcon', () => {
    const { container } = renderWithTheme(
      <FastForwardIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
