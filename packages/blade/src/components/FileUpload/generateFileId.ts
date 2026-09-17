let fileCounter = 0;

const generateFileId = (): string => `file-${++fileCounter}`;

export { generateFileId };
