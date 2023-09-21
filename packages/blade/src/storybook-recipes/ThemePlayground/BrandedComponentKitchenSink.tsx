import { composeStories } from '@storybook/react';
import * as accordionStories from '../../components/Accordion/Accordion.stories';
import * as buttonStories from '../../components/Button/Button/Button.stories';
import * as bottomSheetStories from '../../components/BottomSheet/BottomSheet.stories';
import * as carouselStories from '../../components/Carousel/Carousel.stories';
import * as checkboxGroupStories from '../../components/Checkbox/CheckboxGroup.stories';
import * as chipGroupStories from '../../components/Chip/ChipGroup.stories';
import * as collapsibleStories from '../../components/Collapsible/Collapsible.stories';
import * as dropdownStories from '../../components/Dropdown/docs/DropdownWithSelect.stories';
import * as modalStories from '../../components/Modal/docs/SimpleModal.stories';
import * as progressBarStories from '../../components/ProgressBar/ProgressBar.stories';
import * as radioStories from '../../components/Radio/Radio.stories';
import * as selectInputStories from '../../components/Input/SelectInput/SelectInput.stories';
import * as switchStories from '../../components/Switch/Switch.stories';
import * as textInputStories from '../../components/Input/TextInput/TextInput.stories';
import * as otpInputStories from '../../components/Input/OTPInput/OTPInput.stories';
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
  'InternalSelect',
  'SimpleModal',
  'ProgressBarIndeterminate',
  'RequiredRadio',
  'DefaultSelectInput',
  'DefaultCheckedSwitch',
  'TextInputHelpText',
  'OTPInputHelpText',
];

const StoryNameToHeadingMap = {
  IconRightButton: 'Button',
  WithIcons: 'Accordion',
  WithHeaderFooter: 'BottomSheet',
  DefaultCarousel: 'Carousel',
  HelpTextCheckbox: 'Checkbox',
  DefaultSelectedSingle: 'Chip',
  WithCollapsibleButton: 'Collapsible',
  InternalSelect: 'Dropdown',
  SimpleModal: 'Modal',
  ProgressBarIndeterminate: 'ProgressBar',
  RequiredRadio: 'Radio',
  DefaultSelectInput: 'SelectInput',
  DefaultCheckedSwitch: 'Switch',
  TextInputHelpText: 'TextInput',
  OTPInputHelpText: 'OTPInput',
};

const allStories = [];
allStories.push(...Object.values(composeStories(buttonStories)));
allStories.push(...Object.values(composeStories(accordionStories)));
allStories.push(...Object.values(composeStories(bottomSheetStories)));
allStories.push(...Object.values(composeStories(carouselStories)));
allStories.push(...Object.values(composeStories(checkboxGroupStories)));
allStories.push(...Object.values(composeStories(chipGroupStories)));
allStories.push(...Object.values(composeStories(collapsibleStories)));
allStories.push(...Object.values(composeStories(dropdownStories)));
allStories.push(...Object.values(composeStories(modalStories)));
allStories.push(...Object.values(composeStories(progressBarStories)));
allStories.push(...Object.values(composeStories(radioStories)));
allStories.push(...Object.values(composeStories(selectInputStories)));
allStories.push(...Object.values(composeStories(switchStories)));
allStories.push(...Object.values(composeStories(textInputStories)));
allStories.push(...Object.values(composeStories(otpInputStories)));

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
