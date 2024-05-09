import React from 'react';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { DropdownFooter, DropdownHeader } from '~components/Dropdown/DropdownHeaderFooter';
import renderWithSSR from '~utils/testing/renderWithSSR.web';
import { AutoComplete } from '~components/Input/DropdownInputTriggers';
import { ActionList, ActionListItem } from '~components/ActionList';
import { Button } from '~components/Button';
import { Box } from '~components/Box';

/**
 * @TODO
 *
 * - Write E2E tests for maxRows prop once we have e2e setup (jsdom is acting strange in tag calculation at multiple places even after mocking)
 */

describe('<Dropdown /> with <AutoComplete />', () => {
  it('should render dropdown and make it visible on click', () => {
    const { container, getByRole } = renderWithSSR(
      <Dropdown>
        <AutoComplete label="Fruits" />
        <DropdownOverlay zIndex={1002}>
          <DropdownHeader title="Recent Searches" />
          <ActionList>
            <ActionListItem title="Apple" value="apple" />
            <ActionListItem title="Mango" value="mango" />
          </ActionList>
          <DropdownFooter>
            <Box>
              <Button isFullWidth>Apply</Button>
            </Box>
          </DropdownFooter>
        </DropdownOverlay>
      </Dropdown>,
    );

    const selectInput = getByRole('combobox', { name: 'Fruits' });
    expect(selectInput).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
