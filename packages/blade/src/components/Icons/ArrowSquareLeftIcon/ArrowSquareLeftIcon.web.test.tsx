import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ArrowSquareLeftIcon from './';

describe('<ArrowSquareLeftIcon />', () => {
  it('should render ArrowSquareLeftIcon', () => {
    const { container } = renderWithTheme(
      <ArrowSquareLeftIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
