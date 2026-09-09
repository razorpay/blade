// AUTOCOMPLETE

import type { DropdownProps } from '../types';

export const getSimpleAutoComplete = (
  selectionType: DropdownProps['selectionType'] = 'single',
): string => `
  import { 
    Dropdown, 
    DropdownOverlay,
    AutoComplete,
    ActionList,
    ActionListItem,
  } from '@razorpay/blade/components';

  function App() {
    return (
      <Dropdown 
        selectionType="${selectionType}"
      >
        <AutoComplete
          label="City"
          placeholder="Select your City"
          name="action"
          onChange={({ name, values }) => {
            console.log({ name, values });
          }}
          onInputValueChange={({ name, value }) => {
            console.log({ name, value });
          }}
        />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Mumbai" value="mumbai" />
            <ActionListItem title="Pune" value="pune" />
            <ActionListItem title="Bangalore" value="bangalore" />
            <ActionListItem title="Mysore" value="mysore" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    )
  }

  export default App;
`;
