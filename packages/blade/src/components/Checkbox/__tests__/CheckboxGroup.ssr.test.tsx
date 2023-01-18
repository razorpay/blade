import React from 'react';
import renderWithSSR from '../../../_helpers/testing/renderWithSSR.web';
import { Checkbox } from '../Checkbox';
import { CheckboxGroup } from '../CheckboxGroup';

describe('<CheckboxGroup />', () => {
  it('should render errorText when validationState is set to error', () => {
    const labelText = 'Select fruits';
    const helpText = 'Select one';
    const errorText = 'Invalid selection';

    const { container, getAllByRole, queryByText } = renderWithSSR(
      <CheckboxGroup
        helpText={helpText}
        errorText={errorText}
        label={labelText}
        validationState="error"
      >
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="mango">Mango</Checkbox>
        <Checkbox value="orange">Orange</Checkbox>
      </CheckboxGroup>,
    );

    expect(queryByText(helpText)).not.toBeInTheDocument();
    expect(queryByText(errorText)).toBeInTheDocument();
    getAllByRole('checkbox').forEach((checkbox) => {
      expect(checkbox).toBeInvalid();
    });
    expect(container).toMatchSnapshot();
  });
});
