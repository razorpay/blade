import { fireEvent } from '@testing-library/react';
import BaseLink from '../BaseLink';
import assertAccessible from '~src/_helpers/testing/assertAccessible.web';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';
import { InfoIcon } from '~components/Icons';
import { paymentTheme } from '~tokens/theme';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<BaseLink />', () => {
  it('should render link with default properties', () => {
    const linkText = 'Learn More';
    const { container, getByText, getByRole } = renderWithTheme(<BaseLink>{linkText}</BaseLink>);
    expect(container).toMatchSnapshot();
    expect(getByRole('link')).toBeInTheDocument();
    expect(getByText('Learn More')).toBeInTheDocument();
  });

  it('should render link with an href, target, rel, and title', () => {
    const linkText = 'Learn More';
    const { getByRole } = renderWithTheme(
      // nosemgrep
      <BaseLink href="https://www.google.com/" target="_blank" rel="noreferrer" htmlTitle="Google">
        {linkText}
      </BaseLink>,
    );
    expect(getByRole('link')).toHaveAttribute('href', 'https://www.google.com/');
    expect(getByRole('link')).toHaveAttribute('target', '_blank');
    expect(getByRole('link')).toHaveAttribute('rel', 'noreferrer');
    expect(getByRole('link')).toHaveAttribute('title', 'Google');
  });

  it('should render link with a default rel set when target is _blank', () => {
    const linkText = 'Learn More';
    const { getByRole } = renderWithTheme(
      // nosemgrep
      <BaseLink href="https://www.google.com/" target="_blank">
        {linkText}
      </BaseLink>,
    );
    expect(getByRole('link')).toHaveAttribute('href', 'https://www.google.com/');
    expect(getByRole('link')).toHaveAttribute('target', '_blank');
    expect(getByRole('link')).toHaveAttribute('rel', 'noreferrer noopener');
  });

  it('should throw an error when there is no icon or text passed to the link', () => {
    try {
      // @ts-expect-error testing failure case when there is no icon or text passed
      renderWithTheme(<BaseLink />);
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual(
          `[Blade: BaseLink]: At least one of icon or text is required to render a link.`,
        );
      }
    }
  });

  it('should render icon only link', () => {
    const { container } = renderWithTheme(<BaseLink icon={InfoIcon} />);
    expect(container).toMatchSnapshot();
  });

  it('should render link with icon with default iconPosition', () => {
    const linkText = 'Learn More';
    const { container } = renderWithTheme(<BaseLink icon={InfoIcon}>{linkText}</BaseLink>);
    expect(container).toMatchSnapshot();
  });

  it('should render link with icon with left iconPosition', () => {
    const linkText = 'Learn More';
    const { container } = renderWithTheme(
      <BaseLink iconPosition="left" icon={InfoIcon}>
        {linkText}
      </BaseLink>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render link with icon with right iconPosition', () => {
    const linkText = 'Learn More';
    const { container } = renderWithTheme(
      <BaseLink iconPosition="right" icon={InfoIcon}>
        {linkText}
      </BaseLink>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render button variant of link', () => {
    const linkText = 'Learn More';
    const { container, getByRole } = renderWithTheme(
      <BaseLink variant="button">{linkText}</BaseLink>,
    );
    expect(getByRole('button')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render disabled button variant of link', () => {
    const linkText = 'Learn More';
    const { container, getByRole } = renderWithTheme(
      <BaseLink variant="button" isDisabled={true}>
        {linkText}
      </BaseLink>,
    );
    expect(container).toMatchSnapshot();
    expect(getByRole('button')).toBeDisabled();
  });

  it('should call function on click of link with event callback', () => {
    const linkText = 'Learn More';
    const onClick = jest.fn();
    const { getByRole } = renderWithTheme(<BaseLink onClick={onClick}>{linkText}</BaseLink>);
    const button = getByRole('link');
    fireEvent(
      button,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        screenX: 20,
        screenY: 20,
      }),
    );
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toBeCalledWith(
      expect.objectContaining({
        bubbles: true,
        cancelable: true,
        screenX: 20,
        screenY: 20,
      }),
    );
  });

  it('should change the link to a visited state after click', () => {
    const linkText = 'Learn More';
    const { container, getByRole } = renderWithTheme(
      <BaseLink
        variant="anchor"
        href="https://github.com/razorpay/blade"
        target="_blank"
        rel="noreferrer noopener"
      >
        {linkText}
      </BaseLink>,
    );
    const link = getByRole('link');
    fireEvent.click(link);
    expect(container).toMatchSnapshot();
  });

  it('should not change the button to a visited state after click', () => {
    const linkText = 'Learn More';
    const onClick = jest.fn();
    const { container, getByRole } = renderWithTheme(
      <BaseLink variant="button" onClick={onClick}>
        {linkText}
      </BaseLink>,
    );
    const button = getByRole('button');
    fireEvent.click(button);
    expect(container).toMatchSnapshot();
  });

  it('should render positive intent low contrast link', () => {
    const linkText = 'Learn More';
    const { container } = renderWithTheme(
      <BaseLink intent="positive" contrast="low">
        {linkText}
      </BaseLink>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render disabled positive intent low contrast link', () => {
    const linkText = 'Learn More';
    const { container } = renderWithTheme(
      <BaseLink intent="positive" contrast="low" isDisabled={true}>
        {linkText}
      </BaseLink>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render positive intent high contrast link', () => {
    const linkText = 'Learn More';
    const { container } = renderWithTheme(
      <BaseLink intent="positive" contrast="high">
        {linkText}
      </BaseLink>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render disabled positive intent high contrast link', () => {
    const linkText = 'Learn More';
    const { container } = renderWithTheme(
      <BaseLink intent="positive" contrast="high" isDisabled={true}>
        {linkText}
      </BaseLink>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render negative intent low contrast link', () => {
    const linkText = 'Learn More';
    const { container } = renderWithTheme(
      <BaseLink intent="negative" contrast="low">
        {linkText}
      </BaseLink>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render disabled negative intent low contrast link', () => {
    const linkText = 'Learn More';
    const { container } = renderWithTheme(
      <BaseLink intent="negative" contrast="low" isDisabled={true}>
        {linkText}
      </BaseLink>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render negative intent high contrast link', () => {
    const linkText = 'Learn More';
    const { container } = renderWithTheme(
      <BaseLink intent="negative" contrast="high">
        {linkText}
      </BaseLink>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render disabled negative intent high contrast link', () => {
    const linkText = 'Learn More';
    const { container } = renderWithTheme(
      <BaseLink intent="negative" contrast="high" isDisabled={true}>
        {linkText}
      </BaseLink>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render information intent low contrast link', () => {
    const linkText = 'Learn More';
    const { container } = renderWithTheme(
      <BaseLink intent="information" contrast="low">
        {linkText}
      </BaseLink>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render disabled information intent low contrast link', () => {
    const linkText = 'Learn More';
    const { container } = renderWithTheme(
      <BaseLink intent="information" contrast="low" isDisabled={true}>
        {linkText}
      </BaseLink>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render information intent high contrast link', () => {
    const linkText = 'Learn More';
    const { container } = renderWithTheme(
      <BaseLink intent="information" contrast="high">
        {linkText}
      </BaseLink>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render disabled information intent high contrast link', () => {
    const linkText = 'Learn More';
    const { container } = renderWithTheme(
      <BaseLink intent="information" contrast="high" isDisabled={true}>
        {linkText}
      </BaseLink>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render notice intent low contrast link', () => {
    const linkText = 'Learn More';
    const { container } = renderWithTheme(
      <BaseLink intent="notice" contrast="low">
        {linkText}
      </BaseLink>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render disabled notice intent low contrast link', () => {
    const linkText = 'Learn More';
    const { container } = renderWithTheme(
      <BaseLink intent="notice" contrast="low" isDisabled={true}>
        {linkText}
      </BaseLink>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render notice intent high contrast link', () => {
    const linkText = 'Learn More';
    const { container } = renderWithTheme(
      <BaseLink intent="notice" contrast="high">
        {linkText}
      </BaseLink>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render disabled notice intent high contrast link', () => {
    const linkText = 'Learn More';
    const { container } = renderWithTheme(
      <BaseLink intent="notice" contrast="high" isDisabled={true}>
        {linkText}
      </BaseLink>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render neutral intent low contrast link', () => {
    const linkText = 'Learn More';
    const { container } = renderWithTheme(
      <BaseLink intent="neutral" contrast="low">
        {linkText}
      </BaseLink>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render disabled neutral intent low contrast link', () => {
    const linkText = 'Learn More';
    const { container } = renderWithTheme(
      <BaseLink intent="neutral" contrast="low" isDisabled={true}>
        {linkText}
      </BaseLink>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render neutral intent high contrast link', () => {
    const linkText = 'Learn More';
    const { container } = renderWithTheme(
      <BaseLink intent="neutral" contrast="high">
        {linkText}
      </BaseLink>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render disabled neutral intent high contrast link', () => {
    const linkText = 'Learn More';
    const { container } = renderWithTheme(
      <BaseLink intent="neutral" contrast="high" isDisabled={true}>
        {linkText}
      </BaseLink>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should have accessibilityLabel', () => {
    const LinkText = 'Learn More';
    const { getByRole } = renderWithTheme(
      <BaseLink accessibilityLabel="Info" icon={InfoIcon}>
        {LinkText}
      </BaseLink>,
    );
    expect(getByRole('link')).toHaveAccessibleName('Info');
  });

  it('should not have accessibility violations with anchor variant', async () => {
    const linkText = 'Learn more';
    const { container } = renderWithTheme(<BaseLink variant="anchor">{linkText}</BaseLink>);
    await assertAccessible(container);
  });

  it('should not have accessibility violations with button variant', async () => {
    const linkText = 'Learn more';
    const { container } = renderWithTheme(<BaseLink variant="button">{linkText}</BaseLink>);
    await assertAccessible(container);
  });

  it('should accept testID', () => {
    const linkText = 'Learn More';
    const { getByTestId } = renderWithTheme(
      <BaseLink testID="base-link-test">{linkText}</BaseLink>,
    );
    expect(getByTestId('base-link-test')).toBeTruthy();
  });

  it('should handle styles for all interactions', () => {
    const textContent = 'Slash';
    const { getByText } = renderWithTheme(<BaseLink variant="button">{textContent}</BaseLink>);

    // default state
    const linkButtonText = getByText(textContent);
    expect(linkButtonText).toHaveStyle({
      color: paymentTheme.colors.onLight.action.text.link.default,
    });

    // click and focus
    fireEvent.focus(linkButtonText);
    expect(linkButtonText).toHaveStyle({
      color: paymentTheme.colors.onLight.action.text.link.focus,
    });

    // click outside
    fireEvent.focusOut(linkButtonText);
    expect(linkButtonText).toHaveStyle({
      color: paymentTheme.colors.onLight.action.text.link.default,
    });
  });
});
