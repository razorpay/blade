/// <reference types="@figma/plugin-typings" />
import { COMPONENT_KEYS } from './componentKeys';

figma.showUI(__html__, { width: 500, height: 440 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'create-table') {
    const columns = msg.columns;
    const rows = msg.rows;
    const headerDensity = msg.headerDensity;
    const bodyDensity = msg.bodyDensity;
    const renderType = msg.renderType || 'row'; // Default to 'row' if not specified

    let frameTable: FrameNode | null = null;
    let frameTableHeader: FrameNode | null = null;
    let frameTableBody: FrameNode | null = null;

    frameTable = figma.createFrame();
    frameTable.name = '<table>';
    frameTable.layoutMode = 'VERTICAL';
    frameTable.counterAxisSizingMode = 'AUTO';
    frameTable.primaryAxisSizingMode = 'AUTO';
    frameTable.itemSpacing = 0;
    frameTable.paddingTop = 0;
    frameTable.paddingBottom = 0;
    frameTable.paddingLeft = 0;
    frameTable.paddingRight = 0;
    frameTable.resize(696, frameTable.height);

    if (renderType === 'row') {
      frameTableHeader = figma.createFrame();
      frameTableHeader.name = '<thead>';
      frameTableHeader.layoutMode = 'HORIZONTAL';
      frameTableHeader.counterAxisSizingMode = 'AUTO';
      frameTableHeader.primaryAxisSizingMode = 'FIXED';
      frameTableHeader.primaryAxisAlignItems = 'MIN';
      frameTableHeader.layoutAlign = 'STRETCH';
      frameTableHeader.itemSpacing = 0;
      frameTableHeader.fills = [];
    }

    frameTableBody = figma.createFrame();
    frameTableBody.name = '<tbody>';
    frameTableBody.layoutMode = renderType === 'column' ? 'HORIZONTAL' : 'VERTICAL';
    frameTableBody.counterAxisSizingMode = renderType === 'column' ? 'AUTO' : 'FIXED';
    frameTableBody.primaryAxisSizingMode = 'AUTO';
    frameTableBody.primaryAxisAlignItems = 'MIN';
    frameTableBody.layoutAlign = 'STRETCH';
    frameTableBody.itemSpacing = 0;
    frameTableBody.fills = [];
    frameTableBody.resize(696, frameTableBody.height);

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

      // Create body cells based on render type
      if (renderType === 'column') {
        createColumnWiseTable(
          columns,
          rows,
          msg.columnTypes,
          frameTableBody,
          createHeaderCell,
          createBodyCell,
        );
      } else {
        // Create table header & header cells
        if (frameTableHeader) {
          createTableHead(columns, msg.columnTypes, frameTableHeader, createHeaderCell);
        }

        // Row-wise rendering (original implementation)
        const createBodyRow = (row: number): FrameNode => {
          const frameTableBodyRow = figma.createFrame();
          frameTableBodyRow.name = `<tr${row + 1}>`;
          frameTableBodyRow.layoutMode = 'HORIZONTAL';
          frameTableBodyRow.counterAxisSizingMode = 'AUTO';
          frameTableBodyRow.primaryAxisSizingMode = 'FIXED';
          frameTableBodyRow.primaryAxisAlignItems = 'MIN';
          frameTableBodyRow.layoutAlign = 'STRETCH';
          frameTableBodyRow.itemSpacing = 0;
          frameTableBodyRow.fills = [];

          for (let col = 0; col < columns; col++) {
            const tableBodyCellTextInstance = createBodyCell(msg.columnTypes[col]);
            // Set layout grow based on column type
            if (msg.columnTypes[col] === 'CHECKBOX' || msg.columnTypes[col] === 'SPACER') {
              tableBodyCellTextInstance.layoutGrow = 0;
            } else {
              tableBodyCellTextInstance.layoutGrow = 1;
            }
            frameTableBodyRow.appendChild(tableBodyCellTextInstance);
          }

          return frameTableBodyRow;
        };

        // Create body row cells
        for (let row = 0; row < rows; row++) {
          frameTableBody.appendChild(createBodyRow(row));
        }

        if (frameTableHeader) {
          frameTable.appendChild(frameTableHeader);
        }
      }

      // Build the frame hierarchy
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

// Helper function to create column-wise table
function createColumnWiseTable(
  columns: number,
  rows: number,
  columnTypes: string[],
  frameTableBody: FrameNode,
  createHeaderCell: (columnType: string, index: number) => InstanceNode,
  createBodyCell: (columnType: string) => InstanceNode,
): void {
  // Column-wise rendering
  for (let col = 0; col < columns; col++) {
    const columnFrame = figma.createFrame();
    columnFrame.name = `<col${col + 1}>`;
    columnFrame.layoutMode = 'VERTICAL';
    columnFrame.counterAxisSizingMode = 'AUTO';
    columnFrame.layoutAlign = 'STRETCH';
    columnFrame.itemSpacing = 0;
    columnFrame.fills = [];
    // Set layout align based on column type
    if (columnTypes[col] === 'CHECKBOX' || columnTypes[col] === 'SPACER') {
      columnFrame.layoutGrow = 0;
    } else {
      columnFrame.layoutGrow = 1;
    }

    // Set width to fill container
    // columnFrame.resize(696 / columns, columnFrame.height);

    // Add header cell for this column
    const headerCell = createHeaderCell(columnTypes[col], col);
    // Set layout align based on column type
    if (columnTypes[col] === 'CHECKBOX' || columnTypes[col] === 'SPACER') {
      headerCell.layoutAlign = 'MIN';
    } else {
      headerCell.layoutAlign = 'STRETCH';
    }
    columnFrame.appendChild(headerCell);

    // Add body cells for this column
    for (let row = 0; row < rows; row++) {
      const tableBodyCellTextInstance = createBodyCell(columnTypes[col]);
      tableBodyCellTextInstance.layoutAlign = 'STRETCH';
      // Set layout align based on column type
      if (columnTypes[col] === 'CHECKBOX' || columnTypes[col] === 'SPACER') {
        headerCell.layoutAlign = 'MIN';
      } else {
        headerCell.layoutAlign = 'STRETCH';
      }
      columnFrame.appendChild(tableBodyCellTextInstance);
    }

    frameTableBody.appendChild(columnFrame);
  }
}

// Helper function to create header cells
function createTableHead(
  columns: number,
  columnTypes: string[],
  frameTableHeader: FrameNode,
  createHeaderCell: (columnType: string, index: number) => InstanceNode,
): void {
  for (let i = 0; i < columns; i++) {
    const tableHeaderCellTextInstance = createHeaderCell(columnTypes[i], i);
    // Set layout grow based on column type
    if (columnTypes[i] === 'CHECKBOX' || columnTypes[i] === 'SPACER') {
      tableHeaderCellTextInstance.layoutGrow = 0;
    } else {
      tableHeaderCellTextInstance.layoutGrow = 1;
    }
    frameTableHeader.appendChild(tableHeaderCellTextInstance);
  }
}
