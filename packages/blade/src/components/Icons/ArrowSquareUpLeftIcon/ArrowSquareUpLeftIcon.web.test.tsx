import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ArrowSquareUpLeftIcon from './';

describe('<ArrowSquareUpLeftIcon />', () => {
  it('should render ArrowSquareUpLeftIcon', () => {
    const { container } = renderWithTheme(
      <ArrowSquareUpLeftIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
