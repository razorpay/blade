import React from 'react';
import { StepGroup, StepItem, StepItemIndicator } from '../';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<StepGroup />', () => {
  it('should render nested StepGroup', () => {
    const { container } = renderWithSSR(
      <StepGroup>
        <StepItem
          title="Introduction"
          timestamp="Thu, 15th Oct"
          description="Header description"
          stepProgress="full"
        />
        <StepItem
          title="Personal Details"
          timestamp="Thu, 15th Oct"
          description="Person Details description"
          stepProgress="full"
        />
        <StepGroup>
          <StepItem
            title="Address"
            timestamp="Thu, 15th Oct"
            stepProgress="start"
            marker={<StepItemIndicator color="positive" />}
          />
          <StepItem
            title="Bank Details"
            timestamp="Thu, 15th Oct"
            description="Person Details description"
          />
        </StepGroup>
      </StepGroup>,
    );
    expect(container).toMatchSnapshot();
  });
});
