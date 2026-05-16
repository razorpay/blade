import renderWithTheme from '~utils/testing/renderWithTheme.web';

import AlertTriangleIcon from './';

describe('<AlertTriangleIcon />', () => {
  it('should render AlertTriangleIcon', () => {
    const { container } = renderWithTheme(
      <AlertTriangleIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
