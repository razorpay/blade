import renderWithTheme from '~utils/testing/renderWithTheme.web';

import SourceToPayFilledIcon from './';

describe('<SourceToPayFilledIcon />', () => {
  it('should render SourceToPayFilledIcon', () => {
    const { container } = renderWithTheme(
      <SourceToPayFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
