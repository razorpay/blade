import renderWithTheme from '~utils/testing/renderWithTheme.web';

import SourceToPayIcon from './';

describe('<SourceToPayIcon />', () => {
  it('should render SourceToPayIcon', () => {
    const { container } = renderWithTheme(
      <SourceToPayIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
