import renderWithTheme from '~utils/testing/renderWithTheme.web';

import AwardIcon from './';

describe('<AwardIcon />', () => {
  it('should render AwardIcon', () => {
    const { container } = renderWithTheme(
      <AwardIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
