import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ExportIcon from './';

describe('<ExportIcon />', () => {
  it('should render ExportIcon', () => {
    const { container } = renderWithTheme(
      <ExportIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
