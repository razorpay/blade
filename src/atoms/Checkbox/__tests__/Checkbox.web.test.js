import React from 'react';
import { fireEvent } from '@testing-library/react';
import { renderWithTheme } from '../../../_helpers/testing';
import Checkbox from '../index';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Checkbox />', () => {
  it('should pass', () => {
    const { getByLabelText } = renderWithTheme(
      <Checkbox id="sample-id" defaultChecked={false} title="Enable Beast Mode" />,
    );
    const checkBox = getByLabelText('Enable Beast Mode');
    fireEvent.click(checkBox);
    expect(checkBox.checked).toBe(true);
  });
});
