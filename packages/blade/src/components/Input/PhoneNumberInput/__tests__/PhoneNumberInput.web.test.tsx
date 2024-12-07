import userEvent from '@testing-library/user-event';
import { useRef } from 'react';
import { PhoneNumberInput } from '..';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';
import { Button } from '~components/Button';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<PhoneNumberInput />', () => {
  it('should render', () => {
    const { container } = renderWithTheme(<PhoneNumberInput label="Enter phone number" />);

    expect(container).toMatchSnapshot();
  });

  it('should render large size', () => {
    const { container } = renderWithTheme(
      <PhoneNumberInput label="Enter phone number" size="large" />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should display success validation state', () => {
    const label = 'Enter phone number';
    const { getByText, getByLabelText } = renderWithTheme(
      <PhoneNumberInput
        label={label}
        validationState="success"
        successText="Success"
        helpText="Help"
        errorText="Error"
      />,
    );

    const input = getByLabelText(label);
    const successText = getByText('Success');

    expect(successText).toBeTruthy();
    expect(input).toHaveAccessibleDescription('Success');
    expect(input).toBeValid();
  });

  it('should display error validation state', () => {
    const label = 'Enter phone number';
    const { getByText, getByLabelText } = renderWithTheme(
      <PhoneNumberInput
        label={label}
        validationState="error"
        errorText="Error"
        helpText="Help"
        successText="Success"
      />,
    );

    const input = getByLabelText(label);
    const errorText = getByText('Error');

    expect(errorText).toBeTruthy();
    expect(input).toHaveAccessibleDescription('Error');
    expect(input).toBeInvalid();
  });

  it('should display help text', () => {
    const label = 'Enter phone number';
    const { getByText, getByLabelText } = renderWithTheme(
      <PhoneNumberInput label={label} errorText="Error" helpText="Help" successText="Success" />,
    );

    const input = getByLabelText(label);
    const HelpText = getByText('Help');

    expect(HelpText).toBeTruthy();
    expect(input).toHaveAccessibleDescription('Help');
    expect(input).toBeValid();
  });

  it.skip('should pass a11y', async () => {
    const { getByLabelText } = renderWithTheme(
      <PhoneNumberInput
        label="Enter phone number"
        isRequired
        defaultValue="1234567890"
        validationState="none"
      />,
    );

    // A phone field can't be a textbox. There is currently no role for phone https://github.com/w3c/aria/issues/935
    const input = getByLabelText('Enter phone number');
    expect(input).toBeRequired();
    expect(input).toBeValid();
    expect(input).toBeEnabled();

    await assertAccessible(input);
  });

  // Skipped because flaky
  it.skip(`should expose native element methods via ref`, async () => {
    const label = 'Enter phone number';

    const Example = (): React.ReactElement => {
      const ref = useRef<HTMLInputElement>(null);

      return (
        <>
          <PhoneNumberInput ref={ref} label={label} />
          <Button
            onClick={() => {
              ref.current?.focus();
            }}
          >
            Focus
          </Button>
        </>
      );
    };
    const { getByLabelText, getByRole } = renderWithTheme(<Example />);

    const input = getByLabelText(label);
    const button = getByRole('button', { name: 'Focus' });

    expect(input).not.toHaveFocus();

    await userEvent.click(button);
    expect(input).toHaveFocus();
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <PhoneNumberInput label="Enter phone number" testID="phone-input-test" />,
    );

    expect(getByTestId('phone-input-test')).toBeTruthy();
  });
  it('should accept data-analytics attributes', () => {
    const { container } = renderWithTheme(
      <PhoneNumberInput
        label="Enter phone number"
        data-analytics-name="phone-input"
        data-analytics-value="phone-input-value"
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
