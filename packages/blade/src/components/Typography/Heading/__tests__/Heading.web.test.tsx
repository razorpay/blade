import React from 'react';
import { Heading } from '../';
import type { HeadingProps } from '../';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Heading />', () => {
  it('should render Heading with default properties', () => {
    const displayText = 'Get Started With Payment Gateway';
    const { container, getByRole, getByText } = renderWithTheme(<Heading>{displayText}</Heading>);
    expect(getByRole('heading', { level: 6 })).toBeInTheDocument();
    expect(getByText('Get Started With Payment Gateway')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render Heading with size "small" and contrast "high"', () => {
    const displayText = 'Get Started With Payment Gateway';
    const { container, getByRole, getByText } = renderWithTheme(
      <Heading color="surface.text.gray.normal" size="small" weight="regular">
        {displayText}
      </Heading>,
    );
    expect(getByRole('heading', { level: 6 })).toBeInTheDocument();
    expect(getByText('Get Started With Payment Gateway')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render Heading with color', () => {
    const displayText = 'Get Started With Payment Gateway';
    const { container } = renderWithTheme(
      <Heading color="surface.text.gray.disabled">{displayText}</Heading>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render Heading with mixed color', () => {
    const { container } = renderWithTheme(
      <Heading>
        Supercharge your business with the all‑powerful{' '}
        <Heading as="span" color="interactive.text.information.subtle">
          Payment Gateway
        </Heading>
      </Heading>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render Heading with size "small"', () => {
    const displayText = 'Get Started With Payment Gateway';
    const { container, getByRole, getByText } = renderWithTheme(
      <Heading color="surface.text.gray.normal" size="small" weight="regular">
        {displayText}
      </Heading>,
    );
    expect(getByRole('heading', { level: 6 })).toBeInTheDocument();
    expect(getByText('Get Started With Payment Gateway')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render Heading with size "medium"', () => {
    const displayText = 'Get Started With Payment Gateway';
    const { container, getByRole, getByText } = renderWithTheme(
      <Heading color="surface.text.gray.muted" size="medium" weight="regular">
        {displayText}
      </Heading>,
    );
    expect(getByRole('heading', { level: 5 })).toBeInTheDocument();
    expect(getByText('Get Started With Payment Gateway')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render Heading with size "large"', () => {
    const displayText = 'Get Started With Payment Gateway';
    const { container, getByRole, getByText } = renderWithTheme(
      <Heading color="surface.text.gray.muted" size="large" weight="regular">
        {displayText}
      </Heading>,
    );
    expect(getByRole('heading', { level: 4 })).toBeInTheDocument();
    expect(getByText('Get Started With Payment Gateway')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should accept as prop and render appropriate HTML tag', () => {
    const displayText = 'Displaying some text';
    const { getByText } = renderWithTheme(<Heading as="span">{displayText}</Heading>);
    expect(getByText(displayText).tagName).toBe('SPAN');
  });

  it('should throw error on invalid as prop', () => {
    const displayText = 'Displaying some text';
    expect(() =>
      renderWithTheme(
        // @ts-expect-error testing failure case as prop is invalid
        <Heading as="button">{displayText}</Heading>,
      ),
    ).toThrow(
      '[Blade: Heading]: Invalid `as` prop value - button. Only span, h1, h2, h3, h4, h5, h6 are accepted',
    );
  });

  it('should be accessible', async () => {
    const { container } = renderWithTheme(<Heading>Text content</Heading>);
    await assertAccessible(container);
  });

  it('should render serif Heading at size "2xlarge"', () => {
    const displayText = 'Good morning, what would you like to do today?';
    const { container, getByRole } = renderWithTheme(
      <Heading size="2xlarge" isSerif>
        {displayText}
      </Heading>,
    );
    const heading = getByRole('heading', { level: 2 });
    expect(heading).toHaveStyle({
      fontFamily: '"PT Serif","PT Serif Fallback Georgia",Georgia,serif',
      fontWeight: '400',
      fontSize: '2.5rem',
      letterSpacing: '-0.52px',
    });
    expect(container).toMatchSnapshot();
  });

  it('should accept a computed boolean for isSerif at size "2xlarge"', () => {
    const serifFontFamily = '"PT Serif","PT Serif Fallback Georgia",Georgia,serif';
    const renderHero = (isHero: boolean): HTMLElement | null =>
      renderWithTheme(
        <Heading size="2xlarge" isSerif={isHero}>
          Hero
        </Heading>,
      ).container.querySelector('h2');

    expect(renderHero(true)).toHaveStyle({ fontFamily: serifFontFamily });
    expect(renderHero(false)).not.toHaveStyle({ fontFamily: serifFontFamily });
  });

  it('should keep HeadingProps usable in wrappers while guarding literal isSerif', () => {
    // Type-level checks: these fail `yarn typecheck` if the guard or HeadingProps shape regresses.
    type SectionTitleProps = Omit<HeadingProps, 'size'>;
    const SectionTitle = (props: SectionTitleProps): React.ReactElement => (
      <Heading size="large" {...props} />
    );
    const misuse = [
      // @ts-expect-error isSerif needs size="2xlarge"
      <Heading key="size" size="xlarge" isSerif>
        a
      </Heading>,
      // @ts-expect-error PT Serif ships in regular weight only
      <Heading key="weight" size="2xlarge" weight="semibold" isSerif>
        a
      </Heading>,
    ];
    expect(misuse).toHaveLength(2);

    // Heading keeps its forwardRef component type for consumers.
    type HeadingRef = React.ElementRef<typeof Heading>;
    // @ts-expect-error the ref type must be concrete, not any
    const notAny: HeadingRef = 5;
    expect(notAny).toBe(5);
    // Type-only check (reading `.displayName` directly is lint-restricted): fails to compile if
    // Heading's type loses its forwardRef statics.
    const displayName: typeof Heading['displayName'] = 'Heading';
    expect(displayName).toBe('Heading');

    const { getByRole } = renderWithTheme(<SectionTitle>Section</SectionTitle>);
    expect(getByRole('heading', { level: 4 })).toBeInTheDocument();

    // The type guard can't see isSerif inside a spread, so the wrapper still compiles with it.
    // The runtime check catches it instead.
    expect(() => renderWithTheme(<SectionTitle isSerif>Section</SectionTitle>)).toThrow(
      '[Blade: Heading]: isSerif is only supported with size="2xlarge". Received size="large".',
    );
  });

  it('should throw in dev when isSerif is used with a size other than "2xlarge"', () => {
    const isHero = true as boolean;
    expect(() =>
      renderWithTheme(
        <Heading size="xlarge" isSerif={isHero}>
          Not serif
        </Heading>,
      ),
    ).toThrow(
      '[Blade: Heading]: isSerif is only supported with size="2xlarge". Received size="xlarge".',
    );
  });

  it('should throw in dev when isSerif is used with a weight other than "regular"', () => {
    const isHero = true as boolean;
    expect(() =>
      renderWithTheme(
        <Heading size="2xlarge" weight="medium" isSerif={isHero}>
          Not serif
        </Heading>,
      ),
    ).toThrow(
      '[Blade: Heading]: isSerif only supports weight="regular", because PT Serif ships in regular weight only. Received weight="medium".',
    );
  });

  it('should accept testID', () => {
    const displayText = 'Get Started With Payment Gateway';
    const { getByTestId } = renderWithTheme(<Heading testID="heading-test">{displayText}</Heading>);
    expect(getByTestId('heading-test')).toBeTruthy();
  });
});
