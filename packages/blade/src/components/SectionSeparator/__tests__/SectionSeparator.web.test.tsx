import { SectionSeparator } from '../SectionSeparator';
import { Box } from '~components/Box';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import 'jest-styled-components';

describe('<SectionSeparator />', () => {
  it('should render with a label', () => {
    const { container } = renderWithTheme(
      <Box display="flex">
        <SectionSeparator label="Section Title" />
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render without a label', () => {
    const { container } = renderWithTheme(
      <Box display="flex">
        <SectionSeparator />
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render with normal variant', () => {
    const { container } = renderWithTheme(
      <Box display="flex">
        <SectionSeparator label="Normal" variant="normal" />
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render with subtle variant', () => {
    const { container } = renderWithTheme(
      <Box display="flex">
        <SectionSeparator label="Subtle" variant="subtle" />
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should set testID on the wrapper', () => {
    const { getByTestId } = renderWithTheme(
      <SectionSeparator label="Test" testID="section-sep" />,
    );
    expect(getByTestId('section-sep')).toBeTruthy();
  });
});
