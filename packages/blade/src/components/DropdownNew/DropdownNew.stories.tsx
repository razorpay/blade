import React from 'react';
import type { Meta } from '@storybook/react';
import { ActionList, ActionListItem } from './ActionList/ActionList';
import { Dropdown, DropdownOverlay } from './index';

import { SelectInput } from './SelectInput/SelectInput';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { TextInput } from '~components/Input/TextInput';
import { useDropdown } from './useDropdown';
import { Select } from '@mantine/core';

const DropdownStoryMeta: Meta = {
  title: 'Components/DropdownNew',
  component: Dropdown,
  parameters: {
    viewMode: 'story',
    options: {
      showPanel: false,
    },
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true,
      },
    },
    chromatic: { disableSnapshot: true },
  },
};

// const Trigger = ({ _referenceProps }) => {
//   const { selectedIndices, elementsRef } = useDropdown();

//   const selectedValue =
//     selectedIndices.length > 0 ? elementsRef.current[selectedIndices[0]]?.dataset.title : '';

//   return <input type="text" value={selectedValue} {..._referenceProps} />;
// };

export const InternalSelect = (): React.ReactElement => {
  return (
    <Dropdown>
      <SelectInput label="Fruits" />
      <DropdownOverlay>
        <ActionList>
          <ActionListItem title="Apples" value="apples" />
          <ActionListItem title="Appricots" value="appricots" />
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  );
};

export default DropdownStoryMeta;
