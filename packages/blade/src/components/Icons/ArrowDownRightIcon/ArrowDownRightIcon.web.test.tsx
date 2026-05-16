import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ArrowDownRightIcon from './';

describe('<ArrowDownRightIcon />', () => {
  it('should render ArrowDownRightIcon', () => {
    const { container } = renderWithTheme(
      <ArrowDownRightIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
