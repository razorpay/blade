import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Sync test — verifies that packages/blade/src/utils/cardTicketOutline.ts and
 * packages/blade-core/src/utils/cardTicketOutline.ts stay in sync.
 *
 * blade cannot depend on blade-core yet, so the file is duplicated. This test
 * compares the functional code (excluding the sync-comment header) to catch drift.
 */
describe('cardTicketOutline sync', () => {
  const bladeCorePath = resolve(__dirname, 'cardTicketOutline.ts');
  const bladePath = resolve(__dirname, '../../../blade/src/utils/cardTicketOutline.ts');

  const stripSyncHeader = (content: string): string => {
    const lines = content.split('\n');
    const firstExportIndex = lines.findIndex((line) => line.startsWith('/** Corner radius'));
    return lines.slice(firstExportIndex).join('\n');
  };

  it('blade and blade-core cardTicketOutline.ts should have identical functional code', () => {
    const bladeCoreContent = readFileSync(bladeCorePath, 'utf-8');
    const bladeContent = readFileSync(bladePath, 'utf-8');

    const bladeCoreCode = stripSyncHeader(bladeCoreContent);
    const bladeCode = stripSyncHeader(bladeContent);

    expect(bladeCoreCode).toBe(bladeCode);
  });
});
