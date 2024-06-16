// @ts-nocheck
import { composeStories } from '@storybook/react';
import * as accordionStories from '../../components/Accordion/Accordion.stories';
import * as buttonStories from '../../components/Button/Button/Button.stories';
import * as bottomSheetStories from '../../components/BottomSheet/BottomSheet.stories';
import * as carouselStories from '../../components/Carousel/Carousel.stories';
import * as checkboxGroupStories from '../../components/Checkbox/CheckboxGroup.stories';
import * as chipGroupStories from '../../components/Chip/ChipGroup.stories';
import * as collapsibleStories from '../../components/Collapsible/Collapsible.stories';
import * as modalStories from '../../components/Modal/docs/SimpleModal.stories';
import * as progressBarStories from '../../components/ProgressBar/ProgressBar.stories';
import * as radioStories from '../../components/Radio/Radio.stories';
import * as switchStories from '../../components/Switch/Switch.stories';
import * as textInputStories from '../../components/Input/TextInput/TextInput.stories';
import * as otpInputStories from '../../components/Input/OTPInput/OTPInput.stories';
import * as autoCompleteStories from '../../components/Input/DropdownInputTriggers/AutoComplete.stories';
import { Card, CardBody } from '~components/Card';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography';
import { Divider } from '~components/Divider';

const includedStories = [
  'IconRightButton',
  'WithIcons',
  'WithHeaderFooter',
  'DefaultCarousel',
  'HelpTextCheckbox',
  'DefaultSelectedSingle',
  'WithCollapsibleButton',
  'SimpleModal',
  'ProgressBarIndeterminate',
  'RequiredRadio',
  'DefaultCheckedSwitch',
  'TextInputHelpText',
  'OTPInputHelpText',
  'InternalAutoCompleteControlled',
];

const StoryNameToHeadingMap = {
  IconRightButton: 'Button',
  WithIcons: 'Accordion',
  WithHeaderFooter: 'BottomSheet',
  DefaultCarousel: 'Carousel',
  HelpTextCheckbox: 'Checkbox',
  DefaultSelectedSingle: 'Chip',
  WithCollapsibleButton: 'Collapsible',
  SimpleModal: 'Modal',
  ProgressBarIndeterminate: 'ProgressBar',
  RequiredRadio: 'Radio',
  DefaultCheckedSwitch: 'Switch',
  TextInputHelpText: 'TextInput',
  OTPInputHelpText: 'OTPInput',
  InternalAutoCompleteControlled: 'AutoComplete',
};

const allStories = [
  ...Object.values(composeStories(buttonStories)),
  ...Object.values(composeStories(textInputStories)),
  ...Object.values(composeStories(otpInputStories)),
  ...Object.values(composeStories(checkboxGroupStories)),
  ...Object.values(composeStories(radioStories)),
  ...Object.values(composeStories(switchStories)),
  ...Object.values(composeStories(chipGroupStories)),
  ...Object.values(composeStories(autoCompleteStories)),
  ...Object.values(composeStories(accordionStories)),
  ...Object.values(composeStories(collapsibleStories)),
  ...Object.values(composeStories(modalStories)),
  ...Object.values(composeStories(bottomSheetStories)),
  ...Object.values(composeStories(carouselStories)),
  ...Object.values(composeStories(progressBarStories)),
];

const filteredstories = allStories.filter((Story) => includedStories.includes(Story.storyName));

const BrandedComponentKitchenSink = (): React.ReactElement => {
  return (
    <Card elevation="lowRaised">
      <CardBody>
        {filteredstories.map((Story, index) => {
          return (
            <>
              {index === 0 ? null : <Divider orientation="horizontal" marginBottom="spacing.6" />}
              <Heading size="large" marginBottom="spacing.4">
                {StoryNameToHeadingMap[Story.storyName] ?? Story.storyName}:
              </Heading>
              <Story />
              <Box marginTop="spacing.8" />
            </>
          );
        })}
      </CardBody>
    </Card>
  );
};

export { BrandedComponentKitchenSink };
