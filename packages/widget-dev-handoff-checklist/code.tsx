/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Checkbox from './components/Checkbox';
import SectionHeader from './components/SectionHeader';
const { AutoLayout, Text, useSyncedState } = figma.widget;

function Widget() {
  const [checkedItems, setCheckedItems] = useSyncedState('checkedStates', 0);
  const cardWidgetWidth = 401;
  const numberOfCheckboxes = 14;
  const isAllCheckboxesChecked = checkedItems === numberOfCheckboxes;

  const updateChecklist = (checkedState: true | false): void => {
    if (checkedState) {
      setCheckedItems((prevState: number) => prevState + 1);
    } else {
      setCheckedItems((prevState: number) => prevState - 1);
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
          ✏️ Handoff checklist
        </Text>
        <AutoLayout
          direction="horizontal"
          spacing="auto"
          cornerRadius={4}
          padding={{ horizontal: 8, vertical: 4 }}
          width="fill-parent"
          height={20}
          fill="#ECF1FF"
        >
          <AutoLayout
            positioning="absolute"
            x={0}
            y={0}
            width={checkedItems === 0 ? 1 : checkedItems * (cardWidgetWidth / numberOfCheckboxes)}
            height={20}
            fill={isAllCheckboxesChecked ? '#00A251' : '#D0DBFF'}
          />
          <Text
            fontSize={10}
            fontWeight={600}
            fill={isAllCheckboxesChecked ? '#ffffff' : '#768EA7'}
          >
            {isAllCheckboxesChecked ? '🎉  Ready for handoff!' : '😕  Not ready for handoff'}
          </Text>
          <SectionHeader
            title={`${checkedItems}/${numberOfCheckboxes}`}
            color={isAllCheckboxesChecked ? '#ffffff' : '#768EA7'}
          />
        </AutoLayout>
      </AutoLayout>
      <AutoLayout direction="vertical" spacing={4} width="fill-parent">
        <SectionHeader title="Reviewers" />
        <AutoLayout direction="vertical" spacing={4} width="fill-parent">
          <Checkbox
            id="review1"
            optionText="Design reviewed by "
            isEditable={true}
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id="review2"
            optionText="Copy reviewed by "
            isEditable={true}
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id="review3"
            optionText="Creatives reviewed by "
            isEditable={true}
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
            optionText="Accounted for edge cases and error states"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id="state3"
            optionText="Used browser header and footer frames"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id="state4"
            optionText="Designs are light and dark mode compatible"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id="state5"
            optionText="Added Figma's annotations to explain behaviours"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id="state6"
            optionText="Ensured responsive design for both desktop and mobile flows, considering standard screen sizes, safe areas, and keyboard layouts on mobile devices."
            onCheckboxClick={updateChecklist}
          />
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
}

figma.widget.register(Widget);
