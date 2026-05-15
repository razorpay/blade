import renderWithTheme from '~utils/testing/renderWithTheme.web';

import CodepenIcon from './';

describe('<CodepenIcon />', () => {
  it('should render CodepenIcon', () => {
    const { container } = renderWithTheme(
      <CodepenIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
