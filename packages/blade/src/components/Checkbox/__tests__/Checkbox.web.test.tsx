/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import userEvents from '@testing-library/user-event';
import React from 'react';
import renderWithTheme from '../../../_helpers/testing/renderWithTheme.web';
import { Checkbox } from '../Checkbox';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Checkbox />', () => {
  it('should render checkbox with label', () => {
    const labelText = 'Remember password';
    const { container, getByText, getByRole } = renderWithTheme(<Checkbox>{labelText}</Checkbox>);
    expect(container).toMatchSnapshot();
    expect(getByRole('checkbox', { hidden: true })).toBeInTheDocument();
    expect(getByText(labelText)).toBeInTheDocument();
  });

  it('should render helpText', () => {
    const labelText = 'Remember password';
    const helpText = 'This has to be checked';
    const { getByText } = renderWithTheme(<Checkbox helpText={helpText}>{labelText}</Checkbox>);
    expect(getByText(helpText)).toBeInTheDocument();
  });

  it('should render helpText', () => {
    const labelText = 'Remember password';
    const helpText = 'This has to be checked';
    const { getByText } = renderWithTheme(<Checkbox helpText={helpText}>{labelText}</Checkbox>);
    expect(getByText(helpText)).toBeInTheDocument();
  });

  it('should set error state with validationState', () => {
    const labelText = 'Remember password';
    const { container, getByRole } = renderWithTheme(
      <Checkbox validationState="error">{labelText}</Checkbox>,
    );
    expect(container).toMatchSnapshot();
    expect(getByRole('checkbox', { hidden: true })).toBeInvalid();
  });

  it('should set disabled state with isDisabled', () => {
    const labelText = 'Remember password';
    const { container, getByRole } = renderWithTheme(<Checkbox isDisabled>{labelText}</Checkbox>);
    expect(container).toMatchSnapshot();
    expect(getByRole('checkbox', { hidden: true })).toBeDisabled();
  });

  test('user should be able to toggle checkbox', async () => {
    const user = userEvents.setup();
    const labelText = 'Remember password';
    const { getByRole, getByLabelText } = renderWithTheme(<Checkbox>{labelText}</Checkbox>);

    expect(getByRole('checkbox', { hidden: true })).not.toBeChecked();
    await user.click(getByLabelText(labelText));
    expect(getByRole('checkbox', { hidden: true })).toBeChecked();
    await user.click(getByLabelText(labelText));
    expect(getByRole('checkbox', { hidden: true })).not.toBeChecked();
  });

  test('user should be able to toggle checkbox with keyboard', async () => {
    const user = userEvents.setup();
    const labelText = 'Remember password';
    const { getByRole } = renderWithTheme(<Checkbox>{labelText}</Checkbox>);

    expect(getByRole('checkbox', { hidden: true })).not.toBeChecked();
    await user.tab();
    expect(getByRole('checkbox', { hidden: true })).toHaveFocus();
    await user.keyboard('[Space]');
    expect(getByRole('checkbox', { hidden: true })).toBeChecked();
    await user.keyboard('[Space]');
    expect(getByRole('checkbox', { hidden: true })).not.toBeChecked();
  });

  it('should be able checked by default when using defaultChecked', () => {
    const labelText = 'Remember password';
    const { getByRole } = renderWithTheme(<Checkbox defaultChecked>{labelText}</Checkbox>);

    expect(getByRole('checkbox', { hidden: true })).toBeChecked();
  });

  it('should support isChecked prop', async () => {
    const user = userEvents.setup();
    const labelText = 'Remember password';
    const { getByRole, getByLabelText } = renderWithTheme(
      <Checkbox isChecked>{labelText}</Checkbox>,
    );

    expect(getByRole('checkbox', { hidden: true })).toBeChecked();
    // should not toggle
    await user.click(getByLabelText(labelText));
    expect(getByRole('checkbox', { hidden: true })).toBeChecked();
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

    expect(getByRole('checkbox', { hidden: true })).toBeChecked();
    expect(checkFn).not.toBeCalled();
    await user.click(getByLabelText(labelText));
    expect(getByRole('checkbox', { hidden: true })).not.toBeChecked();
    expect(checkFn).toBeCalledWith(false);
    await user.click(getByLabelText(labelText));
    expect(getByRole('checkbox', { hidden: true })).toBeChecked();
    expect(checkFn).toBeCalledWith(true);
  });

  it('should support controlled state', async () => {
    const user = userEvents.setup();
    const labelText = 'Remember password';
    const Example = () => {
      const [checked, setChecked] = React.useState(false);
      return (
        <>
          <Checkbox isChecked={checked} onChange={setChecked}>
            {labelText}
          </Checkbox>
          <p data-testid="state">{checked ? 'checked' : 'unchecked'}</p>
        </>
      );
    };
    const { getByTestId, getByLabelText } = renderWithTheme(<Example />);

    expect(getByTestId('state')).toHaveTextContent('unchecked');
    await user.click(getByLabelText(labelText));
    expect(getByTestId('state')).toHaveTextContent('checked');
    await user.click(getByLabelText(labelText));
    expect(getByTestId('state')).toHaveTextContent('unchecked');
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
      (getByRole('checkbox', { hidden: true }) as HTMLInputElement).indeterminate,
    ).toBeTruthy();
  });
});
