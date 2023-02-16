import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import type { BottomSheetProps } from './BottomSheet';
import { BottomSheetBody, BottomSheet as BottomSheetComponent } from './BottomSheet';

import {
  BottomSheetFooter,
  BottomSheetFooterLeading,
  BottomSheetFooterTrailing,
} from './BottomSheetFooter';
import {
  BottomSheetHeader,
  BottomSheetHeaderLeading,
  BottomSheetHeaderTrailing,
} from './BottomSheetHeader';
import {
  ArrowRightIcon,
  ClockIcon,
  DownloadIcon,
  LogOutIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon,
} from '~components/Icons';
import { ActionListItem, ActionListItemIcon, ActionListSection } from '~components/ActionList';
import BaseBox from '~components/Box/BaseBox';

export default {
  title: 'Components/BottomSheet',
  component: BottomSheetComponent,
} as Meta<BottomSheetProps>;

const BottomSheetTemplate: ComponentStory<typeof BottomSheetComponent> = ({ ...args }) => {
  return (
    <BottomSheetComponent {...args}>
      <BottomSheetHeader>
        <BottomSheetHeaderLeading
          title="Select Account"
          prefix={<ClockIcon color="surface.text.muted.lowContrast" size="large" />}
        />
        <BottomSheetHeaderTrailing
          visual={<ClockIcon color="surface.text.muted.lowContrast" size="large" />}
        />
      </BottomSheetHeader>
      <BottomSheetBody>
        <BaseBox>
          <ActionListSection title="Section Heading">
            <ActionListItem
              leading={<ActionListItemIcon icon={UserIcon} />}
              trailing={<ActionListItemIcon icon={ArrowRightIcon} />}
              title="View Profile"
              value="view-profile"
            />
            <ActionListItem
              leading={<ActionListItemIcon icon={SettingsIcon} />}
              title="Settings"
              value="settings"
            />
            <ActionListItem
              leading={<ActionListItemIcon icon={DownloadIcon} />}
              title="Download"
              value="download"
            />
          </ActionListSection>
          <ActionListItem
            intent="negative"
            leading={<ActionListItemIcon icon={LogOutIcon} />}
            title="Sign Out"
            value="sign-out"
          />
        </BaseBox>
      </BottomSheetBody>
      <BottomSheetFooter>
        <BottomSheetFooterLeading
          title="Search Tips"
          prefix={<SearchIcon color="surface.text.muted.lowContrast" size="large" />}
        />
        <BottomSheetFooterTrailing
          actions={{
            primary: { text: 'Apply' },
            secondary: { text: 'Cancel' },
          }}
        />
      </BottomSheetFooter>
    </BottomSheetComponent>
  );
};

export const Default = BottomSheetTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
Default.storyName = 'Default';
