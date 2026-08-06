import type { GenUIComponent } from './GenUIComponents';

type GenUIDuplicateMarkdownTableEvent = {
  type: 'DUPLICATE_MARKDOWN_TABLE_REMOVED';
  textComponentPath: number[];
  tableComponentPath: number[];
  removedBlockCount: number;
  tableFingerprint: string;
  reason: 'MATCHED_STRUCTURED_TABLE';
};

type DuplicateMarkdownTableResult = {
  components?: GenUIComponent[];
  events: GenUIDuplicateMarkdownTableEvent[];
};

type MarkdownTableBlock = {
  startIndex: number;
  endIndex: number;
  headers: string[];
  rows: string[][];
};

type MarkdownTableMatch = {
  block: MarkdownTableBlock;
  structuredTable: StructuredTable;
};

type StructuredTable = {
  headers: string[];
  rows: string[][];
  path: number[];
  fingerprint: string;
};

type TextGenUIComponent = GenUIComponent & {
  component: 'TEXT';
  content?: string;
};

const MIN_HEADER_OVERLAP = 2;
const MIN_COLUMNS = 2;
const STRONG_IDENTIFIER_PATTERN = /\b[a-z]{2,12}_[a-z0-9][a-z0-9_]*\b/i;
const LOW_CONFIDENCE_CELL_VALUES = new Set([
  'active',
  'authorized',
  'cancelled',
  'captured',
  'complete',
  'completed',
  'failed',
  'failure',
  'inactive',
  'paid',
  'pending',
  'processed',
  'refunded',
  'success',
  'successful',
]);

const normalizeCell = (value: string): string =>
  value
    .toLowerCase()
    .replace(/&nbsp;/g, ' ')
    .replace(/[^a-z0-9]+/g, '')
    .trim();

const normalizeHeader = normalizeCell;

const isGenUIComponent = (value: unknown): value is GenUIComponent => {
  return Boolean(value && typeof value === 'object' && 'component' in value);
};

const getComponentChildren = (component: GenUIComponent): GenUIComponent[] => {
  const children = (component as { children?: unknown }).children;

  if (Array.isArray(children)) {
    return children.filter(isGenUIComponent);
  }

  if (isGenUIComponent(children)) {
    return [children];
  }

  return [];
};

const getCellDisplayValues = (cell: unknown): string[] => {
  if (!cell || typeof cell !== 'object') {
    return [];
  }

  const typedCell = cell as {
    component?: string;
    value?: string | number;
    text?: string;
  };

  switch (typedCell.component) {
    case 'TEXT':
    case 'BADGE':
    case 'INDICATOR':
    case 'DATE':
    case 'AMOUNT':
      return typedCell.value === undefined || typedCell.value === null
        ? []
        : [String(typedCell.value)];
    case 'LINK':
      return typedCell.text ? [typedCell.text] : [];
    default:
      return [];
  }
};

const getStructuredRows = (rows: unknown): string[][] | null => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return null;
  }

  const structuredRows = rows.map((row) => {
    if (!Array.isArray(row)) {
      return [];
    }

    return row.map((cell) => getCellDisplayValues(cell)[0] ?? '');
  });

  return structuredRows.every((row) => row.length >= MIN_COLUMNS) ? structuredRows : null;
};

const getStructuredTableFingerprint = (headers: string[], path: number[]): string => {
  return `${path.join('.')}:${headers.map(normalizeHeader).join('|')}`;
};

const collectStructuredTables = (
  components: GenUIComponent[] | undefined,
  path: number[] = [],
): StructuredTable[] => {
  if (!components) {
    return [];
  }

  return components.flatMap((component, index) => {
    const componentPath = [...path, index];
    const componentWithTableProps = component as { headers?: unknown; rows?: unknown };
    const headers = Array.isArray(componentWithTableProps.headers)
      ? componentWithTableProps.headers.filter(
          (header): header is string => typeof header === 'string',
        )
      : [];
    const rows = getStructuredRows(componentWithTableProps.rows);
    const ownTable =
      component?.component === 'TABLE' && headers.length >= MIN_COLUMNS && rows
        ? [
            {
              headers,
              rows,
              path: componentPath,
              fingerprint: getStructuredTableFingerprint(headers, componentPath),
            },
          ]
        : [];

    return [
      ...ownTable,
      ...collectStructuredTables(getComponentChildren(component), componentPath),
    ];
  });
};

const splitMarkdownTableRow = (line: string): string[] => {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
};

const isMarkdownTableSeparatorLine = (line: string, columnCount: number): boolean => {
  const cells = splitMarkdownTableRow(line);

  return (
    cells.length === columnCount &&
    cells.every((cell) => /^:?-{3,}:?$/.test(cell.replace(/\s/g, '')))
  );
};

const isMarkdownTableRowLine = (line: string): boolean => {
  return (line.match(/\|/g) ?? []).length >= MIN_COLUMNS;
};

const findMarkdownTableBlocks = (content: string): MarkdownTableBlock[] => {
  const lines = content.split('\n');
  const blocks: MarkdownTableBlock[] = [];
  let isInsideCodeFence = false;

  for (let index = 0; index < lines.length - 1; index += 1) {
    const line = lines[index];

    if (/^\s*(```|~~~)/.test(line)) {
      isInsideCodeFence = !isInsideCodeFence;
      continue;
    }

    if (isInsideCodeFence || !isMarkdownTableRowLine(line)) {
      continue;
    }

    const headers = splitMarkdownTableRow(line);
    if (
      headers.length < MIN_COLUMNS ||
      !isMarkdownTableSeparatorLine(lines[index + 1], headers.length)
    ) {
      continue;
    }

    const rows: string[][] = [];
    let endIndex = index + 1;

    for (let rowIndex = index + 2; rowIndex < lines.length; rowIndex += 1) {
      const rowLine = lines[rowIndex];

      if (/^\s*(```|~~~)/.test(rowLine) || !isMarkdownTableRowLine(rowLine)) {
        break;
      }

      const row = splitMarkdownTableRow(rowLine);
      if (row.length !== headers.length) {
        break;
      }

      rows.push(row);
      endIndex = rowIndex;
    }

    if (rows.length > 0) {
      blocks.push({
        startIndex: index,
        endIndex,
        headers,
        rows,
      });
      index = endIndex;
    }
  }

  return blocks;
};

const getHeaderOverlapCount = (markdownHeaders: string[], structuredHeaders: string[]): number => {
  const normalizedStructuredHeaders = new Set(structuredHeaders.map(normalizeHeader));

  return markdownHeaders.reduce((count, header) => {
    return normalizedStructuredHeaders.has(normalizeHeader(header)) ? count + 1 : count;
  }, 0);
};

const getDistinctMarkdownValues = (row: string[]): Set<string> => {
  return new Set(
    row
      .map(normalizeCell)
      .filter(
        (value) =>
          value.length >= 4 && !/^\d+$/.test(value) && !LOW_CONFIDENCE_CELL_VALUES.has(value),
      ),
  );
};

const getStrongIdentifierValues = (row: string[]): Set<string> => {
  return new Set(
    row
      .filter((value) => STRONG_IDENTIFIER_PATTERN.test(value))
      .map(normalizeCell)
      .filter(Boolean),
  );
};

const hasSharedStrongIdentifier = (markdownRow: string[], structuredRow: string[]): boolean => {
  const markdownIdentifiers = getStrongIdentifierValues(markdownRow);

  if (markdownIdentifiers.size === 0) {
    return false;
  }

  const structuredIdentifiers = getStrongIdentifierValues(structuredRow);
  return [...markdownIdentifiers].some((value) => structuredIdentifiers.has(value));
};

const structuredRowsContainMarkdownRow = (
  markdownRow: string[],
  structuredRows: string[][],
): boolean => {
  const markdownValues = getDistinctMarkdownValues(markdownRow);

  if (markdownValues.size === 0) {
    return false;
  }

  return structuredRows.some((structuredRow) => {
    if (hasSharedStrongIdentifier(markdownRow, structuredRow)) {
      return true;
    }

    const structuredValues = new Set(structuredRow.map(normalizeCell).filter(Boolean));
    const matchingValueCount = [...markdownValues].filter((value) => structuredValues.has(value))
      .length;

    return matchingValueCount >= 2;
  });
};

const getMatchingStructuredTable = (
  markdownTable: MarkdownTableBlock,
  structuredTables: StructuredTable[],
): StructuredTable | undefined => {
  return structuredTables.find((structuredTable) => {
    if (
      getHeaderOverlapCount(markdownTable.headers, structuredTable.headers) < MIN_HEADER_OVERLAP
    ) {
      return false;
    }

    const matchingRowCount = markdownTable.rows.filter((row) =>
      structuredRowsContainMarkdownRow(row, structuredTable.rows),
    ).length;

    return matchingRowCount >= Math.min(2, markdownTable.rows.length);
  });
};

const getDuplicateMarkdownTableMatches = (
  content: string,
  structuredTables: StructuredTable[],
): MarkdownTableMatch[] => {
  return findMarkdownTableBlocks(content)
    .map((block) => ({
      block,
      structuredTable: getMatchingStructuredTable(block, structuredTables),
    }))
    .filter((match): match is MarkdownTableMatch => Boolean(match.structuredTable));
};

const normalizeTextSegment = (content: string): string => {
  return content.replace(/\n{3,}/g, '\n\n').trim();
};

const createTextComponent = (
  sourceComponent: GenUIComponent,
  content: string,
): TextGenUIComponent | undefined => {
  const normalizedContent = normalizeTextSegment(content);

  if (!normalizedContent) {
    return undefined;
  }

  return {
    ...sourceComponent,
    component: 'TEXT',
    content: normalizedContent,
  };
};

const getDirectFollowingSiblingTableIndex = (
  structuredTablePath: number[],
  textComponentPath: number[],
): number | undefined => {
  if (structuredTablePath.length !== textComponentPath.length) {
    return undefined;
  }

  const tableIndex = structuredTablePath[structuredTablePath.length - 1];
  const textIndex = textComponentPath[textComponentPath.length - 1];
  const hasSameParentPath = structuredTablePath
    .slice(0, -1)
    .every((pathIndex, index) => pathIndex === textComponentPath[index]);

  if (!hasSameParentPath || tableIndex <= textIndex) {
    return undefined;
  }

  return tableIndex;
};

const stripDuplicateMarkdownTablesFromContent = (
  content: string,
  structuredTables: StructuredTable[],
  textComponentPath: number[],
): { content: string; events: GenUIDuplicateMarkdownTableEvent[] } => {
  if (structuredTables.length === 0) {
    return { content, events: [] };
  }

  const lines = content.split('\n');
  const removableBlocks = getDuplicateMarkdownTableMatches(content, structuredTables);

  if (removableBlocks.length === 0) {
    return { content, events: [] };
  }

  const removableLineIndexes = new Set<number>();
  const events = removableBlocks.map(({ block, structuredTable }) => {
    for (let index = block.startIndex; index <= block.endIndex; index += 1) {
      removableLineIndexes.add(index);
    }

    return {
      type: 'DUPLICATE_MARKDOWN_TABLE_REMOVED' as const,
      textComponentPath,
      tableComponentPath: structuredTable.path,
      removedBlockCount: 1,
      tableFingerprint: structuredTable.fingerprint,
      reason: 'MATCHED_STRUCTURED_TABLE' as const,
    };
  });

  return {
    content: lines
      .filter((_, index) => !removableLineIndexes.has(index))
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim(),
    events,
  };
};

const buildDuplicateMarkdownTableEvents = (
  matches: MarkdownTableMatch[],
  textComponentPath: number[],
): GenUIDuplicateMarkdownTableEvent[] => {
  return matches.map(({ structuredTable }) => ({
    type: 'DUPLICATE_MARKDOWN_TABLE_REMOVED',
    textComponentPath,
    tableComponentPath: structuredTable.path,
    removedBlockCount: 1,
    tableFingerprint: structuredTable.fingerprint,
    reason: 'MATCHED_STRUCTURED_TABLE',
  }));
};

const pushTextComponentIntoMap = (
  textComponentsByIndex: Map<number, TextGenUIComponent[]>,
  index: number,
  textComponent: TextGenUIComponent,
): void => {
  const textComponents = textComponentsByIndex.get(index) ?? [];
  textComponents.push(textComponent);
  textComponentsByIndex.set(index, textComponents);
};

const getInterleavedTextPlacements = (
  component: GenUIComponent,
  content: string,
  structuredTables: StructuredTable[],
  componentPath: number[],
): {
  beforeComponentTextByIndex: Map<number, TextGenUIComponent[]>;
  afterComponentTextByIndex: Map<number, TextGenUIComponent[]>;
  events: GenUIDuplicateMarkdownTableEvent[];
  shouldInterleave: boolean;
} => {
  const matches = getDuplicateMarkdownTableMatches(content, structuredTables);

  if (matches.length < 2) {
    return {
      beforeComponentTextByIndex: new Map(),
      afterComponentTextByIndex: new Map(),
      events: [],
      shouldInterleave: false,
    };
  }

  const tableIndexes = matches.map(({ structuredTable }) =>
    getDirectFollowingSiblingTableIndex(structuredTable.path, componentPath),
  );

  if (
    tableIndexes.some((tableIndex): tableIndex is undefined => tableIndex === undefined) ||
    new Set(tableIndexes).size !== tableIndexes.length
  ) {
    return {
      beforeComponentTextByIndex: new Map(),
      afterComponentTextByIndex: new Map(),
      events: [],
      shouldInterleave: false,
    };
  }

  const lines = content.split('\n');
  const beforeComponentTextByIndex = new Map<number, TextGenUIComponent[]>();
  const afterComponentTextByIndex = new Map<number, TextGenUIComponent[]>();
  let cursorIndex = 0;

  matches.forEach(({ block }, matchIndex) => {
    const segmentBeforeTable = createTextComponent(
      component,
      lines.slice(cursorIndex, block.startIndex).join('\n'),
    );
    const tableIndex = tableIndexes[matchIndex];

    if (segmentBeforeTable && tableIndex !== undefined) {
      pushTextComponentIntoMap(beforeComponentTextByIndex, tableIndex, segmentBeforeTable);
    }

    cursorIndex = block.endIndex + 1;
  });

  const lastTableIndex = tableIndexes[tableIndexes.length - 1];
  const trailingSegment = createTextComponent(component, lines.slice(cursorIndex).join('\n'));

  if (trailingSegment && lastTableIndex !== undefined) {
    pushTextComponentIntoMap(afterComponentTextByIndex, lastTableIndex, trailingSegment);
  }

  return {
    beforeComponentTextByIndex,
    afterComponentTextByIndex,
    events: buildDuplicateMarkdownTableEvents(matches, componentPath),
    shouldInterleave: true,
  };
};

const dedupeComponentTree = (
  components: GenUIComponent[],
  structuredTables: StructuredTable[],
  path: number[] = [],
): { components: GenUIComponent[]; events: GenUIDuplicateMarkdownTableEvent[] } => {
  const events: GenUIDuplicateMarkdownTableEvent[] = [];
  const dedupedComponents: GenUIComponent[] = [];
  const skippedTextIndexes = new Set<number>();
  const beforeComponentTextByIndex = new Map<number, TextGenUIComponent[]>();
  const afterComponentTextByIndex = new Map<number, TextGenUIComponent[]>();

  components.forEach((component, index) => {
    const componentPath = [...path, index];

    if (component?.component !== 'TEXT') {
      return;
    }

    const content = (component as { content?: string }).content;
    if (!content) {
      return;
    }

    const interleavedTextPlacements = getInterleavedTextPlacements(
      component,
      content,
      structuredTables,
      componentPath,
    );

    if (!interleavedTextPlacements.shouldInterleave) {
      return;
    }

    skippedTextIndexes.add(index);
    events.push(...interleavedTextPlacements.events);
    interleavedTextPlacements.beforeComponentTextByIndex.forEach((textComponents, tableIndex) => {
      textComponents.forEach((textComponent) =>
        pushTextComponentIntoMap(beforeComponentTextByIndex, tableIndex, textComponent),
      );
    });
    interleavedTextPlacements.afterComponentTextByIndex.forEach((textComponents, tableIndex) => {
      textComponents.forEach((textComponent) =>
        pushTextComponentIntoMap(afterComponentTextByIndex, tableIndex, textComponent),
      );
    });
  });

  components.forEach((component, index) => {
    const componentPath = [...path, index];

    dedupedComponents.push(...(beforeComponentTextByIndex.get(index) ?? []));

    if (skippedTextIndexes.has(index)) {
      dedupedComponents.push(...(afterComponentTextByIndex.get(index) ?? []));
      return;
    }

    if (component?.component === 'TEXT') {
      const content = (component as { content?: string }).content;

      if (content) {
        const result = stripDuplicateMarkdownTablesFromContent(
          content,
          structuredTables,
          componentPath,
        );
        events.push(...result.events);

        if (result.content) {
          const dedupedTextComponent: TextGenUIComponent = {
            ...component,
            component: 'TEXT',
            content: result.content,
          };
          dedupedComponents.push(dedupedTextComponent);
        }
        return;
      }
    }

    const children = (component as { children?: unknown }).children;
    if (Array.isArray(children)) {
      const childResult = dedupeComponentTree(
        children.filter(isGenUIComponent),
        structuredTables,
        componentPath,
      );
      events.push(...childResult.events);
      dedupedComponents.push({ ...component, children: childResult.components } as GenUIComponent);
      return;
    }

    if (isGenUIComponent(children)) {
      const childResult = dedupeComponentTree([children], structuredTables, componentPath);
      events.push(...childResult.events);
      dedupedComponents.push({
        ...component,
        children: childResult.components[0],
      } as GenUIComponent);
      return;
    }

    dedupedComponents.push(component);
    dedupedComponents.push(...(afterComponentTextByIndex.get(index) ?? []));
  });

  return { components: dedupedComponents, events };
};

const applyDuplicateMarkdownTableHandling = (
  components?: GenUIComponent[],
  isEnabled = false,
): DuplicateMarkdownTableResult => {
  if (!isEnabled || !components || components.length === 0) {
    return { components, events: [] };
  }

  const structuredTables = collectStructuredTables(components);
  if (structuredTables.length === 0) {
    return { components, events: [] };
  }

  return dedupeComponentTree(components, structuredTables);
};

export { applyDuplicateMarkdownTableHandling };
export type { GenUIDuplicateMarkdownTableEvent };
