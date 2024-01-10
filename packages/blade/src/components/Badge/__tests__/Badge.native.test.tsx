import type { BadgeProps } from '../Badge';
import { Badge } from '../Badge';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
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
    const { toJSON } = renderWithTheme(<Badge>{label}</Badge>);
    expect(toJSON()).toMatchSnapshot();
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
    const { toJSON } = renderWithTheme(<Badge size="small">{label}</Badge>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render medium size Badge', () => {
    const label = 'Label';
    const { toJSON } = renderWithTheme(<Badge size="medium">{label}</Badge>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render large size Badge', () => {
    const label = 'Label';
    const { toJSON } = renderWithTheme(<Badge size="large">{label}</Badge>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render Badge with Icon', () => {
    const label = 'Label';
    const { toJSON } = renderWithTheme(<Badge icon={InfoIcon}>{label}</Badge>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render subtle emphasis positive color Badge', () => {
    const label = 'Label';
    const { toJSON } = renderWithTheme(
      <Badge color="positive" emphasis="subtle">
        {label}
      </Badge>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render intense emphasis positive color Badge', () => {
    const label = 'Label';
    const { toJSON } = renderWithTheme(
      <Badge color="positive" emphasis="intense">
        {label}
      </Badge>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render subtle emphasis negative color Badge', () => {
    const label = 'Label';
    const { toJSON } = renderWithTheme(
      <Badge color="negative" emphasis="subtle">
        {label}
      </Badge>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render intense emphasis negative color Badge', () => {
    const label = 'Label';
    const { toJSON } = renderWithTheme(
      <Badge color="negative" emphasis="intense">
        {label}
      </Badge>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render subtle emphasis notice color Badge', () => {
    const label = 'Label';
    const { toJSON } = renderWithTheme(
      <Badge color="notice" emphasis="subtle">
        {label}
      </Badge>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render intense emphasis notice color Badge', () => {
    const label = 'Label';
    const { toJSON } = renderWithTheme(
      <Badge color="notice" emphasis="intense">
        {label}
      </Badge>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render subtle emphasis information color Badge', () => {
    const label = 'Label';
    const { toJSON } = renderWithTheme(
      <Badge color="information" emphasis="subtle">
        {label}
      </Badge>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render intense emphasis information color Badge', () => {
    const label = 'Label';
    const { toJSON } = renderWithTheme(
      <Badge color="information" emphasis="intense">
        {label}
      </Badge>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render subtle emphasis neutral color Badge', () => {
    const label = 'Label';
    const { toJSON } = renderWithTheme(
      <Badge color="neutral" emphasis="subtle">
        {label}
      </Badge>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render intense emphasis neutral color Badge', () => {
    const label = 'Label';
    const { toJSON } = renderWithTheme(
      <Badge color="neutral" emphasis="intense">
        {label}
      </Badge>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render subtle emphasis primary color Badge', () => {
    const label = 'Label';
    const { toJSON } = renderWithTheme(
      <Badge color="primary" emphasis="subtle">
        {label}
      </Badge>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render intense emphasis primary color Badge', () => {
    const label = 'Label';
    const { toJSON } = renderWithTheme(
      <Badge color="primary" emphasis="intense">
        {label}
      </Badge>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  colors.forEach((color) => {
    it(`should render subtle emphasis ${color} color Badge`, () => {
      const label = 'Label';
      const { toJSON } = renderWithTheme(
        <Badge color={color} emphasis="subtle">
          {label}
        </Badge>,
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it(`should render intense emphasis ${color} color Badge`, () => {
      const label = 'Label';
      const { toJSON } = renderWithTheme(
        <Badge color={color} emphasis="intense">
          {label}
        </Badge>,
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should accept testID', () => {
    const label = 'Label';
    const { getByTestId } = renderWithTheme(<Badge testID="badge-test">{label}</Badge>);
    expect(getByTestId('badge-test')).toBeTruthy();
  });
});
