/**
 * TODO
 * [x] count if the components are blade/local components
 * [x] tiny ui to display the information
 * [x] Bug with the component ids changing from file to file
 * [x] consider the top level nodes as root only if they are frame nodes else ignore
 * [x] change the colors of coverage based on the %
 * [x] count text nodes to be blade if they use styles from blade because they don't use typo component
 * [x] fix the use case of figma.mixed
 * [x] exclude section as well and count that in top level main frame
 * [x] cleanup
 * [x] skip hidden layers from being traversed
 * [] number of times plugin is run metric
 * --release v1--
 * [] highlight the non blade nodes
 * [] show plugin ui config
 *    - what position to show the coverage report
 *    - highlight the non blade textstyles?
 *    - highlight the non blade components?
 *    - highlight non blade styles?
 * [] send analytics randomly once or twice a day
 */
import {
  getParentNode,
  traverseNode,
  getSelectedNodesOrAllNodes,
  incrementTotalUseCountAsync,
} from '@create-figma-plugin/utilities';
// import { AnalyticsBrowser } from '@segment/analytics-next';
import {
  BLADE_COLOR_STYLE_IDS,
  BLADE_COMPONENT_IDS,
  BLADE_TEXT_STYLE_IDS,
} from './bladeLibraryConstants';

type CoverageMetrics = {
  bladeComponents: number;
  bladeTextStyles: number;
  bladeColorStyles: number;
  nonBladeTextStyles: number;
  nonBladeColorStyles: number;
  nonBladeComponents: number; // rename to non-blade components
  totalLayers: number; // rename to total layers
};

const MAIN_FRAME_NODES = ['FRAME', 'SECTION'];
const NODES_SKIP_FROM_COVERAGE = ['GROUP', 'SECTION'];
const nonBladeHighlighterNodes: BaseNode[] = [];

const highlightNonBladeNode = (node: SceneNode): void => {
  const highlighterBox = figma.createRectangle();
  const nodeType =
    node.type.toUpperCase().charAt(0).toUpperCase() + node.type.toLowerCase().slice(1);
  highlighterBox.name = `Type: ${nodeType}, Name: ${node.name}`;
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
    console.error({ error });
    figma.notify('⚠️ Error in traversing main frame node. Please try again', { error: true });
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
    coverageCardInstance.x = mainFrameNode.x + 150; // 150 because we want to prevent conflict with the frame name
    coverageCardInstance.y = mainFrameNode.y - coverageCardComponent.height;

    // import styles for popsitive, negative and notice colors and set their id in BLADE_INTENT_COLOR_KEYS
    for await (const [intent, intentObject] of Object.entries(BLADE_INTENT_COLOR_KEYS)) {
      const colorStyle = await figma.importStyleByKeyAsync(intentObject.key);
      BLADE_INTENT_COLOR_KEYS[intent as 'positive' | 'negative' | 'notice'].id = colorStyle.id;
    }

    const bladeCoverage = Number((bladeComponents / totalLayers) * 100);
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

    const detachedCard = coverageCardInstance.detachInstance();
    traverseNode(detachedCard, (traversedNode) => {
      if (traversedNode.type === 'TEXT') {
        if (['bladeCoverageType', 'bladeCoverage'].includes(traversedNode.name)) {
          traversedNode.setRangeFillStyleId(
            0,
            traversedNode.characters.length,
            coverageColorIntent,
          );
        }
      } else if (traversedNode.type === 'RECTANGLE' && traversedNode.name === 'Progress') {
        traversedNode.resizeWithoutConstraints(bladeCoverageProgress, 4);
        traversedNode.fillStyleId = coverageColorIntent;
      }
    });
  } catch (error: unknown) {
    console.error({ error });
    figma.notify('⚠️ Error in rendering coverage card. Please try again', { error: true });
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
    if (getParentNode(node)?.type === 'PAGE' && !MAIN_FRAME_NODES.includes(node.type)) {
      // if there are non-frame nodes as direct children of a page, ignore them
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
          bladeComponents++;
        } else if (traversedNode.type === 'INSTANCE') {
          nonBladeComponents++;
          highlightNonBladeNode(traversedNode);
        } else if (traversedNode.type === 'TEXT') {
          // check if the text is using Blade's text styles
          let isMixedTextStyleOfBlade = false;
          let traversedNodeTextStyleId = '';
          let isMixedColorStyleOfBlade = false;
          let traversedNodeColorStyleId = '';

          /** the textSyleId can have figma.mixed. so in that case we need to go character by character
           * and do getRangeTextStyleId(charIndex,charIndex+1) instead of textStyleId
           * */
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
              highlightNonBladeNode(traversedNode);
            }
          } else {
            traversedNodeTextStyleId = traversedNode?.textStyleId?.split(',')[0];

            if (BLADE_TEXT_STYLE_IDS.includes(traversedNodeTextStyleId ?? '')) {
              bladeTextStyles++;
            } else {
              nonBladeTextStyles++;
              highlightNonBladeNode(traversedNode);
            }
          }

          /** the fillstyleId can have figma.mixed. so in that case we need to go character by character
           * and do getRangeFillStyleId(4,5) instead of fillStyleId
           * */
          if (traversedNode?.fillStyleId === figma.mixed) {
            // console.log
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
              highlightNonBladeNode(traversedNode);
            }
          } else {
            traversedNodeColorStyleId = traversedNode?.fillStyleId?.split(',')[0];

            if (BLADE_COLOR_STYLE_IDS.includes(traversedNodeColorStyleId ?? '')) {
              bladeColorStyles++;
            } else {
              nonBladeColorStyles++;
              highlightNonBladeNode(traversedNode);
            }
          }

          // this check is for typography components, if the typography uses color and text both from blade styles then they are typography blade components
          if (
            BLADE_TEXT_STYLE_IDS.includes(traversedNodeTextStyleId) &&
            BLADE_COLOR_STYLE_IDS.includes(traversedNodeColorStyleId)
          ) {
            bladeComponents++;
          } else if (isMixedColorStyleOfBlade && isMixedTextStyleOfBlade) {
            bladeComponents++;
          }
        } else if (traversedNode.type === 'LINE') {
          // check if the line is using Blade's color styles
          const traversedNodeColorStyleId = traversedNode.strokeStyleId.split(',')[0];

          if (BLADE_COLOR_STYLE_IDS.includes(traversedNodeColorStyleId ?? '')) {
            bladeColorStyles++;
          } else {
            nonBladeColorStyles++;
            highlightNonBladeNode(traversedNode);
          }
        }
        if (
          ![...NODES_SKIP_FROM_COVERAGE, 'INSTANCE', 'TEXT', 'LINE'].includes(traversedNode.type) &&
          getParentNode(traversedNode)?.type !== 'PAGE'
        ) {
          highlightNonBladeNode(traversedNode);
        }
        if (
          getParentNode(traversedNode)?.type !== 'PAGE' &&
          !NODES_SKIP_FROM_COVERAGE.includes(traversedNode.type)
        ) {
          // exclude the main frame itself from the count to remove false negatives
          totalLayers++;
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
    console.error({ error });
    figma.notify('⚠️ Error in rendering coverage card. Please try again', { error: true });
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
  };
};

const getPageMainFrameNodes = (nodes: SceneNode[]): SceneNode[] => {
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
    console.error({ error });
    figma.notify('⚠️ Error in identifying main frame node. Please try again', { error: true });
    figma.closePlugin();
  }

  return mainFrameNodes;
};

const main = async (): Promise<void> => {
  // plugin used
  // const pluginUsageCount = await incrementTotalUseCountAsync();
  // const analytics = AnalyticsBrowser.load({ writeKey: '6lpfX5loXnTbBFVo2FbJHpjins0hGaC4' });
  // await analytics.track('Blade Coverage Plugin Used', {
  //   pluginUsageCount,
  //   fileName: figma.currentPage.parent?.name,
  //   pageName: figma.currentPage.name,
  // });
  figma.skipInvisibleInstanceChildren = true;
  figma.notify('Calculating Coverage', { timeout: Infinity });

  let nodes: SceneNode[] = [];
  if (figma.currentPage.selection.length > 0) {
    // you already have the selection, run the plugin
    //@ts-expect-error type 'readonly SceneNode[]' is 'readonly' and cannot be assigned to the mutable type 'SceneNode[]'
    nodes = figma.currentPage.selection;
  } else if (figma.currentPage.type === 'PAGE') {
    // plugin is run from page scope but has no selection, so traverse all the nodes and then measure coverage
    nodes = getSelectedNodesOrAllNodes();
  } else {
    // the plugin is not run from a page scope, throw error
    figma.notify('⚠️ Please run the plugin by opening a Page or selecting a layer inside a Page', {
      error: true,
    });
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
      }
    }
    const groupNode = figma.group(nonBladeHighlighterNodes, figma.currentPage);
    groupNode.name = 'Non Blade Items';
  }
  figma.closePlugin();
};

export default main;

/**
 * {
  "messageId": "segment-test-message-bzca8",
  "timestamp": "2023-07-04T07:52:15.869Z",
  "type": "track",
  "email": "test@example.org",
  "projectId": "exj6QozECuYXSgsrGfGYjH",
  "properties": {
    "count": 1
  },
  "userId": "test-user-9689q",
  "event": "Blade Coverage Plugin Used"
}
 */
