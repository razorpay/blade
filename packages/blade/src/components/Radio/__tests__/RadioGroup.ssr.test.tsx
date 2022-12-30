import React from 'react';
import renderWithSSR from '../../../_helpers/testing/renderWithSSR.web';
import { Radio } from '../Radio';
import { RadioGroup } from '../RadioGroup/RadioGroup';

describe('<RadioGroup />', () => {
  it('should render with help text', () => {
    const labelText = 'Select fruit';
    const helpText = 'Select one';
    const { container } = renderWithSSR(
      <RadioGroup helpText={helpText} label={labelText}>
        <Radio value="apple">Apple</Radio>
        <Radio value="mango">Mango</Radio>
        <Radio value="orange">Orange</Radio>
      </RadioGroup>,
    );
    // expect(getByRole('group', { name: labelText })).toBeInTheDocument();
    // @TODO: help and label are creating issues since its read as one
    // expect(getByText(helpText)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
