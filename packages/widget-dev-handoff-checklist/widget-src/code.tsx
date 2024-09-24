const { AutoLayout, Text, useSyncedState } = figma.widget;
import Checkbox from './components/Checkbox';
import ListView from './components/ListView';
import SectionHeader from './components/SectionHeader';

function Widget() {
  const [checkedItems, setCheckedItems] = useSyncedState('checkedStates', 0);

  const updateChecklist = (checkedState: true | false): void => {
    if (checkedState === true) {
      setCheckedItems((prevState) => prevState + 1);
    } else if (checkedState === false) {
      setCheckedItems((prevState) => prevState - 1);
    }
  };

  return (
    <AutoLayout
      width={465}
      padding={{ horizontal: 32, vertical: 40 }}
      direction="vertical"
      spacing={24}
      cornerRadius={16}
      fill={'#fff'}
    >
      <Text fontSize={28} fontWeight={700} fill={'#192839'}>
        ✏️ Handoff checklist
      </Text>
      <SectionHeader title={`${checkedItems}/13`} />
      <AutoLayout direction="vertical" spacing={4} width="fill-parent">
        <SectionHeader title="Reviewers" />
        <AutoLayout direction="vertical" spacing={4} width="fill-parent">
          <ListView id={'review1'} listText={'Design'} />
          <ListView id={'review2'} listText={'Copy'} />
          <ListView id={'review3'} listText={'Creatives'} />
        </AutoLayout>
      </AutoLayout>
      <AutoLayout direction="vertical" spacing={4} width="fill-parent">
        <SectionHeader title="Design system" />
        <AutoLayout direction="vertical" spacing={4} width="fill-parent">
          <Checkbox
            id={'ds1'}
            optionText="Added Blade coverage card having coverage greater than 90%"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id={'ds2'}
            optionText="Annotated the reasons with deviation request link if coverage is less than 90%"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id={'ds3'}
            optionText="Used standard mobile and desktop sizes"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id={'ds4'}
            optionText="Added a section for the slot replacements & local components"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id={'ds5'}
            optionText="All the non-Blade components are approved from the Blade team"
            onCheckboxClick={updateChecklist}
          />
        </AutoLayout>
      </AutoLayout>
      <AutoLayout direction="vertical" spacing={4} width="fill-parent">
        <SectionHeader title="States" />
        <AutoLayout direction="vertical" spacing={4} width="fill-parent">
          <Checkbox
            id={'state1'}
            optionText="Empty and loading states are defined properly"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id={'state2'}
            optionText="Added responsive (desktop and mobile) flows"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id={'state3'}
            optionText="Used standard mobile and desktop sizes"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id={'state4'}
            optionText="Designs are light and dark mode compatible"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id={'state5'}
            optionText="Added Figma's annotations to explain behaviours"
            onCheckboxClick={updateChecklist}
          />
          <Checkbox
            id={'state6'}
            optionText="Accounted for edge cases and error states"
            onCheckboxClick={updateChecklist}
          />
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
}

figma.widget.register(Widget);
