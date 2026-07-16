import React from 'react';
import { ButtonGroup } from '../ButtonGroup';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { Button } from '~components/Button/Button';
import { ChevronDownIcon } from '~components/Icons';
import { Tooltip } from '~components/Tooltip';
import { Popover } from '~components/Popover';
import { Dropdown, DropdownButton, DropdownOverlay } from '~components/Dropdown';
import { ActionList, ActionListItem } from '~components/ActionList';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { Text } from '~components/Typography';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('ButtonGroup allowed children on native', () => {
  it('exposes componentIds on Button, Tooltip, Popover, Dropdown', () => {
    expect(getComponentId(<Button>x</Button>)).toBe('Button');
    expect(
      getComponentId(
        <Tooltip content="c">
          <Button>x</Button>
        </Tooltip>,
      ),
    ).toBe('Tooltip');
    expect(
      getComponentId(
        <Popover content={<Text>c</Text>}>
          <Button>x</Button>
        </Popover>,
      ),
    ).toBe('Popover');
    expect(
      getComponentId(
        <Dropdown>
          <DropdownButton icon={ChevronDownIcon} />
        </Dropdown>,
      ),
    ).toBe('Dropdown');
  });

  it('accepts Tooltip and Dropdown children', () => {
    expect(() =>
      renderWithTheme(
        <ButtonGroup>
          <Tooltip content="Create a new payout">
            <Button>Payout</Button>
          </Tooltip>
          <Dropdown>
            <DropdownButton icon={ChevronDownIcon} />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem title="Bulk Payout" value="bulk-payout" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </ButtonGroup>,
      ),
    ).not.toThrow();
  });

  it('accepts Popover children', () => {
    expect(() =>
      renderWithTheme(
        <ButtonGroup>
          <Popover content={<Text>Are you sure?</Text>}>
            <Button>Sync</Button>
          </Popover>
          <Button>Share</Button>
        </ButtonGroup>,
      ),
    ).not.toThrow();
  });
});
