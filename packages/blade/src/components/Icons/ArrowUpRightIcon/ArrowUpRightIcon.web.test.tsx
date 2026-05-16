import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ArrowUpRightIcon from './';

describe('<ArrowUpRightIcon />', () => {
  it('should render ArrowUpRightIcon', () => {
    const { container } = renderWithTheme(
      <ArrowUpRightIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
