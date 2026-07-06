/* eslint-disable @typescript-eslint/no-empty-function */
import userEvent from '@testing-library/user-event';
import { AppBar, AppBarActions, AppBarLeading } from '../AppBar';
import { AppBarExample } from './AppBarExample';
import renderWithTheme from '~utils/testing/renderWithTheme';
import assertAccessible from '~utils/testing/assertAccessible';
import { IconButton } from '~components/Button/IconButton';
import { BellIcon, RazorpayIcon, UserIcon } from '~components/Icons';

describe('<AppBar />', () => {
  it('should render', () => {
    const { container } = renderWithTheme(<AppBarExample />);
    expect(container).toMatchSnapshot();
  });

  it('should pass general a11y', async () => {
    const { container } = renderWithTheme(<AppBarExample />);
    await assertAccessible(container);
  });

  it('should support data-analytics attributes', () => {
    const { getByTestId } = renderWithTheme(<AppBarExample />);
    const appBar = getByTestId('appbar-demo');
    expect(appBar).toHaveAttribute('data-analytics-appbar', 'demo');
  });

  it('should support testID', () => {
    const { getByTestId } = renderWithTheme(<AppBarExample />);
    expect(getByTestId('appbar-demo')).toBeInTheDocument();
  });

  it('should render the back button and call onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <AppBar backButton={{ onClick, accessibilityLabel: 'Go back' }}>
        <AppBarLeading title="Order details" />
      </AppBar>,
    );

    const backButton = getByLabelText('Go back');
    await user.click(backButton);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should not render a back button when `backButton` is not passed', () => {
    const { queryByLabelText } = renderWithTheme(
      <AppBar>
        <AppBarLeading title="Order details" />
      </AppBar>,
    );
    expect(queryByLabelText('Go back')).not.toBeInTheDocument();
  });

  it('should render with variant="neutral" (default) applying static black background', () => {
    const { container } = renderWithTheme(
      <AppBar variant="neutral">
        <AppBarLeading title="Order details" />
      </AppBar>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render with variant="subtle"', () => {
    const { container } = renderWithTheme(
      <AppBar variant="subtle">
        <AppBarLeading title="Order details" />
      </AppBar>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render AppBarLeading with logo and full trust badge', () => {
    const { container } = renderWithTheme(
      <AppBar>
        <AppBarLeading
          logo={<RazorpayIcon size="large" color="surface.icon.staticWhite.normal" />}
          trustBadge={{ variant: 'full' }}
        />
      </AppBar>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render AppBarLeading with title and full trust badge', () => {
    const { container, getByText } = renderWithTheme(
      <AppBar>
        <AppBarLeading title="Mavenshop" trustBadge={{ variant: 'full' }} />
      </AppBar>,
    );
    expect(getByText('Mavenshop')).toBeInTheDocument();
    expect(getByText('Razorpay Trusted Business')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render AppBarLeading with title and icon-only trust badge', () => {
    const { container, getByText, getByLabelText } = renderWithTheme(
      <AppBar>
        <AppBarLeading title="Mavenshop" trustBadge={{ variant: 'icon-only' }} />
      </AppBar>,
    );
    expect(getByText('Mavenshop')).toBeInTheDocument();
    expect(getByLabelText('Razorpay Trusted Business')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render AppBarActions children', () => {
    const { getByLabelText } = renderWithTheme(
      <AppBar>
        <AppBarLeading title="Mavenshop" />
        <AppBarActions>
          <IconButton icon={UserIcon} accessibilityLabel="Profile" onClick={() => {}} />
          <IconButton icon={BellIcon} accessibilityLabel="Notifications" onClick={() => {}} />
        </AppBarActions>
      </AppBar>,
    );
    expect(getByLabelText('Profile')).toBeInTheDocument();
    expect(getByLabelText('Notifications')).toBeInTheDocument();
  });

  it('should let an explicit backgroundColor override the variant', () => {
    const { container } = renderWithTheme(
      <AppBar variant="neutral" backgroundColor="surface.background.gray.intense">
        <AppBarLeading title="Order details" />
      </AppBar>,
    );
    expect(container).toMatchSnapshot();
  });
});
