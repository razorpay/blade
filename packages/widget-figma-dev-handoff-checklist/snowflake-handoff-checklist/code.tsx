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
          eventName: 'Blade Snowflake Handoff Checklist Used',
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
            eventName: 'Snowflake Checklist Item Toggled',
            properties: { checkedItems: prevState + 1, checkedItemName: optionText },
          }),
        );
        return prevState + 1;
      });
    } else {
      setCheckedItems((prevState: number) => {
        waitForTask(
          sendAnalytics({
            eventName: 'Snowflake Checklist Item Toggled',
            properties: { checkedItems: prevState - 1, unCheckedItemName: optionText },
          }),
        );
        return prevState - 1;
      });
    }
  };

  return (
    <AutoLayout
      width={488}
      padding={{ horizontal: 32, vertical: 40 }}
      direction="vertical"
      spacing={24}
      cornerRadius={16}
      fill="#fff"
    >
      <AutoLayout direction="vertical" spacing={8} width="fill-parent">
        <Text fontSize={28} fontWeight={700} fill="#192839">
          ❄️ Snowflake handoff checklist
        </Text>
        <ProgressBar cardWidgetWidth={424} numberOfCheckboxes={15} checkedItems={checkedItems} />
      </AutoLayout>
      <AutoLayout direction="vertical" spacing={4} width="fill-parent">
        <SectionHeader title="Project details" />
        <AutoLayout direction="vertical" spacing={4} width="fill-parent">
          <Checkbox
            id="detail1"
            optionText="Designed by:"
            isEditable={true}
            isEditableInputWithDateField={false}
            isEditablePlaceholderText="Author's Name"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id="detail2"
            optionText="Designed for:"
            isEditable={true}
            isEditableInputWithDateField={false}
            isEditablePlaceholderText="Project Name (BU)"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id="detail3"
            optionText="Designed on:"
            isEditable={true}
            isEditablePlaceholderText="Date"
            isEditableInputWithDateField={false}
            onCheckboxClick={updateChecklist}
          />
        </AutoLayout>
      </AutoLayout>
      <AutoLayout direction="vertical" spacing={4} width="fill-parent">
        <SectionHeader title="Raising a request" />
        <AutoLayout direction="vertical" spacing={4} width="fill-parent">
          <Checkbox
            id="req1"
            optionText="Did a hygiene check with their respective team"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id="req2"
            optionText="Raised a JIRA ticket for 'new component request'"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id="req3"
            optionText="Ticket is approved by DS team"
            onCheckboxClick={updateChecklist}
          />
        </AutoLayout>
      </AutoLayout>
      <AutoLayout direction="vertical" spacing={4} width="fill-parent">
        <SectionHeader title="Component hygiene" />
        <AutoLayout direction="vertical" spacing={4} width="fill-parent">
          <Checkbox
            id="hygiene1"
            optionText="Used all the correct tokens"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id="hygiene2"
            optionText="Has all the states of the component"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id="hygiene3"
            optionText="Has all the required variants of the component"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id="hygiene4"
            optionText="Designs are light and dark mode compatible"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id="hygiene5"
            optionText="Designs match Razorpay's design language"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id="hygiene6"
            optionText="Component is responsive"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id="hygiene7"
            optionText="All the interactions are thought through"
            onCheckboxClick={updateChecklist}
          />
        </AutoLayout>
      </AutoLayout>
      <AutoLayout direction="vertical" spacing={4} width="fill-parent">
        <SectionHeader title="Review" />
        <AutoLayout direction="vertical" spacing={4} width="fill-parent">
          <Checkbox
            id="rev1"
            optionText="Component reviewed by Blade designers/advocates"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id="rev2"
            optionText="Component added to Blade Snowflake file"
            onCheckboxClick={updateChecklist}
          />
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
}

figma.widget.register(Widget);
