import React from 'react';
import { Radio } from '../Radio';
import { RadioGroup } from '../RadioGroup/RadioGroup';
import renderWithSSR from '~src/_helpers/testing/renderWithSSR.web';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Radio />', () => {
  it('should render with help text', () => {
    const labelText = 'Select fruit';
    const helpText = 'This has to be checked';
    const { container, getByText, getByRole } = renderWithSSR(
      <RadioGroup label={labelText}>
        <Radio value="apple" helpText={helpText}>
          Apple
        </Radio>
        <Radio value="mango">Mango</Radio>
      </RadioGroup>,
    );
    //@TODO ask Anurag the reson behing that comma ","
    expect(getByRole('group', { name: labelText })).toBeInTheDocument();
    expect(getByText(helpText)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
