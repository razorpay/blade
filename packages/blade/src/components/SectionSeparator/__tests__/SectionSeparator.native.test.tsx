import { SectionSeparator } from '../SectionSeparator';
import { Box } from '~components/Box';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<SectionSeparator />', () => {
  it('should render with a label', () => {
    const { toJSON } = renderWithTheme(
      <Box display="flex">
        <SectionSeparator label="Section Title" />
      </Box>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render without a label', () => {
    const { toJSON } = renderWithTheme(
      <Box display="flex">
        <SectionSeparator />
      </Box>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
