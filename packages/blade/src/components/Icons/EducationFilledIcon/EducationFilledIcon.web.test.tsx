import renderWithTheme from '~utils/testing/renderWithTheme.web';

import EducationFilledIcon from './';

describe('<EducationFilledIcon />', () => {
  it('should render EducationFilledIcon', () => {
    const { container } = renderWithTheme(
      <EducationFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
