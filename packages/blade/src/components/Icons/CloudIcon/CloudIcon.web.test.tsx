import renderWithTheme from '~utils/testing/renderWithTheme.web';

import CloudIcon from './';

describe('<CloudIcon />', () => {
  it('should render CloudIcon', () => {
    const { container } = renderWithTheme(
      <CloudIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
