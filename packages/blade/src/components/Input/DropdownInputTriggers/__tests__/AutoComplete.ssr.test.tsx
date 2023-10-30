import React from 'react';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
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

describe.skip('<Dropdown /> with <AutoComplete />', () => {
  afterAll(() => {
    // These are not defined by default in JSDOM so clearing them out.
    // @ts-expect-error: it is taking web's requestAnimationFrame types but JSDom doesn't define these
    global.requestAnimationFrame = null;
    // @ts-expect-error: it is expecting web's requestAnimationFrame types but JSDom doesn't define these
    global.cancelAnimationFrame = null;
  });

  it('should render dropdown and make it visible on click', async () => {
    const { container, getByRole, queryByRole } = renderWithSSR(
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

    // Cannot define this in beforeEach because we want it to be defined after renderToString call
    // @ts-expect-error: too lazy to define accurate typescript mocks just for mocking
    global.requestAnimationFrame = (cb) => cb();
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    global.cancelAnimationFrame = () => {};

    const selectInput = getByRole('combobox', { name: 'Fruits' });

    expect(selectInput).toBeInTheDocument();
    // testing library ignores the nodes because they are set to display none so using querySelector to select from dom instead.
    // the node becomes accessible after click on selectInput
    expect(queryByRole('dialog')).toBeNull();
    await userEvent.click(selectInput);
    await waitFor(() => expect(getByRole('dialog', { name: 'Fruits' })).toBeVisible());
    expect(container).toMatchSnapshot();
  });
});
