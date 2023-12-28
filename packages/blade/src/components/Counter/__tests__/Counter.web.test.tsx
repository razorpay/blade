import type { CounterProps } from '../Counter';
import { Counter } from '../Counter';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

const colors: CounterProps['color'][] = [
  'primary',
  'information',
  'negative',
  'neutral',
  'notice',
  'positive',
];

describe('<Counter />', () => {
  it('should render Counter with primary props', () => {
    const { container } = renderWithTheme(<Counter value={20} />);
    expect(container).toMatchSnapshot();
  });

  it('should limit value with max prop', () => {
    const { getByText } = renderWithTheme(<Counter value={20} max={10} />);
    expect(getByText('10+')).toBeTruthy();
  });

  it('should render small size Counter', () => {
    const { container } = renderWithTheme(<Counter size="small" value={20} />);
    expect(container).toMatchSnapshot();
  });

  it('should render medium size Counter', () => {
    const { container } = renderWithTheme(<Counter size="medium" value={20} />);
    expect(container).toMatchSnapshot();
  });

  it('should render large size Counter', () => {
    const { container } = renderWithTheme(<Counter size="large" value={20} />);
    expect(container).toMatchSnapshot();
  });

  colors.forEach((color) => {
    it(`should render low emphasis ${color} color Counter`, () => {
      const { container } = renderWithTheme(<Counter color={color} emphasis="subtle" value={20} />);
      expect(container).toMatchSnapshot();
    });

    it(`should render high emphasis ${color} color Counter`, () => {
      const { container } = renderWithTheme(
        <Counter color={color} emphasis="intense" value={20} />,
      );
      expect(container).toMatchSnapshot();
    });
  });

  it('should render subtle emphasis positive color Counter', () => {
    const { container } = renderWithTheme(
      <Counter color="positive" emphasis="subtle" value={20} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render intense emphasis positive color Counter', () => {
    const { container } = renderWithTheme(
      <Counter color="positive" emphasis="intense" value={20} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render low emphasis negative color Counter', () => {
    const { container } = renderWithTheme(
      <Counter color="negative" emphasis="subtle" value={20} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render high emphasis negative color Counter', () => {
    const { container } = renderWithTheme(
      <Counter color="negative" emphasis="intense" value={20} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render low emphasis notice color Counter', () => {
    const { container } = renderWithTheme(<Counter color="notice" emphasis="subtle" value={20} />);
    expect(container).toMatchSnapshot();
  });

  it('should render high emphasis notice color Counter', () => {
    const { container } = renderWithTheme(<Counter color="notice" emphasis="intense" value={20} />);
    expect(container).toMatchSnapshot();
  });

  it('should render low emphasis information color Counter', () => {
    const { container } = renderWithTheme(
      <Counter color="information" emphasis="subtle" value={20} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render high emphasis information color Counter', () => {
    const { container } = renderWithTheme(
      <Counter color="information" emphasis="intense" value={20} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render low emphasis neutral color Counter', () => {
    const { container } = renderWithTheme(<Counter color="neutral" emphasis="subtle" value={20} />);
    expect(container).toMatchSnapshot();
  });

  it('should render high emphasis neutral color Counter', () => {
    const { container } = renderWithTheme(
      <Counter color="neutral" emphasis="intense" value={20} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render low emphasis blue color Counter', () => {
    const { container } = renderWithTheme(<Counter color="primary" emphasis="subtle" value={20} />);
    expect(container).toMatchSnapshot();
  });

  it('should render high emphasis blue color Counter', () => {
    const { container } = renderWithTheme(
      <Counter color="primary" emphasis="intense" value={20} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(<Counter value={20} testID="counter-test" />);
    expect(getByTestId('counter-test')).toBeTruthy();
  });
});
