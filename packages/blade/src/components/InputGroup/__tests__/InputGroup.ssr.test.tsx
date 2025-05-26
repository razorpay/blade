import React from 'react';
import { InputRow } from '../InputRow';
import renderWithSSR from '~utils/testing/renderWithSSR.web';
import { InputGroup } from '../';
import { TextInput } from '~components/Input/TextInput';
import { PasswordInput } from '~components/Input/PasswordInput';

describe('InputGroup', () => {
  it('should render Inputgroup with default properties', () => {
    const { container } = renderWithSSR(
      <InputGroup label="Test Group">
        <InputRow>
          <TextInput label="First Input" placeholder="Enter text" />
        </InputRow>
        <InputRow>
          <TextInput label="Second Input" placeholder="Enter text" />
          <PasswordInput label="Third Input" placeholder="Enter text" />
        </InputRow>
      </InputGroup>,
    );
    expect(container).toMatchSnapshot();
  });
});
