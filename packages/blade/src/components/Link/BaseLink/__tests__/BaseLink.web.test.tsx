import { fireEvent } from '@testing-library/react';
import assertAccessible from '../../../../_helpers/testing/assertAccessible.web';
import renderWithTheme from '../../../../_helpers/testing/renderWithTheme.web';
import { InfoIcon } from '../../../Icons';
import BaseLink from '../BaseLink';

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

  it('should render link with an href, target and rel', () => {
    const linkText = 'Learn More';
    const { getByRole } = renderWithTheme(
      <BaseLink href="https://www.google.com/" target="_blank" rel="noreferrer noopener">
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

  it('should render link with icon without text', () => {
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
    const { container } = renderWithTheme(
      <BaseLink variant="button" isDisabled={true}>
        {linkText}
      </BaseLink>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should call function on click of button variant of link', () => {
    const linkText = 'Learn More';
    const onClick = jest.fn();
    const { getByRole } = renderWithTheme(
      <BaseLink variant="button" onClick={onClick}>
        {linkText}
      </BaseLink>,
    );
    const button = getByRole('button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
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
});
