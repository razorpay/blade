/* eslint-disable @typescript-eslint/ban-ts-comment */
import { fireEvent, waitFor } from '@testing-library/react';
import { useRef } from 'react';
import type { ButtonProps } from '../Button';
import Button from '../Button';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { ButtonGroup } from '~components/ButtonGroup';
import { CreditCardIcon } from '~components/Icons';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

/** whether a button has an AI hover layer in it */
const hasLayer = (button: HTMLElement): boolean =>
  Boolean(button.querySelector(':scope > span[aria-hidden="true"]'));

/**
 * A button that gives way keeps its own hover: checked once a button beside it, rendered with it, has its layer in (the layers
 * load on demand, so a layer that would show is in by then too)
 */
const expectGivesWay = async (gated: HTMLElement[], control: HTMLElement): Promise<void> => {
  await waitFor(() => expect(hasLayer(control)).toBe(true), { timeout: 10000 });
  gated.forEach((button) => expect(hasLayer(button)).toBe(false));
};

const variants: ButtonProps['variant'][] = ['primary', 'secondary', 'tertiary'];
const colors: ButtonProps['color'][] = ['primary', 'white', 'positive', 'negative', 'neutral'];

describe('<Button />', () => {
  it('should render button with default properties', () => {
    const buttonText = 'Pay Now';
    const { container, getByText, getByRole } = renderWithTheme(<Button>{buttonText}</Button>);
    expect(container).toMatchSnapshot();
    expect(getByRole('button')).toBeInTheDocument();
    expect(getByText('Pay Now')).toBeInTheDocument();
  });

  it('should render xsmall size button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(<Button size="xsmall">{buttonText}</Button>);
    expect(container).toMatchSnapshot();
  });

  it('should render small size button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(<Button size="small">{buttonText}</Button>);
    expect(container).toMatchSnapshot();
  });

  it('should render medium size button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(<Button size="medium">{buttonText}</Button>);
    expect(container).toMatchSnapshot();
  });

  it('should render large size button', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(<Button size="large">{buttonText}</Button>);
    expect(container).toMatchSnapshot();
  });

  it('should render button with icon with default iconPosition', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(<Button icon={CreditCardIcon}>{buttonText}</Button>);
    expect(container).toMatchSnapshot();
  });

  it('should render button with icon with right iconPosition', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(
      <Button icon={CreditCardIcon} iconPosition="right">
        {buttonText}
      </Button>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render button with full width', () => {
    const buttonText = 'Pay Now';
    const { container } = renderWithTheme(<Button isFullWidth={true}>{buttonText}</Button>);
    expect(container).toMatchSnapshot();
  });

  it('should render disabled button', () => {
    const buttonText = 'Pay Now';
    const onClick = jest.fn();
    const { container, getByRole } = renderWithTheme(
      <Button isDisabled={true} onClick={onClick}>
        {buttonText}
      </Button>,
    );
    expect(container).toMatchSnapshot();
    const button = getByRole('button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(0);
    expect(button).toBeDisabled();
  });

  colors.forEach((color) => {
    variants.forEach((variant) => {
      // We support only white and default color for tertiary variant
      if (variant === 'tertiary' && color !== 'white' && color !== 'primary') return;
      // Neutral is only available with the primary variant
      if (color === 'neutral' && variant !== 'primary') return;

      it(`should render ${color} color ${variant} button`, () => {
        const buttonText = 'Pay Now';
        const { container } = renderWithTheme(
          <Button color={color} variant={variant}>
            {buttonText}
          </Button>,
        );
        expect(container).toMatchSnapshot();
      });

      it(`should render disabled ${color} color ${variant} button`, () => {
        const buttonText = 'Pay Now';
        const { container } = renderWithTheme(
          <Button color={color} variant={variant} isDisabled={true}>
            {buttonText}
          </Button>,
        );
        expect(container).toMatchSnapshot();
      });
    });
  });

  it('should render loading neutral color primary button', () => {
    const { container } = renderWithTheme(
      <Button color="neutral" isLoading>
        Pay Now
      </Button>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render the RazorSense hover layer only on the neutral primary button', async () => {
    // the layer is loaded on demand: loaded here first, a cold load can outlast waitFor's default
    await import('~components/Spark/ButtonRazorSense/ButtonRazorSenseLayer');
    const { container: neutral } = renderWithTheme(
      <Button color="neutral" aiHover="razorsense">
        Ask Ray
      </Button>,
    );
    // the layer is loaded once the button turns it on
    await waitFor(
      () => expect(neutral.querySelector('button > span[aria-hidden="true"]')).toBeInTheDocument(),
      { timeout: 10000 },
    );
    // on another colour it's a mistake, loud in development
    expect(() => renderWithTheme(<Button aiHover="razorsense">Ask Ray</Button>)).toThrow(
      '[Blade: BaseButton]: aiHover="razorsense" can only be used with variant "primary" and color "neutral"',
    );
  }, 20000);

  it('should keep the full-width neutral button on its own hover, without RazorSense', async () => {
    await import('~components/Spark/ButtonRazorSense/ButtonRazorSenseLayer');
    const { getByTestId } = renderWithTheme(
      <>
        <Button color="neutral" aiHover="razorsense" isFullWidth testID="gated">
          Ask Ray
        </Button>
        <Button color="neutral" aiHover="razorsense" testID="control">
          Ask Ray
        </Button>
      </>,
    );
    await expectGivesWay([getByTestId('gated')], getByTestId('control'));
  }, 20000);

  it('should throw for a Ray aiHover on a non-secondary variant, and skip it on an icon-only button', async () => {
    expect(() => renderWithTheme(<Button aiHover="ray-investigate">Investigate</Button>)).toThrow(
      '[Blade: BaseButton]: aiHover="ray-investigate" can only be used with variant "secondary" and color "primary"',
    );
    // (and only on the default secondary: its text wash is made for that ink)
    expect(() =>
      renderWithTheme(
        <Button variant="secondary" color="positive" aiHover="ray-investigate">
          Investigate
        </Button>,
      ),
    ).toThrow('but received "secondary" and "positive"');
    await import('~components/Spark/ButtonRay/ButtonRayLayer');
    const { getByTestId } = renderWithTheme(
      <>
        <Button
          variant="secondary"
          aiHover="ray-investigate"
          icon={CreditCardIcon}
          accessibilityLabel="Investigate"
          testID="gated"
        />
        <Button variant="secondary" aiHover="ray-investigate" testID="control">
          Investigate
        </Button>
      </>,
    );
    await expectGivesWay([getByTestId('gated')], getByTestId('control'));
  }, 20000);

  it('should keep a Ray button of another color on its own hover in production', async () => {
    await import('~components/Spark/ButtonRay/ButtonRayLayer');
    const dev = (global as any).__DEV__;
    // (production: no throw for the wrong color)
    (global as any).__DEV__ = false;
    try {
      const { getByTestId } = renderWithTheme(
        <>
          <Button variant="secondary" color="white" aiHover="ray-investigate" testID="gated">
            Investigate
          </Button>
          <Button variant="secondary" aiHover="ray-investigate" testID="control">
            Investigate
          </Button>
        </>,
      );
      await expectGivesWay([getByTestId('gated')], getByTestId('control'));
    } finally {
      (global as any).__DEV__ = dev;
    }
  }, 20000);

  it('should throw for an aiHover it does not know', () => {
    expect(() =>
      renderWithTheme(
        // @ts-expect-error: not a value aiHover takes (a JavaScript app can still pass one)
        <Button variant="secondary" aiHover="ray">
          Investigate
        </Button>,
      ),
    ).toThrow(
      '[Blade: BaseButton]: aiHover must be one of "razorsense", "ray-investigate" but received "ray"',
    );
  });

  it('should keep AI hover buttons on their own hover in a ButtonGroup, without throwing', async () => {
    await import('~components/Spark/ButtonRazorSense/ButtonRazorSenseLayer');
    await import('~components/Spark/ButtonRay/ButtonRayLayer');
    const { getAllByTestId, getByTestId } = renderWithTheme(
      <>
        {(['primary', 'secondary'] as const).map((variant) => (
          <ButtonGroup key={variant} variant={variant}>
            <Button aiHover="ray-investigate" testID="gated">
              Investigate
            </Button>
            <Button color="neutral" aiHover="razorsense" testID="gated">
              Ask Ray
            </Button>
            <Button>Other</Button>
          </ButtonGroup>
        ))}
        <Button color="neutral" aiHover="razorsense" testID="control">
          Ask Ray
        </Button>
      </>,
    );
    await expectGivesWay(getAllByTestId('gated'), getByTestId('control'));
  }, 20000);

  it('should render Ray on the secondary button at any size', async () => {
    // Ray's layer (his runtime) is loaded on demand: loaded here first, a cold load can outlast waitFor's default
    await import('~components/Spark/ButtonRay/ButtonRayLayer');
    const { container, getByRole } = renderWithTheme(
      <Button variant="secondary" size="large" aiHover="ray-investigate">
        Investigate
      </Button>,
    );
    await waitFor(
      () =>
        expect(container.querySelector('button > span[aria-hidden="true"]')).toBeInTheDocument(),
      { timeout: 10000 },
    );
    expect(getByRole('button')).toHaveTextContent('Investigate');
  }, 20000);

  it('should call function on click', () => {
    const buttonText = 'Pay Now';
    const onClick = jest.fn();
    const { getByRole } = renderWithTheme(<Button onClick={onClick}>{buttonText}</Button>);
    const button = getByRole('button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it(`should expose native element methods via ref`, () => {
    const label = 'Hello';
    const focusButtonLabel = 'Focus';

    const Example = (): React.ReactElement => {
      const ref = useRef<HTMLInputElement>(null);

      return (
        <>
          <Button ref={ref}>{label}</Button>
          <Button
            onClick={() => {
              ref.current?.focus();
            }}
          >
            {focusButtonLabel}
          </Button>
        </>
      );
    };
    const { getByRole } = renderWithTheme(<Example />);

    const button = getByRole('button', { name: label });
    const buttonTrigger = getByRole('button', { name: focusButtonLabel });

    expect(button).not.toHaveFocus();

    fireEvent.click(buttonTrigger);
    expect(button).toHaveFocus();
  });

  it('should accept testID', () => {
    const buttonText = 'Pay Now';
    const { getByTestId } = renderWithTheme(<Button testID="button-test">{buttonText}</Button>);
    expect(getByTestId('button-test')).toBeInTheDocument();
  });

  it('should render button as link', () => {
    const { getByRole } = renderWithTheme(
      <Button href="https://youtu.be/iPaBUhIsslA" target="_blank" rel="noreferrer noopener">
        I am Anchor Tag!
      </Button>,
    );
    expect(getByRole('link').tagName).toBe('A');
    expect(getByRole('link')).toHaveAttribute('href', 'https://youtu.be/iPaBUhIsslA');
    expect(getByRole('link')).toHaveAttribute('target', '_blank');
    expect(getByRole('link')).toHaveAttribute('rel', 'noreferrer noopener');
  });

  it('should be able to override rel prop', () => {
    const { getByRole } = renderWithTheme(
      <Button href="https://youtu.be/iPaBUhIsslA" target="_blank" rel="noopener">
        I am Anchor Tag!
      </Button>,
    );
    expect(getByRole('link')).toHaveAttribute('rel', 'noopener');
  });
  it('should support data-analytics attribute ', () => {
    const buttonText = 'Pay Now';
    const { getByRole } = renderWithTheme(
      <Button data-analytics-button="pay-now">{buttonText}</Button>,
    );
    const button = getByRole('button');
    expect(button).toHaveAttribute('data-analytics-button', 'pay-now');
  });
});
