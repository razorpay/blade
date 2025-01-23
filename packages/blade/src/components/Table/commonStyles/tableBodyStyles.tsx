import { tableRow } from '../tokens';
import { getTableActionsHoverStyles, getTableRowSelector } from '../utils';
import getIn from '~utils/lodashButBetter/get';
import type { Theme } from '~components/BladeProvider';
import type { BoxProps } from '~components/Box';

const getRowWrapperSelector = ({ isVirtualized }: { isVirtualized?: boolean }): string => {
  return isVirtualized ? '.tbody div' : '&';
};

const addTableRowSelectorIFVirtualized = ({
  isVirtualized,
}: {
  isVirtualized?: boolean;
}): string => {
  return isVirtualized ? '.tr' : '';
};

const getTableBodyStyles = ({
  isVirtualized,
  addCommonStyles,
  theme,
  height,
  width,
  isSelectable,
  showStripedRows,
}: {
  isVirtualized?: boolean;
  addCommonStyles?: boolean;
  theme: Theme;
  height?: BoxProps['height'];
  width?: BoxProps['width'];
  isSelectable?: boolean;
  showStripedRows?: boolean;
}): Record<string, unknown> => {
  const shouldAddCommonStyle = isVirtualized ?? addCommonStyles;
  return {
    ...(isVirtualized && {
      '& > div ': {
        overflow: 'auto !important',
        height: `${height} !important`,
        width: `${width} !important`,
      },
      // and remove scroll from the main table element
      '&': {
        overflow: 'hidden !important',
      },
      // for virtualized table, we need to apply some styles to tbody
      '.tbody > div': {
        display: 'block !important',
      },
      '.tbody  div  .tr': {
        display: 'grid',
        gridTemplateColumns: 'var(--data-table-library_grid-template-columns)',
        columnGap: '0',
      },
      '.tbody div .tr:last-child .cell-wrapper': {
        borderBottom: 'none',
      },
      '.tbody div td': {
        padding: '0',
      },
    }),
    // these styles are common for both virtualized and non-virtualized tables
    ...(shouldAddCommonStyle && {
      [`${getRowWrapperSelector({
        isVirtualized,
      })} .row-select-single-selected .cell-wrapper-base, .row-select-selected .cell-wrapper-base`]: {
        backgroundColor: getIn(theme.colors, tableRow.nonStripe.backgroundColorSelected),
      },
      [`${getRowWrapperSelector({
        isVirtualized,
      })}  .row-select-single-selected:hover:not(.disabled-row) .cell-wrapper-base, .row-select-selected:hover:not(.disabled-row) .cell-wrapper-base`]: {
        backgroundColor: getIn(theme.colors, tableRow.nonStripe.backgroundColorSelectedHover),
        ...getTableActionsHoverStyles({
          hoverColor: tableRow.nonStripe.backgroundColorSelectedHover,
          backgroundGradientColor: tableRow.nonStripeWrapper.backgroundColorSelectedHover,
          theme,
        }),
      },
      [`${getRowWrapperSelector({
        isVirtualized,
      })} .row-select-single-selected:focus:not(.disabled-row) .cell-wrapper-base, .row-select-selected:focus:not(.disabled-row) .cell-wrapper-base`]: {
        backgroundColor: getIn(theme.colors, tableRow.nonStripe.backgroundColorSelectedFocus),
        ...getTableActionsHoverStyles({
          hoverColor: tableRow.nonStripe.backgroundColorSelectedFocus,
          backgroundGradientColor: tableRow.nonStripeWrapper.backgroundColorSelectedFocus,
          theme,
        }),
      },
      [`${getRowWrapperSelector({
        isVirtualized,
      })} .row-select-single-selected:active:not(.disabled-row) .cell-wrapper-base, .row-select-selected:active:not(.disabled-row) .cell-wrapper-base`]: {
        backgroundColor: getIn(theme.colors, tableRow.nonStripe.backgroundColorSelectedActive),
        ...getTableActionsHoverStyles({
          hoverColor: tableRow.nonStripe.backgroundColorSelectedActive,
          backgroundGradientColor: tableRow.nonStripe.backgroundColorHover,
          theme,
        }),
      },

      ...(isSelectable && {
        [`${getRowWrapperSelector({
          isVirtualized,
        })} ${getTableRowSelector({
          isVirtualized,
        })}:active:not(.disabled-row) .cell-wrapper`]: {
          backgroundColor: getIn(theme.colors, tableRow.nonStripeWrapper.backgroundColorActive),
        },
      }),

      ...(showStripedRows && {
        [`${getRowWrapperSelector({
          isVirtualized,
        })}  ${getTableRowSelector({
          isVirtualized,
        })}:nth-child(even) .cell-wrapper`]: {
          backgroundColor: getIn(theme.colors, tableRow.stripeWrapper.backgroundColor),
        },
        [`${getRowWrapperSelector({
          isVirtualized,
        })} ${getTableRowSelector({
          isVirtualized,
        })}:nth-child(even) .cell-wrapper-base`]: {
          backgroundColor: tableRow.stripe.backgroundColor,
        },
      }),

      ...(showStripedRows &&
        isSelectable && {
          [`${getRowWrapperSelector({
            isVirtualized,
          })} ${getTableRowSelector({
            isVirtualized,
          })}:nth-child(even):hover:not(.disabled-row) .cell-wrapper`]: {
            backgroundColor: getIn(theme.colors, tableRow.stripeWrapper.backgroundColorHover),
          },
          [`${getRowWrapperSelector({
            isVirtualized,
          })} ${getTableRowSelector({
            isVirtualized,
          })}:nth-child(even):focus:not(.disabled-row) .cell-wrapper`]: {
            backgroundColor: getIn(theme.colors, tableRow.stripeWrapper.backgroundColorFocus),
          },
          [`${getRowWrapperSelector({
            isVirtualized,
          })} ${getTableRowSelector({
            isVirtualized,
          })}:nth-child(even):active:not(.disabled-row) .cell-wrapper`]: {
            backgroundColor: getIn(theme.colors, tableRow.stripeWrapper.backgroundColorActive),
          },
          [`${getRowWrapperSelector({
            isVirtualized,
          })} .row-select-single-selected:nth-child(even) .cell-wrapper, .row-select-selected:nth-child(even) .cell-wrapper`]: {
            backgroundColor: getIn(theme.colors, tableRow.stripeWrapper.backgroundColorSelected),
          },
          [`${getRowWrapperSelector({
            isVirtualized,
          })} .row-select-single-selected:nth-child(even):hover:not(.disabled-row) .cell-wrapper, .row-select-selected:nth-child(even):hover:not(.disabled-row) .cell-wrapper`]: {
            backgroundColor: getIn(
              theme.colors,
              tableRow.stripeWrapper.backgroundColorSelectedHover,
            ),
          },
          [`${getRowWrapperSelector({
            isVirtualized,
          })} .row-select-single-selected:nth-child(even):focus:not(.disabled-row) .cell-wrapper, .row-select-selected:nth-child(even):focus:not(.disabled-row) .cell-wrapper`]: {
            backgroundColor: getIn(
              theme.colors,
              tableRow.stripeWrapper.backgroundColorSelectedFocus,
            ),
          },
          [`${getRowWrapperSelector({
            isVirtualized,
          })} .row-select-single-selected:nth-child(even):active:not(.disabled-row) .cell-wrapper, .row-select-selected:nth-child(even):active:not(.disabled-row) .cell-wrapper`]: {
            backgroundColor: getIn(
              theme.colors,
              tableRow.stripeWrapper.backgroundColorSelectedActive,
            ),
          },

          [`${getRowWrapperSelector({
            isVirtualized,
          })} ${getTableRowSelector({
            isVirtualized,
          })}:nth-child(even):hover:not(.disabled-row) .cell-wrapper-base`]: {
            backgroundColor: getIn(theme.colors, tableRow.stripe.backgroundColorHover),
            ...getTableActionsHoverStyles({
              hoverColor: tableRow.stripe.backgroundColorHover,
              theme,
              backgroundGradientColor: tableRow.stripeWrapper.backgroundColorHover,
            }),
          },
          [`${getRowWrapperSelector({
            isVirtualized,
          })} ${getTableRowSelector({
            isVirtualized,
          })}:nth-child(even):focus:not(.disabled-row) .cell-wrapper-base`]: {
            backgroundColor: getIn(theme.colors, tableRow.stripe.backgroundColorFocus),
            ...getTableActionsHoverStyles({
              hoverColor: tableRow.stripe.backgroundColorFocus,
              theme,
              backgroundGradientColor: tableRow.stripeWrapper.backgroundColorFocus,
            }),
          },
          [`${getRowWrapperSelector({
            isVirtualized,
          })} ${getTableRowSelector({
            isVirtualized,
          })}:nth-child(even):active:not(.disabled-row) .cell-wrapper-base`]: {
            backgroundColor: getIn(theme.colors, tableRow.stripe.backgroundColorActive),
            ...getTableActionsHoverStyles({
              hoverColor: tableRow.stripe.backgroundColorActive,
              backgroundGradientColor: tableRow.stripe.backgroundColorHover,
              theme,
            }),
          },

          [`${getRowWrapperSelector({
            isVirtualized,
          })}  ${addTableRowSelectorIFVirtualized({
            isVirtualized,
          })}.row-select-single-selected:nth-child(even) .cell-wrapper-base, .row-select-selected:nth-child(even) .cell-wrapper-base `]: {
            backgroundColor: getIn(theme.colors, tableRow.stripe.backgroundColorSelected),
            ...getTableActionsHoverStyles({
              hoverColor: tableRow.stripe.backgroundColorSelected,
              theme,
              backgroundGradientColor: tableRow.stripeWrapper.backgroundColorSelected,
            }),
          },
          [`${getRowWrapperSelector({
            isVirtualized,
          })}  ${addTableRowSelectorIFVirtualized({
            isVirtualized,
          })} .row-select-single-selected:nth-child(even):hover:not(.disabled-row) .cell-wrapper-base, .row-select-selected:nth-child(even):hover:not(.disabled-row) .cell-wrapper-base `]: {
            backgroundColor: getIn(theme.colors, tableRow.stripe.backgroundColorSelectedHover),
            ...getTableActionsHoverStyles({
              hoverColor: tableRow.stripe.backgroundColorSelectedHover,
              theme,
              backgroundGradientColor: tableRow.stripeWrapper.backgroundColorSelectedHover,
            }),
          },
          [`${getRowWrapperSelector({
            isVirtualized,
          })}  ${addTableRowSelectorIFVirtualized({
            isVirtualized,
          })} .row-select-single-selected:nth-child(even):focus:not(.disabled-row) .cell-wrapper-base, .row-select-selected:nth-child(even):focus:not(.disabled-row) .cell-wrapper-base `]: {
            backgroundColor: getIn(theme.colors, tableRow.stripe.backgroundColorSelectedFocus),
            ...getTableActionsHoverStyles({
              hoverColor: tableRow.stripe.backgroundColorSelectedFocus,
              theme,
              backgroundGradientColor: tableRow.stripeWrapper.backgroundColorSelectedFocus,
            }),
          },
          [`${getRowWrapperSelector({
            isVirtualized,
          })}  ${addTableRowSelectorIFVirtualized({
            isVirtualized,
          })}.row-select-single-selected:nth-child(even):active:not(.disabled-row) .cell-wrapper-base, .row-select-selected:nth-child(even):active:not(.disabled-row) .cell-wrapper-base `]: {
            backgroundColor: getIn(theme.colors, tableRow.stripe.backgroundColorSelectedActive),
            ...getTableActionsHoverStyles({
              hoverColor: tableRow.stripe.backgroundColorSelectedActive,
              theme,
              backgroundGradientColor: tableRow.stripe.backgroundColorHover,
            }),
          },
        }),
    }),
  };
};
export { getTableBodyStyles };
