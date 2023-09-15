import React from 'react';
import { Radio } from '../Radio';
import { RadioGroup } from '../RadioGroup/RadioGroup';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Radio />', () => {
  it('should render with help text', () => {
    const labelText = 'Select fruit';
    const radioHelpText = 'Apple Help';
    const radioGroupHelpText = 'Select One';
    const { container, getByText, getByRole } = renderWithSSR(
      <RadioGroup label={labelText} helpText={radioGroupHelpText}>
        <Radio value="apple" helpText={radioHelpText}>
          Apple
        </Radio>
        <Radio value="mango">Mango</Radio>
      </RadioGroup>,
    );
    expect(getByRole('radiogroup')).toBeInTheDocument();
    expect(getByText(radioHelpText)).toBeInTheDocument();
    expect(getByText(radioGroupHelpText)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
