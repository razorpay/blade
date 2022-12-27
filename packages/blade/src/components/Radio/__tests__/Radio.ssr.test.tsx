import React from 'react';
import { Radio } from '../Radio';
import { RadioGroup } from '../RadioGroup/RadioGroup';
import renderWithSSR from '~src/_helpers/testing/renderWithSSR.web';

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
    //@TODO ask Anurag the reson behing that comma ","
    expect(getByRole('group', { name: labelText })).toBeInTheDocument();
    expect(getByText(/Apple Help/)).toBeInTheDocument();
    expect(getByText(/Select One/)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
