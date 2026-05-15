import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ArrowDownIcon from './';

describe('<ArrowDownIcon />', () => {
  it('should render ArrowDownIcon', () => {
    const { container } = renderWithTheme(
      <ArrowDownIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
