const { AutoLayout, Text } = figma.widget;

interface SectionHeaderProps {
  title: string;
}

function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <AutoLayout>
      <Text fontSize={10} fontWeight={600} fill={'#768EA7'} textCase={'upper'}>
        {title}
      </Text>
    </AutoLayout>
  );
}

export default SectionHeader;
