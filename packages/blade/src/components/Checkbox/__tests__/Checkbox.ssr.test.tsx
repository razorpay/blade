import React from 'react';
import { Checkbox } from '../Checkbox';
import renderWithSSR from '~src/_helpers/testing/renderWithSSR.web';

describe('<Checkbox />', () => {
  it('should render checkbox with error validationState', () => {
    const labelText = 'Remember password';
    const errorText = 'This has to be checked';
    const { container, getByRole, getByText } = renderWithSSR(
      <Checkbox validationState="error" errorText={errorText} defaultChecked>
        {labelText}
      </Checkbox>,
    );
    expect(getByText(errorText)).toBeInTheDocument();
    expect(getByRole('checkbox', { name: labelText })).toBeInvalid();
    expect(getByRole('checkbox', { name: labelText })).toBeChecked();
    expect(container).toMatchSnapshot();
  });
});
