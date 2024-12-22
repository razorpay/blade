import type { BadgeProps } from '../Badge';
import { Badge } from '../Badge';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { InfoIcon } from '~components/Icons';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

const colors: BadgeProps['color'][] = [
  'primary',
  'information',
  'negative',
  'neutral',
  'notice',
  'positive',
];

describe('<Badge />', () => {
  it('should render Badge with default props', () => {
    const label = 'Label';
    const { container } = renderWithTheme(<Badge>{label}</Badge>);
    expect(container).toMatchSnapshot();
  });

  it('should throw an error when no children are passed', () => {
    try {
      // @ts-expect-error testing failure case when there is no children passed
      renderWithTheme(<Badge />);
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual('[Blade: Badge]: Text as children is required for Badge.');
      }
    }
  });

  it('should render small size Badge', () => {
    const label = 'Label';
    const { container } = renderWithTheme(<Badge size="small">{label}</Badge>);
    expect(container).toMatchSnapshot();
  });

  it('should render medium size Badge', () => {
    const label = 'Label';
    const { container } = renderWithTheme(<Badge size="medium">{label}</Badge>);
    expect(container).toMatchSnapshot();
  });

  it('should render large size Badge', () => {
    const label = 'Label';
    const { container } = renderWithTheme(<Badge size="large">{label}</Badge>);
    expect(container).toMatchSnapshot();
  });

  it('should render Badge with Icon', () => {
    const label = 'Label';
    const { container } = renderWithTheme(<Badge icon={InfoIcon}>{label}</Badge>);
    expect(container).toMatchSnapshot();
  });

  it('should render low emphasis positive color Badge', () => {
    const label = 'Label';
    const { container } = renderWithTheme(
      <Badge color="positive" emphasis="subtle">
        {label}
      </Badge>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render high emphasis positive color Badge', () => {
    const label = 'Label';
    const { container } = renderWithTheme(
      <Badge color="positive" emphasis="intense">
        {label}
      </Badge>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render low emphasis negative color Badge', () => {
    const label = 'Label';
    const { container } = renderWithTheme(
      <Badge color="negative" emphasis="subtle">
        {label}
      </Badge>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render high emphasis negative color Badge', () => {
    const label = 'Label';
    const { container } = renderWithTheme(
      <Badge color="negative" emphasis="intense">
        {label}
      </Badge>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render low emphasis notice color Badge', () => {
    const label = 'Label';
    const { container } = renderWithTheme(
      <Badge color="notice" emphasis="subtle">
        {label}
      </Badge>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render high emphasis notice color Badge', () => {
    const label = 'Label';
    const { container } = renderWithTheme(
      <Badge color="notice" emphasis="intense">
        {label}
      </Badge>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render low emphasis information color Badge', () => {
    const label = 'Label';
    const { container } = renderWithTheme(
      <Badge color="information" emphasis="subtle">
        {label}
      </Badge>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render high emphasis information color Badge', () => {
    const label = 'Label';
    const { container } = renderWithTheme(
      <Badge color="information" emphasis="intense">
        {label}
      </Badge>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render low emphasis neutral color Badge', () => {
    const label = 'Label';
    const { container } = renderWithTheme(
      <Badge color="neutral" emphasis="subtle">
        {label}
      </Badge>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render high emphasis neutral color Badge', () => {
    const label = 'Label';
    const { container } = renderWithTheme(
      <Badge color="neutral" emphasis="intense">
        {label}
      </Badge>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render low emphasis primary color Badge', () => {
    const label = 'Label';
    const { container } = renderWithTheme(
      <Badge color="primary" emphasis="subtle">
        {label}
      </Badge>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render high emphasis primary color Badge', () => {
    const label = 'Label';
    const { container } = renderWithTheme(
      <Badge color="primary" emphasis="intense">
        {label}
      </Badge>,
    );
    expect(container).toMatchSnapshot();
  });

  colors.forEach((color) => {
    it(`should render low emphasis ${color} color Badge`, () => {
      const label = 'Label';
      const { container } = renderWithTheme(
        <Badge color={color} emphasis="subtle">
          {label}
        </Badge>,
      );
      expect(container).toMatchSnapshot();
    });

    it(`should render high emphasis ${color} color Badge`, () => {
      const label = 'Label';
      const { container } = renderWithTheme(
        <Badge color={color} emphasis="intense">
          {label}
        </Badge>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  it('should accept testID', () => {
    const label = 'Label';
    const { getByTestId } = renderWithTheme(<Badge testID="badge-test">{label}</Badge>);
    expect(getByTestId('badge-test')).toBeTruthy();
  });
  it('should accept data-analytic', () => {
    const label = 'Label';
    const { getByTestId } = renderWithTheme(
      <Badge data-analytic-test="badge-test" testID="badge-test">
        {label}
      </Badge>,
    );
    expect(getByTestId('badge-test')).toBeTruthy();
  });
});
