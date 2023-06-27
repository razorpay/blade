/* eslint-disable @typescript-eslint/no-empty-function */
import { Collapsible } from '../Collapsible';
import { CollapsibleButton } from '../CollapsibleButton';
import { CollapsibleBody } from '../CollapsibleBody';
import renderWithSSR from '~src/_helpers/testing/renderWithSSR.web';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { Amount } from '~components/Amount';

describe('<Collapsible />', () => {
  it('should render Collapsible on server', () => {
    const { container } = renderWithSSR(
      <Collapsible defaultIsExpanded>
        <CollapsibleButton>View Price Breakdown</CollapsibleButton>
        <CollapsibleBody>
          <Box display="flex" flexDirection="column" minWidth="200px">
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="baseline"
            >
              <Text>Actual amount</Text>
              <Amount value={1000} intent="positive" />
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="baseline"
            >
              <Text marginTop="spacing.2">Razorpay Platform Fees</Text>
              <Text>2%</Text>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="baseline"
            >
              <Text marginTop="spacing.2">GST</Text>
              <Text>18%</Text>
            </Box>
          </Box>
        </CollapsibleBody>
      </Collapsible>,
    );

    expect(container).toMatchSnapshot();
  });
});
