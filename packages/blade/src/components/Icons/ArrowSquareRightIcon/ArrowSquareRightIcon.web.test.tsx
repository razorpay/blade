import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ArrowSquareRightIcon from './';

describe('<ArrowSquareRightIcon />', () => {
  it('should render ArrowSquareRightIcon', () => {
    const { container } = renderWithTheme(
      <ArrowSquareRightIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
