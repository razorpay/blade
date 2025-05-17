/// <reference types="@figma/plugin-typings" />
import { COMPONENT_KEYS } from './componentKeys';

figma.showUI(__html__, { width: 300, height: 420 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'create-table') {
    const columns = msg.columns;
    const rows = msg.rows;
    const headerDensity = msg.headerDensity;
    const bodyDensity = msg.bodyDensity;

    const frameTable = figma.createFrame();
    frameTable.name = '<table>';
    frameTable.layoutMode = 'VERTICAL';
    frameTable.counterAxisSizingMode = 'AUTO';
    frameTable.primaryAxisSizingMode = 'AUTO';
    frameTable.itemSpacing = 0;
    frameTable.paddingTop = 16;
    frameTable.paddingBottom = 16;
    frameTable.paddingLeft = 16;
    frameTable.paddingRight = 16;
    frameTable.fills = [];

    const frameTableHeader = figma.createFrame();
    frameTableHeader.name = '<thead>';
    frameTableHeader.layoutMode = 'HORIZONTAL';
    frameTableHeader.counterAxisSizingMode = 'AUTO';
    frameTableHeader.primaryAxisSizingMode = 'AUTO';
    frameTableHeader.itemSpacing = 0;

    const frameTableBody = figma.createFrame();
    frameTableBody.name = '<tbody>';
    frameTableBody.layoutMode = 'VERTICAL';
    frameTableBody.counterAxisSizingMode = 'AUTO';
    frameTableBody.primaryAxisSizingMode = 'AUTO';
    frameTableBody.itemSpacing = 0;

    try {
      // Load multiple components from the design system library
      const [tableHeaderCellText, tableBodyCellText] = await Promise.all([
        figma.importComponentByKeyAsync(
          COMPONENT_KEYS.TABLE.TABLE_HEADER.CELL.TEXT.DENSITY[
            headerDensity as keyof typeof COMPONENT_KEYS.TABLE.TABLE_HEADER.CELL.TEXT.DENSITY
          ],
        ),
        figma.importComponentByKeyAsync(
          COMPONENT_KEYS.TABLE.TABLE_BODY.CELL.TEXT.DENSITY[
            bodyDensity as keyof typeof COMPONENT_KEYS.TABLE.TABLE_BODY.CELL.TEXT.DENSITY
          ],
        ),
      ]);

      if (!tableHeaderCellText || !tableBodyCellText) {
        figma.notify(
          'Error: Could not load components from library. Maybe the Blade library is not imported. Please check your assets panel.',
        );
        figma.closePlugin();
        return;
      }

      // Create header cells
      for (let i = 0; i < columns; i++) {
        const tableHeaderCellTextInstance = tableHeaderCellText.createInstance();
        tableHeaderCellTextInstance.setProperties({ contentType: 'Text' });
        frameTableHeader.appendChild(tableHeaderCellTextInstance);
      }

      // Create body rows and cells
      for (let row = 0; row < rows; row++) {
        const frameTableBodyRow = figma.createFrame();
        frameTableBodyRow.name = `<tr${row + 1}>`;
        frameTableBodyRow.layoutMode = 'HORIZONTAL';
        frameTableBodyRow.counterAxisSizingMode = 'AUTO';
        frameTableBodyRow.primaryAxisSizingMode = 'AUTO';
        frameTableBodyRow.itemSpacing = 0;

        // Create cells for each row
        for (let col = 0; col < columns; col++) {
          const tableBodyCellTextInstance = tableBodyCellText.createInstance();
          tableBodyCellTextInstance.setProperties({ contentType: 'Text (Icon & Asset)' });
          frameTableBodyRow.appendChild(tableBodyCellTextInstance);
        }

        frameTableBody.appendChild(frameTableBodyRow);
      }

      // Build the frame hierarchy
      frameTable.appendChild(frameTableHeader);
      frameTable.appendChild(frameTableBody);

      // Center the table in the viewport
      frameTable.x = figma.viewport.center.x - frameTable.width / 2;
      frameTable.y = figma.viewport.center.y - frameTable.height / 2;

      // Select the table
      figma.currentPage.selection = [frameTable];
      figma.viewport.scrollAndZoomIntoView([frameTable]);
    } catch (error: unknown) {
      figma.notify(
        `Error loading components: ${error instanceof Error ? error.message : String(error)}`,
      );
      figma.closePlugin();
    }
  }

  // Close the plugin
  figma.closePlugin();
};
