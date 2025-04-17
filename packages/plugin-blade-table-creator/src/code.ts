/// <reference types="@figma/plugin-typings" />
import { COMPONENT_KEYS } from './componentKeys';

figma.showUI(__html__, { width: 500, height: 400 });

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
    frameTable.paddingTop = 0;
    frameTable.paddingBottom = 0;
    frameTable.paddingLeft = 0;
    frameTable.paddingRight = 0;
    frameTable.fills = [];
    frameTable.resize(696, frameTable.height);

    const frameTableHeader = figma.createFrame();
    frameTableHeader.name = '<thead>';
    frameTableHeader.layoutMode = 'HORIZONTAL';
    frameTableHeader.counterAxisSizingMode = 'AUTO';
    frameTableHeader.primaryAxisSizingMode = 'FIXED';
    frameTableHeader.primaryAxisAlignItems = 'MIN';
    frameTableHeader.layoutAlign = 'STRETCH';
    frameTableHeader.itemSpacing = 0;

    const frameTableBody = figma.createFrame();
    frameTableBody.name = '<tbody>';
    frameTableBody.layoutMode = 'VERTICAL';
    frameTableBody.counterAxisSizingMode = 'AUTO';
    frameTableBody.primaryAxisSizingMode = 'AUTO';
    frameTableBody.primaryAxisAlignItems = 'MAX';
    frameTableBody.layoutAlign = 'STRETCH';
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

      const createBodyCell = (columnType: string): InstanceNode => {
        const tableBodyCellTextInstance = tableBodyCellText.createInstance();
        switch (columnType) {
          case 'CHECKBOX':
            console.log('Bodycheckbox', tableBodyCellTextInstance.componentProperties);
            tableBodyCellTextInstance.setProperties({ contentType: 'Checkbox' });
            break;
          case 'SPACER':
            console.log('Bodyspacer', tableBodyCellTextInstance.componentProperties);
            tableBodyCellTextInstance.setProperties({ contentType: 'Spacer' });
            break;
          case 'AMOUNT':
            console.log('Bodyamount', tableBodyCellTextInstance.componentProperties);
            tableBodyCellTextInstance.setProperties({ contentType: 'Amount' });
            break;
          case 'TEXT':
          default:
            console.log('Bodytext', tableBodyCellTextInstance.componentProperties);
            tableBodyCellTextInstance.setProperties({ contentType: 'Text (Icon & Asset)' });
            break;
        }
        return tableBodyCellTextInstance;
      };

      const createHeaderCell = (columnType: string, i: number): InstanceNode => {
        const tableHeaderCellTextInstance = tableHeaderCellText.createInstance();
        switch (columnType) {
          case 'CHECKBOX':
            console.log('Headercheckbox', tableHeaderCellTextInstance.componentProperties);
            tableHeaderCellTextInstance.setProperties({
              contentType: 'Selection',
              alignment: 'N/A',
            });
            break;
          case 'SPACER':
            console.log('Headerspacer', tableHeaderCellTextInstance.componentProperties);
            tableHeaderCellTextInstance.setProperties({
              contentType: 'Spacer',
              alignment: 'N/A',
            });
            break;
          case 'AMOUNT':
            console.log('Headeramount', tableHeaderCellTextInstance.componentProperties);
            tableHeaderCellTextInstance.setProperties({
              alignment: 'Right',
              'headerTitle#140:6': msg.columnTitles[i] || `Column ${i + 1}`,
            });
            break;
          case 'TEXT':
          default:
            console.log('Headertext', tableHeaderCellTextInstance.componentProperties);
            tableHeaderCellTextInstance.setProperties({
              contentType: 'Text',
              'headerTitle#140:6': msg.columnTitles[i] || `Column ${i + 1}`,
            });
            break;
        }
        return tableHeaderCellTextInstance;
      };

      // Create header cells
      for (let i = 0; i < columns; i++) {
        const tableHeaderCellTextInstance = createHeaderCell(msg.columnTypes[i], i);
        tableHeaderCellTextInstance.layoutGrow =
          msg.columnTypes[i] === 'CHECKBOX' || msg.columnTypes[i] === 'SPACER' ? 0 : 1;
        frameTableHeader.appendChild(tableHeaderCellTextInstance);
      }

      const createBodyRow = (row: number): FrameNode => {
        const frameTableBodyRow = figma.createFrame();
        frameTableBodyRow.name = `<tr${row + 1}>`;
        frameTableBodyRow.layoutMode = 'HORIZONTAL';
        frameTableBodyRow.counterAxisSizingMode = 'AUTO';
        frameTableBodyRow.primaryAxisSizingMode = 'FIXED';
        frameTableBodyRow.primaryAxisAlignItems = 'MIN';
        frameTableBodyRow.layoutAlign = 'STRETCH';
        frameTableBodyRow.itemSpacing = 0;

        for (let col = 0; col < columns; col++) {
          const tableBodyCellTextInstance = createBodyCell(msg.columnTypes[col]);
          tableBodyCellTextInstance.layoutGrow =
            msg.columnTypes[col] === 'CHECKBOX' || msg.columnTypes[col] === 'SPACER' ? 0 : 1;
          frameTableBodyRow.appendChild(tableBodyCellTextInstance);
        }

        return frameTableBodyRow;
      };

      // Create body row cells
      for (let row = 0; row < rows; row++) {
        frameTableBody.appendChild(createBodyRow(row));
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
      console.error(error);
      figma.notify(
        `Error loading components: ${error instanceof Error ? error.message : String(error)}`,
      );
      figma.closePlugin();
    }
  }

  // Close the plugin
  figma.closePlugin();
};
