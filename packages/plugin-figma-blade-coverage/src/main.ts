/* eslint-disable @typescript-eslint/restrict-plus-operands */
import {
  getParentNode,
  traverseNode,
  getSelectedNodesOrAllNodes,
} from '@create-figma-plugin/utilities';

import {
  BLADE_BOX_BACKGROUND_COLOR_STYLE_IDS,
  BLADE_BOX_BORDER_COLOR_STYLE_IDS,
  BLADE_COLOR_STYLE_IDS,
  BLADE_COMPONENT_IDS,
  BLADE_COMPONENT_IDS_HAVING_SLOT,
  BLADE_TEXT_STYLE_IDS,
} from './bladeLibraryConstants';
import { sendAnalytics } from './utils/sendAnalytics';

type CoverageMetrics = {
  bladeComponents: number;
  bladeTextStyles: number;
  bladeColorStyles: number;
  nonBladeTextStyles: number;
  nonBladeColorStyles: number;
  nonBladeComponents: number; // rename to non-blade components
  totalLayers: number; // rename to total layers
  bladeCoverage: number;
};

const MAIN_FRAME_NODES = ['FRAME', 'SECTION'];
const NODES_SKIP_FROM_COVERAGE = ['GROUP', 'SECTION', 'VECTOR', 'FRAME', 'ELLIPSE'];
const nonBladeHighlighterNodes: BaseNode[] = [];
const bladeCoverageCards: BaseNode[] = [];

const highlightNonBladeNode = (node: SceneNode, desc?: string): void => {
  const highlighterBox = figma.createRectangle();
  const nodeType = `${node.type
    .toUpperCase()
    .charAt(0)
    .toUpperCase()}${node.type.toLowerCase().slice(1)}`;
  highlighterBox.name = `Desc: ${desc}, Type: ${nodeType}, Name: ${node.name}`;
  // selection node just gives the x and y relative to the frame we need WRT canvas hence, we need to use absoluteTransform prop
  highlighterBox.x = node.absoluteTransform[0][2] - 1;
  highlighterBox.y = node.absoluteTransform[1][2] - 1;
  highlighterBox.resize(node.width + 2, node.height + 2);
  highlighterBox.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0 }];
  highlighterBox.strokes = [{ type: 'SOLID', color: { r: 0.7, g: 0, b: 0 } }];
  nonBladeHighlighterNodes.push(highlighterBox);
};

const traverseUpTillMainFrame = (node: BaseNode): BaseNode => {
  try {
    if (node !== null) {
      if (getParentNode(node)?.type === 'PAGE') {
        return node;
      } else if (node.parent) {
        return traverseUpTillMainFrame(node.parent);
      }
    }
  } catch (error: unknown) {
    console.error(error);
    figma.notify('⚠️ Error in traversing main frame node. Please try again');
    figma.closePlugin();
  }

  return node;
};

const renderCoverageCard = async ({
  mainFrameNode,
  bladeComponents,
  nonBladeComponents,
  nonBladeColorStyles,
  nonBladeTextStyles,
  totalLayers,
  bladeCoverage,
}: {
  mainFrameNode: SceneNode;
} & CoverageMetrics): Promise<void> => {
  // these are from payment light theme but it should work as far as the plugin is being run from Razorpay org
  const COVERAGE_CARD_COMPONENT_KEY = 'c5744871a8db11b02c65b4843d68779f2ff99ed3';
  const BLADE_INTENT_COLOR_KEYS = {
    positive: {
      id: '',
      key: 'c61aca5db3a21aead10da4889ad2b31c74d93529',
    },
    negative: {
      id: '',
      key: 'cccac5aac53e828b3be3e8617e462f8ee1a058dd',
    },
    notice: {
      id: '',
      key: '707d5fdfc748a5fc4777d212ee247bc40a86fe85',
    },
  };

  try {
    const coverageCardComponent = await figma.importComponentByKeyAsync(
      COVERAGE_CARD_COMPONENT_KEY,
    );
    const coverageCardInstance = coverageCardComponent.createInstance();
    coverageCardInstance.visible = false;
    if (mainFrameNode.width < 500) {
      coverageCardInstance.x = mainFrameNode.x + 20; // for mobile screens the card shouldn't offset a lot
    } else {
      coverageCardInstance.x = mainFrameNode.x + 150; // 150 because we want to prevent conflict with the frame name
    }
    coverageCardInstance.y = mainFrameNode.y - coverageCardComponent.height;

    // import styles for popsitive, negative and notice colors and set their id in BLADE_INTENT_COLOR_KEYS
    for await (const [intent, intentObject] of Object.entries(BLADE_INTENT_COLOR_KEYS)) {
      const colorStyle = await figma.importStyleByKeyAsync(intentObject.key);
      BLADE_INTENT_COLOR_KEYS[intent as 'positive' | 'negative' | 'notice'].id = colorStyle.id;
    }

    let coverageColorIntent = BLADE_INTENT_COLOR_KEYS.negative.id;
    let bladeCoverageType = 'Very Low 😭';
    const PROGRESS_BAR_MAX_WIDTH = 254;
    const bladeCoverageProgress = (bladeCoverage / 100) * PROGRESS_BAR_MAX_WIDTH;

    // calculate coverage type and intent colors for coverage
    if (bladeCoverage > 70) {
      bladeCoverageType = 'Good 😊';
      coverageColorIntent = BLADE_INTENT_COLOR_KEYS.positive.id;
    } else if (bladeCoverage > 50 && bladeCoverage < 70) {
      bladeCoverageType = 'Low 😥';
      coverageColorIntent = BLADE_INTENT_COLOR_KEYS.notice.id;
    }

    coverageCardInstance.setProperties({
      'bladeCoverageType#45789:0': bladeCoverageType,
      'bladeCoverage#45789:1': `${bladeCoverage.toFixed(2)}%`,
      'totalLayers#45789:2': totalLayers.toString().padStart(2, '0'),
      'bladeComponents#45789:3': bladeComponents.toString().padStart(2, '0'),
      'nonBladeComponents#45789:4': nonBladeComponents.toString().padStart(2, '0'),
      'nonBladeTextStyles#45789:5': nonBladeTextStyles.toString().padStart(2, '0'),
      'nonBladeColorStyles#45789:6': nonBladeColorStyles.toString().padStart(2, '0'),
    });

    const detachedCoverageCard = coverageCardInstance.detachInstance();
    traverseNode(detachedCoverageCard, (traversedNode) => {
      if (traversedNode.type === 'TEXT') {
        if (['bladeCoverageType', 'bladeCoverage'].includes(traversedNode.name)) {
          traversedNode.setRangeFillStyleId(
            0,
            traversedNode.characters.length,
            coverageColorIntent,
          );
        }
      } else if (traversedNode.type === 'RECTANGLE' && traversedNode.name === 'Progress') {
        traversedNode.resizeWithoutConstraints(bladeCoverageProgress || 0.1, 4);
        traversedNode.fillStyleId = coverageColorIntent;
      }
    });
    detachedCoverageCard.visible = true;
    bladeCoverageCards.push(detachedCoverageCard);
  } catch (error: unknown) {
    figma.notify('⚠️ Error in rendering coverage card. Please try again');
    console.error(error);
    figma.closePlugin();
  }
};

const calculateCoverage = (node: SceneNode): CoverageMetrics | null => {
  let bladeComponents = 0;
  let bladeTextStyles = 0;
  let bladeColorStyles = 0;
  let nonBladeComponents = 0;
  let nonBladeTextStyles = 0;
  let nonBladeColorStyles = 0;
  let totalLayers = 0;

  try {
    // if there are non-frame nodes as direct children of a page, ignore them
    if (getParentNode(node)?.type === 'PAGE' && !MAIN_FRAME_NODES.includes(node.type)) {
      return null;
    }

    traverseNode(
      node,
      (traversedNode) => {
        if (!traversedNode.visible) {
          return;
        }
        if (
          traversedNode.type === 'INSTANCE' &&
          (BLADE_COMPONENT_IDS.includes(
            (traversedNode.mainComponent?.parent as ComponentSetNode)?.key ?? '',
          ) ||
            BLADE_COMPONENT_IDS.includes(traversedNode.mainComponent?.key ?? ''))
        ) {
          // few components that have slots we need to check if the children are valid Blade instances
          if (
            BLADE_COMPONENT_IDS_HAVING_SLOT.includes(
              (traversedNode.mainComponent?.parent as ComponentSetNode)?.key ?? '',
            )
          ) {
            // this will recursively follow the same process we follow.
            // check for Blade's instance and if there are certain components that has slot inside it then we recursively check inside them for blade components
            traversedNode.children.forEach((childNode) => {
              const slotComponentsCoverage = calculateCoverage(childNode);
              if (slotComponentsCoverage) {
                bladeComponents += slotComponentsCoverage?.bladeComponents;
                bladeTextStyles += slotComponentsCoverage?.bladeTextStyles;
                bladeColorStyles += slotComponentsCoverage?.bladeColorStyles;
                nonBladeComponents += slotComponentsCoverage?.nonBladeComponents;
                nonBladeTextStyles += slotComponentsCoverage?.nonBladeTextStyles;
                nonBladeColorStyles += slotComponentsCoverage?.nonBladeColorStyles;
                totalLayers += slotComponentsCoverage?.totalLayers;
              }
            });
          }
          if (traversedNode.overrides.length) {
            // flag the instance if its overridden
            let isOverridden = false;
            traversedNode.overrides.forEach((node) => {
              if (
                // these are properties which tells us if the components' text has been overridden. Fill this with more cases going forward as there are more possible values
                // https://www.figma.com/plugin-docs/api/NodeChangeProperty/
                node.overriddenFields.includes('letterSpacing') ||
                node.overriddenFields.includes('textStyleId') ||
                node.overriddenFields.includes('fontName') ||
                node.overriddenFields.includes('fontSize') ||
                node.overriddenFields.includes('lineHeight') ||
                node.overriddenFields.includes('textCase')
              ) {
                isOverridden = true;
              }
            });
            if (isOverridden) {
              nonBladeComponents++;
              highlightNonBladeNode(
                traversedNode,
                'Overridden Blade Instance. Please reset changes',
              );
            } else {
              bladeComponents++;
            }
          } else {
            bladeComponents++;
          }
        } else if (traversedNode.type === 'INSTANCE') {
          nonBladeComponents++;
          highlightNonBladeNode(traversedNode, 'Instance is not a Blade Instance');
        } else if (traversedNode.type === 'TEXT') {
          // check if the text is using Blade's text styles
          let isMixedTextStyleOfBlade = false;
          let traversedNodeTextStyleId = '';
          let isMixedColorStyleOfBlade = false;
          let traversedNodeColorStyleId = '';

          /**
           * The textSyleId can have figma.mixed. so in that case we need to go character by character
           * and do getRangeTextStyleId(charIndex,charIndex+1) instead of textStyleId
           */
          if (traversedNode?.textStyleId === figma.mixed) {
            isMixedTextStyleOfBlade = traversedNode.characters
              .split('')
              .every((character, index) => {
                if (/\s/.test(character)) {
                  return true;
                }
                return BLADE_TEXT_STYLE_IDS.includes(
                  (traversedNode.getRangeTextStyleId(index, index + 1) as string).split(',')[0],
                );
              });

            if (isMixedTextStyleOfBlade) {
              bladeTextStyles++;
            } else {
              nonBladeTextStyles++;
              highlightNonBladeNode(traversedNode, 'Text is not using Blade');
            }
          } else {
            traversedNodeTextStyleId = traversedNode?.textStyleId?.split(',')[0];

            if (BLADE_TEXT_STYLE_IDS.includes(traversedNodeTextStyleId ?? '')) {
              bladeTextStyles++;
            } else {
              nonBladeTextStyles++;
              highlightNonBladeNode(traversedNode, 'Text Style is not from Blade');
            }
          }

          /** the fillstyleId can have figma.mixed. so in that case we need to go character by character
           * and do getRangeFillStyleId(4,5) instead of fillStyleId
           * */
          if (traversedNode?.fillStyleId === figma.mixed) {
            isMixedColorStyleOfBlade = traversedNode.characters
              .split('')
              .every((character, index) => {
                if (/\s/.test(character)) {
                  return true;
                }
                return BLADE_COLOR_STYLE_IDS.includes(
                  (traversedNode.getRangeFillStyleId(index, index + 1) as string).split(',')[0],
                );
              });

            if (isMixedColorStyleOfBlade) {
              bladeColorStyles++;
            } else {
              nonBladeColorStyles++;
              highlightNonBladeNode(traversedNode, 'Color Style is not from Blade Tokens');
            }
          } else {
            traversedNodeColorStyleId = traversedNode?.fillStyleId?.split(',')[0];

            if (BLADE_COLOR_STYLE_IDS.includes(traversedNodeColorStyleId ?? '')) {
              bladeColorStyles++;
            } else {
              nonBladeColorStyles++;
              highlightNonBladeNode(traversedNode, 'Color Style is not from Blade Tokens');
            }
          }

          // this check is for typography components, if the typography uses color and text both from blade styles then they are typography blade components
          if (
            (isMixedTextStyleOfBlade || BLADE_TEXT_STYLE_IDS.includes(traversedNodeTextStyleId)) &&
            (isMixedColorStyleOfBlade || BLADE_COLOR_STYLE_IDS.includes(traversedNodeColorStyleId))
          ) {
            bladeComponents++;
          }
        } else if (traversedNode.type === 'LINE') {
          // check if the line is using Blade's color styles
          const traversedNodeColorStyleId = traversedNode.strokeStyleId.split(',')[0];
          const useDividerComponentError = 'Use a Divider Component Instead';
          if (BLADE_COLOR_STYLE_IDS.includes(traversedNodeColorStyleId ?? '')) {
            bladeColorStyles++;
            // even though the color matches blade, we want to encourage people to use Divider component instead
            highlightNonBladeNode(traversedNode, useDividerComponentError);
          } else {
            nonBladeColorStyles++;
            highlightNonBladeNode(traversedNode, useDividerComponentError);
          }
        } else if (traversedNode.type === 'RECTANGLE') {
          let isImage = false;

          if (traversedNode.fills !== figma.mixed) {
            // figma considers images as rectangles with fille type as IMAGE
            isImage = Boolean(traversedNode.fills.find((fill) => fill.type === 'IMAGE'));
          }

          if (isImage) {
            NODES_SKIP_FROM_COVERAGE.push('RECTANGLE');
          }

          if (!isImage && (traversedNode.strokeStyleId || traversedNode.fillStyleId)) {
            // check if rectangle uses blade surface.border.* colors for border
            if (traversedNode.strokeStyleId) {
              const traversedNodeColorStyleId = traversedNode.strokeStyleId.split(',')[0];
              if (BLADE_BOX_BORDER_COLOR_STYLE_IDS.includes(traversedNodeColorStyleId ?? '')) {
                bladeColorStyles++;
              } else {
                nonBladeColorStyles++;
                highlightNonBladeNode(
                  traversedNode,
                  'Border color style can only have Surface/Border/* colors',
                );
              }
            }
            // check if rectangle uses blade brand.* or surface.background.* colors for background
            if (traversedNode.fillStyleId && traversedNode.fillStyleId !== figma.mixed) {
              const traversedNodeFillStyleId = traversedNode.fillStyleId.split(',')[0];
              if (BLADE_BOX_BACKGROUND_COLOR_STYLE_IDS.includes(traversedNodeFillStyleId ?? '')) {
                bladeColorStyles++;
              } else {
                nonBladeColorStyles++;
                highlightNonBladeNode(
                  traversedNode,
                  'Background color style can only have Surface/Background/* or Brand/* colors',
                );
              }
            }
          }
        }

        if (
          ![...NODES_SKIP_FROM_COVERAGE, 'INSTANCE', 'TEXT', 'LINE', 'RECTANGLE'].includes(
            traversedNode.type,
          ) &&
          getParentNode(traversedNode)?.type !== 'PAGE'
        ) {
          highlightNonBladeNode(traversedNode, 'Not created using Blade Components/Tokens');
        }

        if (
          getParentNode(traversedNode)?.type !== 'PAGE' &&
          !NODES_SKIP_FROM_COVERAGE.includes(traversedNode.type)
        ) {
          // exclude the main frame itself from the count to remove false negatives
          totalLayers++;
        }

        // remove rectangle node index for next iteration because we don't want to remove all the rectangle nodes, only the image ones
        const rectangleImageNodeIndex = NODES_SKIP_FROM_COVERAGE.findIndex(
          (nodeName) => nodeName === 'RECTANGLE',
        );
        if (rectangleImageNodeIndex !== -1) {
          NODES_SKIP_FROM_COVERAGE.splice(rectangleImageNodeIndex, 1);
        }
      },
      (traversedNode) => {
        // callback to stopTraversal for children of a node
        // true: we shall stop
        // false: we shall keep traversing children
        if (!traversedNode.visible) {
          return true;
        }

        if (
          traversedNode.type === 'INSTANCE' &&
          (BLADE_COMPONENT_IDS.includes(
            (traversedNode.mainComponent?.parent as ComponentSetNode)?.key ?? '',
          ) ||
            BLADE_COMPONENT_IDS.includes(traversedNode.mainComponent?.key ?? ''))
        ) {
          // we shall stop traversal further if we have found that an instance is Blade instance
          // if we keep traversing then chances are the metrics will be skewed because Blade components are composed of non-blade themselves
          // in code analytics we can add "data-*" to all the children till leaf nodes but over here we can't hence we stop
          return true;
        }
        return false;
      },
    );
  } catch (error: unknown) {
    console.error(error);
    figma.notify('⚠️ Error in rendering coverage card. Please try again');
    figma.closePlugin();
  }

  return {
    bladeComponents,
    bladeTextStyles,
    bladeColorStyles,
    nonBladeComponents,
    nonBladeTextStyles,
    nonBladeColorStyles,
    totalLayers,
    bladeCoverage:
      bladeComponents === 0 && totalLayers === 0
        ? 0
        : Number((bladeComponents / totalLayers) * 100),
  };
};

const getPageMainFrameNodes = (nodes: readonly SceneNode[]): SceneNode[] => {
  const mainFrameNodes: SceneNode[] = [];
  try {
    for (const node of nodes) {
      if (getParentNode(node)?.type === 'PAGE') {
        // if selection is top level frame then start the coverage count
        // await calculateCoverage(node);
        mainFrameNodes.push(node);
      } else {
        // if the selection is not the top level frame then traverse up till we find the frame and then start the coverage count
        // await calculateCoverage(mainFrameNode);
        mainFrameNodes.push(traverseUpTillMainFrame(node) as SceneNode);
      }
    }
  } catch (error: unknown) {
    console.error(error);
    figma.notify('⚠️ Error in identifying main frame node. Please try again');
    figma.closePlugin();
  }

  return mainFrameNodes;
};

const removeOldGroupNodes = (): void => {
  // remove all teh old group nodes
  const bladeCoverageCardsGroup = figma.currentPage.findOne(
    (node) => node.name === 'Blade Coverage Cards',
  );
  const nonBladeItemsGroup = figma.currentPage.findOne((node) => node.name === 'Non Blade Items');

  if (bladeCoverageCardsGroup) {
    bladeCoverageCardsGroup.remove();
  }
  if (nonBladeItemsGroup) {
    nonBladeItemsGroup.remove();
  }
};

const main = async (): Promise<void> => {
  try {
    figma.skipInvisibleInstanceChildren = true;
    figma.notify('Calculating Coverage', { timeout: Infinity });

    removeOldGroupNodes();

    let nodes: readonly SceneNode[] = [];
    if (figma.currentPage.selection.length > 0) {
      // you already have the selection, run the plugin
      nodes = figma.currentPage.selection;
    } else if (figma.currentPage.type === 'PAGE') {
      // plugin is run from page scope but has no selection, so traverse all the nodes and then measure coverage
      nodes = getSelectedNodesOrAllNodes();
    } else {
      // the plugin is not run from a page scope, throw error
      figma.notify(
        '⚠️ Please run the plugin by opening a Page or selecting a layer inside a Page',
        {
          error: true,
        },
      );
      figma.closePlugin();
    }

    if (nodes.length) {
      // 1. get the main frame nodes of the current page(ignoring non-frame nodes)
      const mainFrameNodes = getPageMainFrameNodes(nodes);
      for await (const mainFrameNode of mainFrameNodes) {
        // 2. calculate the coverage
        const coverageMetrics = calculateCoverage(mainFrameNode);
        if (coverageMetrics) {
          // 3. render the coverage card. fin.
          await renderCoverageCard({ mainFrameNode, ...coverageMetrics });
          // 4. send data to analytics service
          await sendAnalytics({
            eventName: 'Blade Coverage Plugin Used',
            properties: {
              fileName: figma.root.name,
              pageName: mainFrameNode.parent?.name,
              nodeName: mainFrameNode.name,
              nodePath: `${figma.root.name}/${mainFrameNode.parent?.name}/${mainFrameNode.name}`,
              nodeUrlPath: `https://www.figma.com/file/${figma.fileKey}/${
                figma.root.name
              }?node-id=${encodeURIComponent(mainFrameNode.id)}`,
              nodetype: mainFrameNode.type,
              isMarkedReadyForDev:
                mainFrameNode.type === 'SECTION'
                  ? mainFrameNode.devStatus?.type === 'READY_FOR_DEV'
                  : 'not-a-section-node',
              nodeWidth: mainFrameNode.width,
              nodeHeight: mainFrameNode.height,
              ...coverageMetrics,
            },
          });
        }
      }

      if (nonBladeHighlighterNodes.length) {
        const nonBladeHighterNodesGroup = figma.group(nonBladeHighlighterNodes, figma.currentPage);
        nonBladeHighterNodesGroup.name = 'Non Blade Items';
        nonBladeHighterNodesGroup.expanded = false;
      }

      if (bladeCoverageCards.length) {
        const bladeCoverageCardsGroup = figma.group(bladeCoverageCards, figma.currentPage);
        bladeCoverageCardsGroup.name = 'Blade Coverage Cards';
        bladeCoverageCardsGroup.expanded = false;
      }
    }
  } catch (error: unknown) {
    console.error(error);
    figma.notify('⚠️ Something went wrong. Please try re-running the plugin');
  } finally {
    figma.closePlugin();
  }
};

export default main;
