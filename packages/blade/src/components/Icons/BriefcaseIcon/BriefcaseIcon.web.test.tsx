import renderWithTheme from '~utils/testing/renderWithTheme.web';

import BriefcaseIcon from './';

describe('<BriefcaseIcon />', () => {
  it('should render BriefcaseIcon', () => {
    const { container } = renderWithTheme(
      <BriefcaseIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
