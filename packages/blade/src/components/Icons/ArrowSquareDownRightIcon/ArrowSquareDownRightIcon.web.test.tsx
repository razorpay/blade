import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ArrowSquareDownRightIcon from './';

describe('<ArrowSquareDownRightIcon />', () => {
  it('should render ArrowSquareDownRightIcon', () => {
    const { container } = renderWithTheme(
      <ArrowSquareDownRightIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
