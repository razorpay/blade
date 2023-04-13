import { Badge } from '../Badge';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';
import { InfoIcon } from '~components/Icons';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

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

  it('should render Badge with bold font', () => {
    const label = 'LABEL';
    const { toJSON } = renderWithTheme(<Badge fontWeight="bold">{label}</Badge>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render low contrast positive variant Badge', () => {
    const label = 'Label';
    const { toJSON } = renderWithTheme(
      <Badge variant="positive" contrast="low">
        {label}
      </Badge>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render high contrast positive variant Badge', () => {
    const label = 'Label';
    const { toJSON } = renderWithTheme(
      <Badge variant="positive" contrast="high">
        {label}
      </Badge>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render low contrast negative variant Badge', () => {
    const label = 'Label';
    const { toJSON } = renderWithTheme(
      <Badge variant="negative" contrast="low">
        {label}
      </Badge>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render high contrast negative variant Badge', () => {
    const label = 'Label';
    const { toJSON } = renderWithTheme(
      <Badge variant="negative" contrast="high">
        {label}
      </Badge>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render low contrast notice variant Badge', () => {
    const label = 'Label';
    const { toJSON } = renderWithTheme(
      <Badge variant="notice" contrast="low">
        {label}
      </Badge>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render high contrast notice variant Badge', () => {
    const label = 'Label';
    const { toJSON } = renderWithTheme(
      <Badge variant="notice" contrast="high">
        {label}
      </Badge>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render low contrast information variant Badge', () => {
    const label = 'Label';
    const { toJSON } = renderWithTheme(
      <Badge variant="information" contrast="low">
        {label}
      </Badge>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render high contrast information variant Badge', () => {
    const label = 'Label';
    const { toJSON } = renderWithTheme(
      <Badge variant="information" contrast="high">
        {label}
      </Badge>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render low contrast neutral variant Badge', () => {
    const label = 'Label';
    const { toJSON } = renderWithTheme(
      <Badge variant="neutral" contrast="low">
        {label}
      </Badge>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render high contrast neutral variant Badge', () => {
    const label = 'Label';
    const { toJSON } = renderWithTheme(
      <Badge variant="neutral" contrast="high">
        {label}
      </Badge>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render low contrast blue variant Badge', () => {
    const label = 'Label';
    const { toJSON } = renderWithTheme(
      <Badge variant="blue" contrast="low">
        {label}
      </Badge>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render high contrast blue variant Badge', () => {
    const label = 'Label';
    const { toJSON } = renderWithTheme(
      <Badge variant="blue" contrast="high">
        {label}
      </Badge>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should accept testID', () => {
    const label = 'Label';
    const { getByTestId } = renderWithTheme(<Badge testID="badge-test">{label}</Badge>);
    expect(getByTestId('badge-test')).toBeTruthy();
  });
});
