/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Checkbox from '../components/Checkbox';
import SectionHeader from '../components/SectionHeader';
import ProgressBar from '../components/ProgressBar';
import { sendAnalytics } from '../utils/sendAnalytics';
const { AutoLayout, Text, useSyncedState, useEffect, waitForTask } = figma.widget;

function Widget() {
  const [checkedItems, setCheckedItems] = useSyncedState('checkedStates', 0);
  const [isAnalyticsLoadEventSent, setIsAnalyticsLoadEventSent] = useSyncedState(
    'analytics',
    false,
  );

  useEffect(() => {
    if (!isAnalyticsLoadEventSent) {
      // send analytics
      waitForTask(
        sendAnalytics({
          eventName: 'Blade Dev Handoff Checklist Used',
        }),
      );
      setIsAnalyticsLoadEventSent(true);
    }
  });

  const updateChecklist = ({
    isChecked,
    optionText,
  }: {
    isChecked: boolean;
    optionText: string;
  }): void => {
    if (isChecked) {
      setCheckedItems((prevState: number) => {
        waitForTask(
          sendAnalytics({
            eventName: 'Dev Checklist Item Toggled',
            properties: { checkedItems: prevState + 1, checkedItemName: optionText },
          }),
        );
        return prevState + 1;
      });
    } else {
      setCheckedItems((prevState: number) => {
        waitForTask(
          sendAnalytics({
            eventName: 'Dev Checklist Item Toggled',
            properties: { checkedItems: prevState - 1, unCheckedItemName: optionText },
          }),
        );
        return prevState - 1;
      });
    }
  };

  return (
    <AutoLayout
      width={465}
      padding={{ horizontal: 32, vertical: 40 }}
      direction="vertical"
      spacing={24}
      cornerRadius={16}
      fill="#fff"
    >
      <AutoLayout direction="vertical" spacing={8} width="fill-parent">
        <Text fontSize={28} fontWeight={700} fill="#192839">
          ✏️ Dev handoff checklist
        </Text>
        <ProgressBar cardWidgetWidth={401} numberOfCheckboxes={15} checkedItems={checkedItems} />
      </AutoLayout>
      <AutoLayout direction="vertical" spacing={4} width="fill-parent">
        <SectionHeader title="Reviewers" />
        <AutoLayout direction="vertical" spacing={4} width="fill-parent">
          <Checkbox
            id="review1"
            optionText="Design reviewed by "
            isEditable={true}
            isEditableInputWithDateField={true}
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id="review2"
            optionText="Copy reviewed by "
            isEditable={true}
            isEditableInputWithDateField={true}
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id="review3"
            optionText="Creatives reviewed by "
            isEditable={true}
            isEditableInputWithDateField={true}
            onCheckboxClick={updateChecklist}
          />
        </AutoLayout>
      </AutoLayout>
      <AutoLayout direction="vertical" spacing={4} width="fill-parent">
        <SectionHeader title="Design system" />
        <AutoLayout direction="vertical" spacing={4} width="fill-parent">
          <Checkbox
            id="ds1"
            optionText="Added Blade coverage card having coverage greater than 90%"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id="ds2"
            optionText="Used corresponding typography for mobile and desktop screen sizes"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id="ds3"
            optionText="Added a section for the slot replacements & local components"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id="ds4"
            optionText="Annotated the reasons with deviation request link if coverage is less than 90%"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id="ds5"
            optionText="All the non-Blade components are approved from the Blade team and are part of Blade Snowflake file"
            onCheckboxClick={updateChecklist}
          />
        </AutoLayout>
      </AutoLayout>
      <AutoLayout direction="vertical" spacing={4} width="fill-parent">
        <SectionHeader title="States" />
        <AutoLayout direction="vertical" spacing={4} width="fill-parent">
          <Checkbox
            id="state1"
            optionText="Empty and loading states are defined properly"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id="state2"
            optionText="Created end-to-end prototype for the flow"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id="state3"
            optionText="Accounted for edge cases and error states"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id="state4"
            optionText="Used browser header and footer frames"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id="state5"
            optionText="Designs are light and dark mode compatible"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id="state6"
            optionText="Added Figma's annotations to explain behaviours"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id="state7"
            optionText="Ensured responsive design for both desktop and mobile flows, considering standard screen sizes, safe areas, and keyboard layouts on mobile devices"
            onCheckboxClick={updateChecklist}
          />
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
}

figma.widget.register(Widget);
