import renderWithTheme from '~utils/testing/renderWithTheme.web';

import TabletIcon from './';

describe('<TabletIcon />', () => {
  it('should render TabletIcon', () => {
    const { container } = renderWithTheme(
      <TabletIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
