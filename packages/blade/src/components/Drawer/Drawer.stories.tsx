import React from 'react';
import type { DOMAttributes } from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import { Drawer, DrawerBody, DrawerHeader, DrawerHeaderBadge, DrawerHeaderIcon } from './';
import type { DrawerProps } from './';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Box } from '~components/Box';
import iconMap from '~components/Icons/iconMap';
import { isReactNative } from '~utils';
import { TextInput } from '~components/Input/TextInput';
import { Button } from '~components/Button';
import { AnnouncementIcon, DownloadIcon, PlusIcon } from '~components/Icons';
import { Card, CardBody } from '~components/Card';

// const Page = (): React.ReactElement => {
//   return (
//     <StoryPageWrapper
//       componentName="Tag"
//       componentDescription="These are set of interactive keywords that help organise & categorise objects. Tags can be added or removed from an object by the users."
//       figmaURL="https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=71188-528135&mode=design&t=Qm80tBqhFBFB5BvZ-4"
//     >
//       <Title>Usage</Title>
//       <Sandbox>
//         {`
//         import React from 'react';
//         import { Tag, FileTextIcon } from '@razorpay/blade/components';

//         function App(): React.ReactElement {
//           const [isTagVisible, setIsTagVisible] = React.useState(true);

//           return (
//             isTagVisible
//             ? <Tag
//                 icon={FileTextIcon}
//                 onDismiss={() => {
//                   console.log('Unpaid Tag dismissed');
//                   setIsTagVisible(false);
//                 }}
//               >
//                 Unpaid
//               </Tag>
//             : null
//           )
//         }

//         export default App;
//         `}
//       </Sandbox>
//     </StoryPageWrapper>
//   );
// };

export default {
  title: 'Components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
    icon: {
      name: 'icon',
      type: 'select' as 'string',
      options: Object.keys(iconMap),
      mapping: iconMap,
    },
    _isVirtuallyFocussed: {
      table: {
        disable: true,
      },
    },
  },
  // parameters: {
  //   docs: {
  //     page: Page,
  //   },
  // },
} as Meta<DrawerProps>;

const DrawerTemplate: StoryFn<typeof Drawer> = ({ children, ...args }) => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isSecondDrawerOpen, setIsSecondDrawerOpen] = React.useState(false);
  return (
    <Box>
      <Button onClick={() => setIsDrawerOpen(!isDrawerOpen)}>Toggle Drawer</Button>
      <Drawer isOpen={isDrawerOpen} onDismiss={() => setIsDrawerOpen(false)}>
        <DrawerHeader
          leading={<DrawerHeaderIcon icon={AnnouncementIcon} />}
          title="Announcements"
          titleSuffix={<DrawerHeaderBadge color="positive">New</DrawerHeaderBadge>}
          subtitle="This is an announcement"
          trailing={<Button variant="tertiary" icon={DownloadIcon} />}
        />
        <DrawerBody>
          <Card padding="spacing.0">
            <CardBody>
              <img
                width="100%"
                style={{
                  aspectRatio: '2 / 1',
                }}
                src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTdtZzAzNTQ5dHQ3d2hnampjdzZ2MmduOGJ5djRlMndmdWx3eHFsZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xJjs8eGVbjNYY/giphy.gif"
              />
            </CardBody>
          </Card>
          <Button marginTop="spacing.4" onClick={() => setIsSecondDrawerOpen(!isSecondDrawerOpen)}>
            Open Next Drawer
          </Button>
        </DrawerBody>
      </Drawer>

      <Drawer isOpen={isSecondDrawerOpen} onDismiss={() => setIsSecondDrawerOpen(false)}>
        <DrawerHeader title="Announcements Two" subtitle="This is second drawer" />
        <DrawerBody>
          <Card>
            <CardBody>
              <Box>Second Drawer</Box>
            </CardBody>
          </Card>
        </DrawerBody>
      </Drawer>
    </Box>
  );
};

export const Default = DrawerTemplate.bind({});

// export const Disabled = TagTemplate.bind({});
// Disabled.args = {
//   children: 'Disabled Tag',
//   icon: 'FileTextIcon',
//   isDisabled: true,
// } as TagProps & { icon: string };

// const CrossPlatformForm = ({
//   children,
//   onSubmit,
// }: {
//   children: React.ReactElement[];
//   onSubmit: DOMAttributes<HTMLFormElement>['onSubmit'];
// }): React.ReactElement => {
//   if (isReactNative()) {
//     return <Box>{children}</Box>;
//   }

//   return <form onSubmit={onSubmit}>{children}</form>;
// };

// export const ControlledTags = (props: TagProps): React.ReactElement => {
//   const [inputValue, setInputValue] = React.useState('');
//   const [tags, setTags] = React.useState<string[]>([]);

//   const addTag = (): void => {
//     // Add input value to tags and clear the input value
//     if (inputValue) {
//       setTags([...tags, inputValue]);
//       setInputValue('');
//     }
//   };

//   const removeTag = (tagName: TagProps['children']): void => {
//     setTags(tags.filter((tagNameValue) => tagNameValue !== tagName));
//   };

//   return (
//     <Box>
//       <Box paddingY="spacing.4">
//         {tags.map((tagName) => (
//           <Tag
//             key={tagName}
//             {...props}
//             marginRight="spacing.2"
//             onDismiss={() => removeTag(tagName)}
//           >
//             {tagName}
//           </Tag>
//         ))}
//       </Box>
//       <Box>
//         <CrossPlatformForm
//           onSubmit={(e) => {
//             e.preventDefault();
//             addTag();
//           }}
//         >
//           <TextInput
//             label="Tag Label"
//             value={inputValue}
//             onChange={({ value }) => setInputValue(value ?? '')}
//             {...{ onSubmit: isReactNative() ? () => addTag() : undefined }}
//           />
//           <Button
//             icon={PlusIcon}
//             iconPosition="right"
//             variant="secondary"
//             marginTop="spacing.2"
//             type="submit"
//             {...{ onClick: isReactNative() ? () => addTag() : undefined }}
//           >
//             Create Tag
//           </Button>
//         </CrossPlatformForm>
//       </Box>
//     </Box>
//   );
// };
