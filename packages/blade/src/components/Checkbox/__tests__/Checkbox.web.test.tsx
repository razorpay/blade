/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import userEvents from '@testing-library/user-event';
import React from 'react';
import { Checkbox } from '../Checkbox';
import { Link } from '~components/Link';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Button } from '~components/Button';

describe('<Checkbox />', () => {
  it('should render checkbox with label', () => {
    const label = (
      <>
        I accept <Link href="#">Terms and Conditions</Link>
      </>
    );

    const { container, getByRole } = renderWithTheme(<Checkbox>{label}</Checkbox>);
    expect(container).toMatchSnapshot();
    expect(getByRole('checkbox')).toBeInTheDocument();
  });

  it('should render helpText', () => {
    const labelText = 'Remember password';
    const helpText = 'This has to be checked';
    const { getByText } = renderWithTheme(<Checkbox helpText={helpText}>{labelText}</Checkbox>);
    expect(getByText(helpText)).toBeInTheDocument();
  });

  it('should set error state with validationState', () => {
    const labelText = 'Remember password';
    const errorText = 'This has to be checked';
    const { container, getByRole, getByText } = renderWithTheme(
      <Checkbox validationState="error" errorText={errorText}>
        {labelText}
      </Checkbox>,
    );
    expect(container).toMatchSnapshot();
    expect(getByText(errorText)).toBeInTheDocument();
    expect(getByRole('checkbox', { name: labelText })).toBeInvalid();
  });

  it('should set disabled state with isDisabled', () => {
    const labelText = 'Remember password';
    const { container, getByRole } = renderWithTheme(<Checkbox isDisabled>{labelText}</Checkbox>);
    expect(container).toMatchSnapshot();
    expect(getByRole('checkbox', { name: labelText })).toBeDisabled();
  });

  test('user should be able to toggle checkbox', async () => {
    const user = userEvents.setup();
    const labelText = 'Remember password';
    const { getByRole, getByLabelText } = renderWithTheme(<Checkbox>{labelText}</Checkbox>);

    expect(getByRole('checkbox', { name: labelText })).not.toBeChecked();
    await user.click(getByLabelText(labelText));
    expect(getByRole('checkbox', { name: labelText })).toBeChecked();
    await user.click(getByLabelText(labelText));
    expect(getByRole('checkbox', { name: labelText })).not.toBeChecked();
  });

  test('user should be able to toggle checkbox with keyboard', async () => {
    const user = userEvents.setup();
    const labelText = 'Remember password';
    const { getByRole } = renderWithTheme(<Checkbox>{labelText}</Checkbox>);

    expect(getByRole('checkbox', { name: labelText })).not.toBeChecked();
    await user.tab();
    expect(getByRole('checkbox', { name: labelText })).toHaveFocus();
    await user.keyboard('[Space]');
    expect(getByRole('checkbox', { name: labelText })).toBeChecked();
    await user.keyboard('[Space]');
    expect(getByRole('checkbox', { name: labelText })).not.toBeChecked();
  });

  it('should set defaultChecked', () => {
    const labelText = 'Remember password';
    const { getByRole } = renderWithTheme(<Checkbox defaultChecked>{labelText}</Checkbox>);

    expect(getByRole('checkbox', { name: labelText })).toBeChecked();
  });

  it('should support isChecked prop', async () => {
    const user = userEvents.setup();
    const labelText = 'Remember password';
    const { getByRole, getByLabelText } = renderWithTheme(
      <Checkbox isChecked>{labelText}</Checkbox>,
    );

    expect(getByRole('checkbox', { name: labelText })).toBeChecked();
    // should not toggle
    await user.click(getByLabelText(labelText));
    expect(getByRole('checkbox', { name: labelText })).toBeChecked();
  });

  it('should support uncontrolled state', async () => {
    const user = userEvents.setup();
    const checkFn = jest.fn();
    const labelText = 'Remember password';
    const { getByRole, getByLabelText } = renderWithTheme(
      <Checkbox defaultChecked={true} onChange={checkFn}>
        {labelText}
      </Checkbox>,
    );

    expect(getByRole('checkbox', { name: labelText })).toBeChecked();
    expect(checkFn).not.toBeCalled();
    await user.click(getByLabelText(labelText));
    expect(getByRole('checkbox', { name: labelText })).not.toBeChecked();
    expect(checkFn).toBeCalledWith(
      expect.objectContaining({
        isChecked: false,
        value: undefined,
      }),
    );
    expect(checkFn.mock.calls[0][0].event).not.toBeUndefined();
    await user.click(getByLabelText(labelText));
    expect(getByRole('checkbox', { name: labelText })).toBeChecked();
    expect(checkFn).toBeCalledWith(
      expect.objectContaining({
        isChecked: true,
        value: undefined,
      }),
    );
    expect(checkFn.mock.calls[1][0].event).not.toBeUndefined();
  });

  it('should support controlled state', async () => {
    const user = userEvents.setup();
    const labelText = 'Remember password';
    const Example = () => {
      const [checked, setChecked] = React.useState(false);
      return (
        <>
          <Checkbox isChecked={checked} onChange={({ isChecked }) => setChecked(isChecked)}>
            {labelText}
          </Checkbox>
          <p>{checked ? 'checked' : 'unchecked'}</p>
        </>
      );
    };
    const { getByText, getByLabelText } = renderWithTheme(<Example />);

    expect(getByText('unchecked')).toBeInTheDocument();
    await user.click(getByLabelText(labelText));
    expect(getByText('checked')).toBeInTheDocument();
    await user.click(getByLabelText(labelText));
    expect(getByText('unchecked')).toBeInTheDocument();
  });

  it('should set to indeterminate state of checkbox', () => {
    const labelText = 'Remember password';
    const { container, getByRole } = renderWithTheme(
      <Checkbox defaultChecked isIndeterminate>
        {labelText}
      </Checkbox>,
    );

    expect(container).toMatchSnapshot();
    expect(
      (getByRole('checkbox', { name: labelText }) as HTMLInputElement).indeterminate,
    ).toBeTruthy();
  });

  it(`should expose native element methods via ref`, async () => {
    const label = 'Accept';
    const focusButtonLabel = 'Focus';

    const Example = (): React.ReactElement => {
      const ref = React.useRef<HTMLInputElement>(null);

      return (
        <>
          <Checkbox ref={ref}>{label}</Checkbox>
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
    const { getByLabelText, getByRole } = renderWithTheme(<Example />);

    const input = getByLabelText(label);
    const button = getByRole('button', { name: focusButtonLabel });

    expect(input).not.toHaveFocus();
    expect(input).toHaveAttribute('type', 'checkbox');

    await userEvents.click(button);
    expect(input).toHaveFocus();
  });

  it('should accept testID', () => {
    const labelText = 'Remember password';
    const { getByTestId } = renderWithTheme(
      <Checkbox testID="checkbox-test">{labelText}</Checkbox>,
    );
    expect(getByTestId('checkbox-test')).toBeTruthy();
  });
  it('should accept data-analytics attributes', () => {
    const labelText = 'Remember password';
    const { container } = renderWithTheme(
      <Checkbox data-analytics-label="Remember password">{labelText}</Checkbox>,
    );
    expect(
      container.querySelector('[data-analytics-label="Remember password"]'),
    ).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
