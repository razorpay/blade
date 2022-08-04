/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import userEvents from '@testing-library/user-event';
import React from 'react';
import { Radio } from '../Radio';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';
import { Button } from '~components/Button';

describe('<Radio />', () => {
  it('should render radio with label', () => {
    const labelText = 'Select fruit';
    const { container, getByText, getByRole } = renderWithTheme(<Radio>{labelText}</Radio>);
    expect(container).toMatchSnapshot();
    expect(getByRole('radio', { hidden: true })).toBeInTheDocument();
    expect(getByText(labelText)).toBeInTheDocument();
  });

  it('should render helpText', () => {
    const labelText = 'Select fruit';
    const helpText = 'This has to be checked';
    const { getByText } = renderWithTheme(<Radio helpText={helpText}>{labelText}</Radio>);
    expect(getByText(helpText)).toBeInTheDocument();
  });

  it('should set error state with validationState', () => {
    const labelText = 'Select fruit';
    const { container, getByRole } = renderWithTheme(
      <Radio validationState="error">{labelText}</Radio>,
    );
    expect(container).toMatchSnapshot();
    expect(getByRole('radio', { hidden: true })).toBeInvalid();
  });

  it('should set disabled state with isDisabled', () => {
    const labelText = 'Select fruit';
    const { container, getByRole } = renderWithTheme(<Radio isDisabled>{labelText}</Radio>);
    expect(container).toMatchSnapshot();
    expect(getByRole('radio', { hidden: true })).toBeDisabled();
  });

  test('user should be able set checked state', async () => {
    const user = userEvents.setup();
    const labelText = 'Select fruit';
    const { getByRole, getByLabelText } = renderWithTheme(<Radio>{labelText}</Radio>);

    expect(getByRole('radio', { hidden: true })).not.toBeChecked();
    await user.click(getByLabelText(labelText));
    expect(getByRole('radio', { hidden: true })).toBeChecked();
    await user.click(getByLabelText(labelText));
    expect(getByRole('radio', { hidden: true })).toBeChecked();
  });

  test('user should be able to set checked state with keyboard', async () => {
    const user = userEvents.setup();
    const labelText = 'Select fruit';
    const { getByRole } = renderWithTheme(<Radio>{labelText}</Radio>);

    expect(getByRole('radio', { hidden: true })).not.toBeChecked();
    await user.tab();
    expect(getByRole('radio', { hidden: true })).toHaveFocus();
    await user.keyboard('[Space]');
    expect(getByRole('radio', { hidden: true })).toBeChecked();
    await user.keyboard('[Space]');
    expect(getByRole('radio', { hidden: true })).toBeChecked();
  });

  it('should set defaultChecked', () => {
    const labelText = 'Select fruit';
    const { getByRole } = renderWithTheme(<Radio defaultChecked>{labelText}</Radio>);

    expect(getByRole('radio', { hidden: true })).toBeChecked();
  });

  it('should support isChecked prop', async () => {
    const user = userEvents.setup();
    const labelText = 'Select fruit';
    const { getByRole, getByLabelText } = renderWithTheme(<Radio isChecked>{labelText}</Radio>);

    expect(getByRole('radio', { hidden: true })).toBeChecked();
    // should not toggle
    await user.click(getByLabelText(labelText));
    expect(getByRole('radio', { hidden: true })).toBeChecked();
  });

  it('should support uncontrolled state', async () => {
    const user = userEvents.setup();
    const checkFn = jest.fn();
    const labelText = 'Select fruit';
    const { getByRole, getByLabelText } = renderWithTheme(
      <Radio defaultChecked={false} onChange={checkFn} value="apple">
        {labelText}
      </Radio>,
    );

    expect(getByRole('radio', { hidden: true })).not.toBeChecked();
    expect(checkFn).not.toBeCalled();
    await user.click(getByLabelText(labelText));
    expect(getByRole('radio', { hidden: true })).toBeChecked();
    expect(checkFn).toBeCalledWith(
      expect.objectContaining({
        isChecked: true,
        value: 'apple',
      }),
    );
    expect(checkFn.mock.calls[0][0].event).not.toBeUndefined();
  });

  it('should support controlled state', async () => {
    const user = userEvents.setup();
    const labelText = 'Select fruit';
    const Example = () => {
      const [checked, setChecked] = React.useState(false);
      return (
        <>
          <Radio isChecked={checked} onChange={({ isChecked }) => setChecked(isChecked)}>
            {labelText}
          </Radio>
          <Button onClick={() => setChecked((prev) => !prev)}>toggle</Button>
          <p data-testid="state">{checked ? 'checked' : 'unchecked'}</p>
        </>
      );
    };
    const { getByTestId, getByRole } = renderWithTheme(<Example />);

    expect(getByTestId('state')).toHaveTextContent('unchecked');
    await user.click(getByRole('button'));
    expect(getByTestId('state')).toHaveTextContent('checked');
    await user.click(getByRole('button'));
    expect(getByTestId('state')).toHaveTextContent('unchecked');
  });
});
