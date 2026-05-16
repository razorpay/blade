import renderWithTheme from '~utils/testing/renderWithTheme.web';

import FigmaIcon from './';

describe('<FigmaIcon />', () => {
  it('should render FigmaIcon', () => {
    const { container } = renderWithTheme(
      <FigmaIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
