/* eslint-disable @typescript-eslint/explicit-function-return-type */
const { AutoLayout, Text, Input, useSyncedState } = figma.widget;

interface ListViewProps {
  id: string;
  listText: string;
}

function ListView({ id, listText }: ListViewProps) {
  const [listTextInput, setListTextInput] = useSyncedState(`${id}_listInputText`, '');
  const [dateTextInput, setDateTextInput] = useSyncedState(`${id}_dateInputText`, '');

  return (
    <AutoLayout
      padding={{ horizontal: 4, vertical: 2 }}
      cornerRadius={4}
      direction="horizontal"
      spacing={4}
      width="fill-parent"
    >
      <AutoLayout verticalAlignItems="center" horizontalAlignItems="center" width={20} height={20}>
        <Text fontSize={14} fontWeight={400} lineHeight={20} fill="#768EA7">
          →
        </Text>
      </AutoLayout>
      <AutoLayout direction="vertical" width="fill-parent">
        <AutoLayout direction="horizontal" wrap={true} spacing={4} width="fill-parent">
          <Text fontSize={14} fontWeight={400} lineHeight={20} fill="#40566D">
            {listText} reviewed by{' '}
          </Text>
          <Input
            value={listTextInput}
            placeholder={"<Reviewer's Name>"}
            onTextEditEnd={(e) => setListTextInput(e.characters)}
            fontSize={14}
            fontWeight={600}
            lineHeight={20}
            fill="#40566D"
            width="fill-parent"
            hoverStyle={{ fill: '#305EFF' }}
          />
        </AutoLayout>
        <AutoLayout direction="horizontal" wrap={true} spacing={4} width="fill-parent">
          {/* <Text fontSize={11} fontWeight={400} lineHeight={16} fill={'#768EA7'} italic={true}>on</Text> */}
          <Input
            value={dateTextInput}
            placeholder="<Review Date>"
            onTextEditEnd={(e) => setDateTextInput(e.characters)}
            fontSize={11}
            fontWeight={400}
            lineHeight={16}
            italic={true}
            fill="#768EA7"
            width="fill-parent"
            hoverStyle={{ fill: '#305EFF' }}
          />
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
}

export default ListView;
