import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ArrowUpLeftIcon from './';

describe('<ArrowUpLeftIcon />', () => {
  it('should render ArrowUpLeftIcon', () => {
    const { container } = renderWithTheme(
      <ArrowUpLeftIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
