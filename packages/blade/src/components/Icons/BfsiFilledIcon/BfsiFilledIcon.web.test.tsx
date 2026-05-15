import renderWithTheme from '~utils/testing/renderWithTheme.web';

import BfsiFilledIcon from './';

describe('<BfsiFilledIcon />', () => {
  it('should render BfsiFilledIcon', () => {
    const { container } = renderWithTheme(
      <BfsiFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
