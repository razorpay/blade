import renderWithTheme from '~utils/testing/renderWithTheme.web';

import BfsiIcon from './';

describe('<BfsiIcon />', () => {
  it('should render BfsiIcon', () => {
    const { container } = renderWithTheme(
      <BfsiIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
