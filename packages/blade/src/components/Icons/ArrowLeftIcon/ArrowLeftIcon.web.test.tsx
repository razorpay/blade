import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ArrowLeftIcon from './';

describe('<ArrowLeftIcon />', () => {
  it('should render ArrowLeftIcon', () => {
    const { container } = renderWithTheme(
      <ArrowLeftIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
