// List for Coverage Plugin:
// [x] Add Card check for border radius
// [x] Add tokens to coverage % - done
// [x] Add card check for frames for custom components - done
// [x] Add check for override of tokens - done
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import {
  getParentNode,
  traverseNode,
  getSelectedNodesOrAllNodes,
} from '@create-figma-plugin/utilities';

import {
  BLADE_BOX_BACKGROUND_COLOR_VARIABLE_IDS,
  BLADE_BOX_BORDER_COLOR_VARIABLE_IDS,
  BLADE_COMPONENT_IDS,
  BLADE_COMPONENT_IDS_HAVING_SLOT,
  BLADE_TEXT_COLOR_STYLE_IDS,
  BLADE_TEXT_TYPEFACE_STYLE_IDS,
  BLADE_EFFECT_STYLE_IDS,
  bladeThemeData,
} from './bladeLibraryConstants';
import { sendAnalytics } from './utils/sendAnalytics';

type CoverageMetrics = {
  bladeComponents: number;
  bladeTextStyles: number;
  bladeColorStyles: number;
  // bladeEffectStyles: number;
  nonBladeComponents: number;
  nonBladeTextStyles: number;
  nonBladeColorStyles: number;
  // nonBladeEffectStyles: number;
  totalLayers: number;
  bladeCoverage: number;
};

const MAIN_FRAME_NODES = ['FRAME', 'SECTION'];
const NODES_SKIP_FROM_COVERAGE = [
  'GROUP',
  'SECTION',
  'VECTOR',
  'ELLIPSE',
  'INSTANCE',
  'COMPONENT',
  'COMPONENT_SET',
];
const nonBladeHighlighterNodes: BaseNode[] = [];
const bladeCoverageCards: BaseNode[] = [];

const highlightNonBladeNode = (node: SceneNode, desc?: string): void => {
  const highlighterBox = figma.createRectangle();
  const nodeType = `${node.type
    .toUpperCase()
    .charAt(0)
    .toUpperCase()}${node.type.toLowerCase().slice(1)}`;
  highlighterBox.name = `${desc}, Type: ${nodeType}, Name: ${node.name}`;
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
      keyStyle: 'c61aca5db3a21aead10da4889ad2b31c74d93529',
      keyVariable: '6489b823f0ea6a46820027c92b5650d0d7950350',
    },
    negative: {
      id: '',
      keyStyle: 'cccac5aac53e828b3be3e8617e462f8ee1a058dd',
      keyVariable: '11c2fb911f47d4f8dc6ff648c2e9c6ee2ee3f2b9',
    },
    notice: {
      id: '',
      keyStyle: '707d5fdfc748a5fc4777d212ee247bc40a86fe85',
      keyVariable: '6fe5b15560ece4139ebacb2ae64f93892761d858',
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

    // import styles for positive, negative and notice colors and set their id in BLADE_INTENT_COLOR_KEYS
    for await (const [intent, intentObject] of Object.entries(BLADE_INTENT_COLOR_KEYS)) {
      // const colorStyle = await figma.importStyleByKeyAsync(intentObject.keyStyle);
      const colorVariable = await figma.variables.importVariableByKeyAsync(
        intentObject.keyVariable,
      );
      // BLADE_INTENT_COLOR_KEYS[intent as 'positive' | 'negative' | 'notice'].id = colorStyle.id;
      BLADE_INTENT_COLOR_KEYS[intent as 'positive' | 'negative' | 'notice'].id = colorVariable.id;
    }

    let coverageColorIntent = BLADE_INTENT_COLOR_KEYS.negative.id;
    let bladeCoverageType = 'Below 90% 😪';
    const PROGRESS_BAR_MAX_WIDTH = 254;
    const bladeCoverageProgress = (bladeCoverage / 100) * PROGRESS_BAR_MAX_WIDTH;

    // calculate coverage type and intent colors for coverage
    if (bladeCoverage > 90) {
      bladeCoverageType = `Good 🎉`;
      coverageColorIntent = BLADE_INTENT_COLOR_KEYS.positive.id;
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

    // Function to create a paint object bound to a variable
    const createVariableBoundPaint = (variableId: string): SolidPaint => ({
      type: 'SOLID',
      // Optional: provide a fallback color if the variable isn't resolvable,
      // though Figma typically handles this.
      color: { r: 0, g: 0, b: 0 }, // Example fallback
      boundVariables: {
        color: {
          type: 'VARIABLE_ALIAS',
          id: variableId,
        },
      },
    });

    traverseNode(detachedCoverageCard, (traversedNode) => {
      if (traversedNode.type === 'TEXT') {
        if (['bladeCoverageType', 'bladeCoverage'].includes(traversedNode.name)) {
          const newFill = createVariableBoundPaint(coverageColorIntent);
          traversedNode.fills = [newFill];
        }
      } else if (traversedNode.type === 'RECTANGLE' && traversedNode.name === 'Progress') {
        traversedNode.resizeWithoutConstraints(bladeCoverageProgress || 0.1, 4);
        const newFill = createVariableBoundPaint(coverageColorIntent);
        traversedNode.fills = [newFill];
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
  // let bladeEffectStyles = 0;
  let nonBladeComponents = 0;
  let nonBladeTextStyles = 0;
  let nonBladeColorStyles = 0;
  // let nonBladeEffectStyles = 0;
  let totalLayers = 0;
  let bladeCoverage = 0;

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
        // this condition is required to run coverage on component sets which are components built locally using Blade components
        const isLocalComponent =
          traversedNode.type === 'COMPONENT' || traversedNode.type === 'COMPONENT_SET';

        if (
          (traversedNode.type === 'INSTANCE' &&
            (BLADE_COMPONENT_IDS.includes(
              (traversedNode.mainComponent?.parent as ComponentSetNode)?.key ?? '',
            ) ||
              BLADE_COMPONENT_IDS.includes(traversedNode.mainComponent?.key ?? ''))) ||
          isLocalComponent
        ) {
          // few components that have slots we need to check if the children are valid Blade instances
          if (
            !isLocalComponent &&
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
          if (!isLocalComponent && traversedNode.overrides.length) {
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
              if (node.overriddenFields.includes('cornerRadius')) {
                isOverridden = true;
                const isCardBorderRadiusValid = [
                  traversedNode.boundVariables?.topLeftRadius?.id,
                  traversedNode.boundVariables?.topRightRadius?.id,
                  traversedNode.boundVariables?.bottomLeftRadius?.id,
                  traversedNode.boundVariables?.bottomRightRadius?.id,
                ].every((variableId) =>
                  Object.values(bladeThemeData.variables.CardBorderRadius).includes(
                    variableId ?? '',
                  ),
                );
                if (
                  // (traversedNode.mainComponent?.parent as ComponentSetNode)?.key
                  (traversedNode.mainComponent?.parent as ComponentSetNode)?.key.includes(
                    bladeThemeData.components.Card.key,
                  ) &&
                  isCardBorderRadiusValid
                ) {
                  isOverridden = false;
                }
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
          } else if (!isLocalComponent) {
            bladeComponents++;
          }

          // we want to ignore the count of all the COMPONENT and COMPONENT_SET node types from the total layer count
          if (!isLocalComponent) {
            totalLayers++;
          }
        }
        // else if (traversedNode.type === 'INSTANCE') {
        //   nonBladeComponents++;
        //   highlightNonBladeNode(traversedNode, 'Instance is not a Blade Instance');
        // }
        else if (traversedNode.type === 'TEXT') {
          // check if the text is using Blade's text styles
          let isMixedTextStyleOfBlade = false;
          let traversedNodeTextStyleId = '';
          let isTextRangeFillsOfBlade = false;
          let traversedNodeColorVariableId = '';

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
                return BLADE_TEXT_TYPEFACE_STYLE_IDS.includes(
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
            if (BLADE_TEXT_TYPEFACE_STYLE_IDS.includes(traversedNodeTextStyleId ?? '')) {
              bladeTextStyles++;
            } else {
              nonBladeTextStyles++;
              highlightNonBladeNode(traversedNode, 'Text Style is not from Blade');
            }
          }

          // check if text is using blade color styles
          if (traversedNode.boundVariables?.fills?.length) {
            traversedNodeColorVariableId = traversedNode.boundVariables.fills[0].id.split('/')[0];
            if (BLADE_TEXT_COLOR_STYLE_IDS.includes(traversedNodeColorVariableId ?? '')) {
              bladeColorStyles++;
            } else {
              nonBladeColorStyles++;
              highlightNonBladeNode(
                traversedNode,
                'Text Color Style should only use surface/text or feedback/text tokens',
              );
            }
          } else {
            nonBladeColorStyles++;
            highlightNonBladeNode(traversedNode, 'Text Color Style is not using Blade Tokens');
          }

          // check if text is using blade text styles
          // textRangeFills is used when the text has different colors for different characters
          if (traversedNode.boundVariables?.textRangeFills?.length) {
            isTextRangeFillsOfBlade = traversedNode.boundVariables.textRangeFills.every((fill) => {
              if (BLADE_TEXT_COLOR_STYLE_IDS.includes(fill.id.split('/')[0])) {
                return true;
              }
              return false;
            });
            if (isTextRangeFillsOfBlade) {
              bladeTextStyles++;
            } else {
              nonBladeTextStyles++;
              highlightNonBladeNode(
                traversedNode,
                'Text Color Style should only use surface/text or feedback/text tokens',
              );
            }
          }

          if (
            traversedNode.boundVariables &&
            Object.keys(traversedNode.boundVariables).length === 0
          ) {
            nonBladeTextStyles++;
            highlightNonBladeNode(
              traversedNode,
              'Text Color Style should only use surface/text or feedback/text tokens',
            );
          }

          // this check is for typography components, if the typography uses color and text both from blade styles then they are typography blade components
          if (
            (isMixedTextStyleOfBlade ||
              BLADE_TEXT_TYPEFACE_STYLE_IDS.includes(traversedNodeTextStyleId)) &&
            (isTextRangeFillsOfBlade ||
              BLADE_TEXT_COLOR_STYLE_IDS.includes(traversedNodeColorVariableId))
          ) {
            bladeComponents++;
          }
        } else if (traversedNode.type === 'LINE') {
          nonBladeComponents++;
          highlightNonBladeNode(traversedNode, 'Use a Divider Component Instead');
        } else if (traversedNode.type === 'RECTANGLE') {
          let isImage = false;

          if (traversedNode.fills !== figma.mixed) {
            // figma considers images as rectangles with fill type as IMAGE
            isImage = Boolean(traversedNode.fills.find((fill) => fill.type === 'IMAGE'));
          }

          if (isImage) {
            NODES_SKIP_FROM_COVERAGE.push('RECTANGLE');
          }

          const hasEffects = traversedNode.effects?.length;
          const hasBladeEffectStyles = BLADE_EFFECT_STYLE_IDS.includes(traversedNode.effectStyleId);

          if (hasEffects && hasBladeEffectStyles) {
            // bladeEffectStyles++;
          } else if (hasEffects && !hasBladeEffectStyles) {
            // nonBladeEffectStyles++;
            highlightNonBladeNode(traversedNode, `Effects not from Blade's elevation styles`);
          }

          // replace with variables
          const hasFillsVariable = traversedNode.boundVariables?.fills?.length;
          const hasStrokesVariable = traversedNode.boundVariables?.strokes?.length;
          if (!isImage && (hasFillsVariable || hasStrokesVariable)) {
            // check if rectangle uses blade surface.border.* colors for border
            if (hasStrokesVariable) {
              const traversedNodeColorVariableId = traversedNode.boundVariables.strokes[0].id.split(
                '/',
              )[0];
              if (
                BLADE_BOX_BORDER_COLOR_VARIABLE_IDS.includes(traversedNodeColorVariableId ?? '')
              ) {
                bladeColorStyles++;
              } else {
                nonBladeColorStyles++;
                highlightNonBladeNode(
                  traversedNode,
                  'Box Border color should only use surface/border/* tokens',
                );
              }
            }
            // check if rectangle is using blade surface.background.* tokens for background
            if (hasFillsVariable) {
              const traversedNodeFillStyleId = traversedNode.boundVariables.fills[0].id.split(
                '/',
              )[0];
              if (
                BLADE_BOX_BACKGROUND_COLOR_VARIABLE_IDS.includes(traversedNodeFillStyleId ?? '')
              ) {
                bladeColorStyles++;
              } else {
                nonBladeColorStyles++;
                highlightNonBladeNode(
                  traversedNode,
                  'Box Background color should only use surface/background/* tokens',
                );
              }
            }
          } else if (!isImage) {
            highlightNonBladeNode(traversedNode, 'Box not adhering to Blade guidelines');
          }
        }

        const ignoreInstanceFrameNodeNames = [
          'root',
          'wrapper',
          'bottom-sheet-container',
          'accordion-header container',
          'overlay', // Drawer Overlay
          'Marker', // Step Marker
          'Summary Row',
          'card-body',
          'card-content-holder',
        ];

        /** check if a frame/custom instance created using frame is being used as a custom component
         * has fills?
         * has strokes?
         * has effects?
         * if any of the above is true then it's a custom component
         * */
        if (
          (traversedNode.type === 'FRAME' ||
            (traversedNode.type === 'INSTANCE' &&
              !(
                BLADE_COMPONENT_IDS.includes(
                  (traversedNode.mainComponent?.parent as ComponentSetNode)?.key ?? '',
                ) || BLADE_COMPONENT_IDS.includes(traversedNode.mainComponent?.key ?? '')
              ))) &&
          !ignoreInstanceFrameNodeNames.includes(traversedNode.name) &&
          getParentNode(traversedNode)?.type !== 'PAGE' &&
          getParentNode(traversedNode)?.type !== 'SECTION'
        ) {
          const hasStrokes =
            traversedNode?.boundVariables?.strokes?.length ??
            traversedNode.strokes.filter((stroke) => stroke.visible !== false).length; // remove the hidden strokes from traversing
          const hasEffects = traversedNode.effects?.length || traversedNode.effectStyleId;
          const hasNonMixedFills =
            traversedNode.fills !== figma.mixed &&
            traversedNode.fills.filter((fill) => fill.visible !== false).length; // remove the hidden fills from traversing
          const hasFills =
            traversedNode?.boundVariables?.fills?.length ??
            hasNonMixedFills ??
            traversedNode.fillStyleId;
          if (
            Boolean(hasStrokes || hasEffects || hasFills) &&
            !Boolean(traversedNode.fills === figma.mixed)
          ) {
            // this is non-blade component error
            // push the frame layer to be included in component count
            nonBladeComponents++;
            highlightNonBladeNode(
              traversedNode,
              `You might want to use Card with Slot. You're using a Frame with fill/strokes/effects.`,
            );
          } else {
            NODES_SKIP_FROM_COVERAGE.push('FRAME');
          }
        }

        if (
          ![...NODES_SKIP_FROM_COVERAGE, 'TEXT', 'LINE', 'RECTANGLE', 'FRAME'].includes(
            traversedNode.type,
          ) &&
          getParentNode(traversedNode)?.type !== 'PAGE'
        ) {
          highlightNonBladeNode(traversedNode, 'Not created using Blade Components/Tokens');
        }

        if (
          getParentNode(traversedNode)?.type !== 'PAGE' &&
          getParentNode(traversedNode)?.type !== 'SECTION' &&
          !NODES_SKIP_FROM_COVERAGE.includes(traversedNode.type) &&
          // if the frame instances are from Blade's components then we don't want to include them in the count because these are components with slots
          !ignoreInstanceFrameNodeNames.includes(traversedNode.name)
        ) {
          // exclude the main frame itself from the count to remove false negatives
          totalLayers++;
        }

        // remove rectangle node index for next iteration because we don't want to remove all the rectangle nodes, only the image ones
        // remove frame node index for next iteration because we don't want to remove layout frame nodes, only the one that has being used as card
        const nodesToBeRemoved = ['RECTANGLE', 'FRAME'];
        // const nodesToBeRemoved = ['RECTANGLE'];
        nodesToBeRemoved.forEach((nodeName) => {
          const nodeIndex = NODES_SKIP_FROM_COVERAGE.findIndex((node) => node === nodeName);
          if (nodeIndex !== -1) {
            NODES_SKIP_FROM_COVERAGE.splice(nodeIndex, 1);
          }
        });
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

  if (bladeComponents === 0 && totalLayers === 0) {
    bladeCoverage = 0;
  } else if (bladeComponents <= 0) {
    bladeCoverage = 0;
  } else if (nonBladeComponents === 0 && nonBladeTextStyles === 0 && nonBladeColorStyles === 0) {
    // we need to do this because when everything is from blade there could still be outer frames and things like that are non-blade and not flagged as well
    bladeCoverage = 100;
  } else {
    bladeCoverage = Number(
      (bladeComponents / (totalLayers + nonBladeTextStyles + nonBladeColorStyles)) * 100,
    );
  }

  return {
    bladeComponents,
    bladeTextStyles,
    bladeColorStyles,
    nonBladeComponents,
    nonBladeTextStyles,
    nonBladeColorStyles,
    totalLayers,
    bladeCoverage,
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
              pageName: figma.currentPage.name,
              pagePath: `${figma.root.name}/${figma.currentPage.name}`,
              nodeName: mainFrameNode.name,
              nodePath: `${figma.root.name}/${figma.currentPage.name}/${mainFrameNode.name}`,
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
