type GenUISpacingComponent = {
  component?: string;
  content?: string;
  text?: string;
};

/**
 * CARD and TABLE sit in the animated ring's container, whose 12px vertical margin adds to the
 * gaps around them. Text (or a title) to a card and a card to the next section are therefore
 * 12px (`spacing.4`), so that with the ring's margin the text sits 24px from the card, as in RAY's
 * chat.
 */
const genUISpacingContract = {
  headingToText: 'spacing.3',
  textToH3: 'spacing.7',
  h3ToCardTable: 'spacing.4',
  textToCardTable: 'spacing.4',
  cardTableToNextH3: 'spacing.4',
  cardTableToFooterAction: 'spacing.7',
  textParagraphGap: 'spacing.3',
  compactCardPadding: 'spacing.5',
  compactCardRowGap: 'spacing.3',
} as const;

const cardTableComponentTypes = new Set(['CARD', 'TABLE']);
const actionComponentTypes = new Set(['BUTTON', 'LINK']);

const startsWithH3OrBelow = (content?: string): boolean => {
  return /^#{3,6}\s/.test(content?.trimStart() ?? '');
};

const endsWithH3OrBelow = (content?: string): boolean => {
  const lines = content
    ?.trim()
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const lastLine = lines?.[lines.length - 1];
  return /^#{3,6}\s/.test(lastLine ?? '');
};

const getGenUIComponentTopSpacing = (
  previousComponent?: GenUISpacingComponent,
  currentComponent?: GenUISpacingComponent,
): typeof genUISpacingContract[keyof typeof genUISpacingContract] | undefined => {
  if (!previousComponent?.component || !currentComponent?.component) return undefined;

  const previousType = previousComponent.component;
  const currentType = currentComponent.component;

  if (cardTableComponentTypes.has(currentType) && previousType === 'TEXT') {
    return endsWithH3OrBelow(previousComponent.content)
      ? genUISpacingContract.h3ToCardTable
      : genUISpacingContract.textToCardTable;
  }

  if (currentType === 'TEXT' && startsWithH3OrBelow(currentComponent.content)) {
    return cardTableComponentTypes.has(previousType)
      ? genUISpacingContract.cardTableToNextH3
      : genUISpacingContract.textToH3;
  }

  if (cardTableComponentTypes.has(previousType) && actionComponentTypes.has(currentType)) {
    return genUISpacingContract.cardTableToFooterAction;
  }

  return undefined;
};

export { genUISpacingContract, getGenUIComponentTopSpacing };
