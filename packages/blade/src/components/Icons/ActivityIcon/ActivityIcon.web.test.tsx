import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ActivityIcon from './';

describe('<ActivityIcon />', () => {
  it('should render ActivityIcon', () => {
    const { container } = renderWithTheme(
      <ActivityIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
