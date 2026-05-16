import renderWithTheme from '~utils/testing/renderWithTheme.web';

import EducationIcon from './';

describe('<EducationIcon />', () => {
  it('should render EducationIcon', () => {
    const { container } = renderWithTheme(
      <EducationIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
