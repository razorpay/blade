import React from 'react';
import { InputRow } from '../InputRow';
import type { InputGroupProps } from '../types';
import { InputGroup } from '../InputGroup.web';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { TextInput } from '~components/Input/TextInput';
import { PasswordInput } from '~components/Input/PasswordInput';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

const sizes: InputGroupProps['size'][] = ['medium', 'large'];

describe('InputGroup', () => {
  it('should render Inputgroup with default properties', () => {
    const { container } = renderWithTheme(
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

  sizes.forEach((size) => {
    it(`should render InputGroup with ${size} size`, () => {
      const { container } = renderWithTheme(
        <InputGroup size={size}>
          <InputRow>
            <TextInput label="First Input" placeholder="Enter text" />
            <TextInput label="Second Input" placeholder="Enter text" />
          </InputRow>
          <InputRow>
            <TextInput label="Third Input" placeholder="Enter text" />
          </InputRow>
        </InputGroup>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  it('should render disabled ButtonGroup', () => {
    const { container } = renderWithTheme(
      <InputGroup isDisabled={true}>
        <InputRow>
          <TextInput label="First Input" placeholder="Enter text" />
        </InputRow>
        <InputRow>
          <TextInput label="Second Input" placeholder="Enter text" />
        </InputRow>
      </InputGroup>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should handle validation states correctly', () => {
    const { container } = renderWithTheme(
      <InputGroup label="Test Group" validationState="error" errorText="Error message">
        <InputRow>
          <TextInput label="Input" placeholder="Enter text" />
        </InputRow>
      </InputGroup>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should accept testID', () => {
    const { getAllByTestId } = renderWithTheme(
      <InputGroup testID="input-group-test">
        <InputRow>
          <TextInput label="First Input" placeholder="Enter text" />
        </InputRow>
        <InputRow>
          <TextInput label="Second Input" placeholder="Enter text" />
        </InputRow>
      </InputGroup>,
    );
    const elements = getAllByTestId('input-group-test');
    expect(elements.length).toBeGreaterThan(0);
  });

  it('should support data-analytics', () => {
    const { container } = renderWithTheme(
      <InputGroup data-analytics-test="test">
        <InputRow>
          <TextInput label="First Input" placeholder="Enter text" />
        </InputRow>
        <InputRow>
          <TextInput label="Second Input" placeholder="Enter text" />
        </InputRow>
      </InputGroup>,
    );

    expect(container.querySelector('[data-analytics-test="test"]')).toBeInTheDocument();
  });
});
