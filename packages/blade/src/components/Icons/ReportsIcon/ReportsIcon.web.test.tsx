import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ReportsIcon from './';

describe('<ReportsIcon />', () => {
  it('should render ReportsIcon', () => {
    const { container } = renderWithTheme(
      <ReportsIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
