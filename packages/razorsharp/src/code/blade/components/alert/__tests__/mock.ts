import type { BladeComponentInstanceNode } from '~/code/types/Blade';

export const dismissibleWarningAlert: BladeComponentInstanceNode = {
  id: '210:183365',
  layerName: 'Alert',
  type: 'INSTANCE',
  parent: null,
  componentProperties: {
    Intent: {
      value: 'Notice',
      type: 'VARIANT',
    },
    isDismissible: {
      value: 'True',
      type: 'VARIANT',
    },
    primaryAction: {
      value: 'False',
      type: 'VARIANT',
    },
    secondaryAction: {
      value: 'False',
      type: 'VARIANT',
    },
    isFullWidth: {
      value: 'False',
      type: 'VARIANT',
    },
    screenSize: {
      value: 'Desktop',
      type: 'VARIANT',
    },
    contrast: {
      value: 'Low',
      type: 'VARIANT',
    },
  },
  children: [
    {
      id: 'I210:183365;11098:286125',
      layerName: '_Alert-Structure',
      type: 'INSTANCE',
      parent: {
        id: '210:183365',
        layerName: 'Alert',
        type: 'INSTANCE',
        parent: null,
      },
      componentProperties: {
        screenSize: {
          value: 'Large',
          type: 'VARIANT',
        },
        isFlat: {
          value: 'False',
          type: 'VARIANT',
        },
      },
      children: [
        {
          id: 'I210:183365;11098:286125;6914:504',
          layerName: 'alert-icon',
          type: 'FRAME',
          parent: {
            id: 'I210:183365;11098:286125',
            layerName: '_Alert-Structure',
            type: 'INSTANCE',
            parent: {
              id: '210:183365',
              layerName: 'Alert',
              type: 'INSTANCE',
              parent: null,
            },
          },
          children: [
            {
              id: 'I210:183365;11098:286125;6914:505',
              layerName: 'Size',
              type: 'INSTANCE',
              parent: {
                id: 'I210:183365;11098:286125;6914:504',
                layerName: 'alert-icon',
                type: 'FRAME',
                parent: {
                  id: 'I210:183365;11098:286125',
                  layerName: '_Alert-Structure',
                  type: 'INSTANCE',
                  parent: {
                    id: '210:183365',
                    layerName: 'Alert',
                    type: 'INSTANCE',
                    parent: null,
                  },
                },
              },
              componentProperties: {
                size: {
                  value: 'md (16px)',
                  type: 'VARIANT',
                },
              },
              children: [
                {
                  id: 'I210:183365;11098:286125;6914:505;98:46',
                  layerName: 'Shape',
                  type: 'GROUP',
                  parent: {
                    id: 'I210:183365;11098:286125;6914:505',
                    layerName: 'Size',
                    type: 'INSTANCE',
                    parent: {
                      id: 'I210:183365;11098:286125;6914:504',
                      layerName: 'alert-icon',
                      type: 'FRAME',
                      parent: {
                        id: 'I210:183365;11098:286125',
                        layerName: '_Alert-Structure',
                        type: 'INSTANCE',
                        parent: {
                          id: '210:183365',
                          layerName: 'Alert',
                          type: 'INSTANCE',
                          parent: null,
                        },
                      },
                    },
                  },
                  children: [
                    {
                      id: 'I210:183365;11098:286125;6914:505;98:47',
                      layerName: 'Action / alert-triangle',
                      type: 'INSTANCE',
                      parent: {
                        id: 'I210:183365;11098:286125;6914:505;98:46',
                        layerName: 'Shape',
                        type: 'GROUP',
                        parent: {
                          id: 'I210:183365;11098:286125;6914:505',
                          layerName: 'Size',
                          type: 'INSTANCE',
                          parent: {
                            id: 'I210:183365;11098:286125;6914:504',
                            layerName: 'alert-icon',
                            type: 'FRAME',
                            parent: {
                              id: 'I210:183365;11098:286125',
                              layerName: '_Alert-Structure',
                              type: 'INSTANCE',
                              parent: {
                                id: '210:183365',
                                layerName: 'Alert',
                                type: 'INSTANCE',
                                parent: null,
                              },
                            },
                          },
                        },
                      },
                      componentProperties: {},
                      children: [
                        {
                          id: 'I210:183365;11098:286125;6914:505;98:47;59:730',
                          layerName: 'alert-triangle',
                          type: 'INSTANCE',
                          parent: {
                            id: 'I210:183365;11098:286125;6914:505;98:47',
                            layerName: 'Action / alert-triangle',
                            type: 'INSTANCE',
                            parent: {
                              id: 'I210:183365;11098:286125;6914:505;98:46',
                              layerName: 'Shape',
                              type: 'GROUP',
                              parent: {
                                id: 'I210:183365;11098:286125;6914:505',
                                layerName: 'Size',
                                type: 'INSTANCE',
                                parent: {
                                  id: 'I210:183365;11098:286125;6914:504',
                                  layerName: 'alert-icon',
                                  type: 'FRAME',
                                  parent: {
                                    id: 'I210:183365;11098:286125',
                                    layerName: '_Alert-Structure',
                                    type: 'INSTANCE',
                                    parent: {
                                      id: '210:183365',
                                      layerName: 'Alert',
                                      type: 'INSTANCE',
                                      parent: null,
                                    },
                                  },
                                },
                              },
                            },
                          },
                          componentProperties: {},
                          children: [
                            {
                              id: 'I210:183365;11098:286125;6914:505;98:47;59:730;58:41',
                              layerName: 'Union',
                              type: 'VECTOR',
                              parent: {
                                id: 'I210:183365;11098:286125;6914:505;98:47;59:730',
                                layerName: 'alert-triangle',
                                type: 'INSTANCE',
                                parent: {
                                  id: 'I210:183365;11098:286125;6914:505;98:47',
                                  layerName: 'Action / alert-triangle',
                                  type: 'INSTANCE',
                                  parent: {
                                    id: 'I210:183365;11098:286125;6914:505;98:46',
                                    layerName: 'Shape',
                                    type: 'GROUP',
                                    parent: {
                                      id: 'I210:183365;11098:286125;6914:505',
                                      layerName: 'Size',
                                      type: 'INSTANCE',
                                      parent: {
                                        id: 'I210:183365;11098:286125;6914:504',
                                        layerName: 'alert-icon',
                                        type: 'FRAME',
                                        parent: {
                                          id: 'I210:183365;11098:286125',
                                          layerName: '_Alert-Structure',
                                          type: 'INSTANCE',
                                          parent: {
                                            id: '210:183365',
                                            layerName: 'Alert',
                                            type: 'INSTANCE',
                                            parent: null,
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          ],
                          name: 'alert-triangle',
                        },
                      ],
                      name: 'Action / alert-triangle',
                    },
                  ],
                },
                {
                  id: 'I210:183365;11098:286125;6914:505;98:48',
                  layerName: 'Color',
                  type: 'RECTANGLE',
                  parent: {
                    id: 'I210:183365;11098:286125;6914:505',
                    layerName: 'Size',
                    type: 'INSTANCE',
                    parent: {
                      id: 'I210:183365;11098:286125;6914:504',
                      layerName: 'alert-icon',
                      type: 'FRAME',
                      parent: {
                        id: 'I210:183365;11098:286125',
                        layerName: '_Alert-Structure',
                        type: 'INSTANCE',
                        parent: {
                          id: '210:183365',
                          layerName: 'Alert',
                          type: 'INSTANCE',
                          parent: null,
                        },
                      },
                    },
                  },
                },
              ],
              name: 'Size',
            },
          ],
          counterAxisAlignItems: 'MIN',
          primaryAxisAlignItems: 'MIN',
          paddingTop: 2,
          paddingRight: 0,
          paddingLeft: 0,
          paddingBottom: 0,
          layoutMode: 'HORIZONTAL',
          itemSpacing: 8,
        },
        {
          id: 'I210:183365;11098:286125;13564:75289',
          layerName: 'main',
          type: 'FRAME',
          parent: {
            id: 'I210:183365;11098:286125',
            layerName: '_Alert-Structure',
            type: 'INSTANCE',
            parent: {
              id: '210:183365',
              layerName: 'Alert',
              type: 'INSTANCE',
              parent: null,
            },
          },
          children: [
            {
              id: 'I210:183365;11098:286125;6914:506',
              layerName: 'alert-body',
              type: 'FRAME',
              parent: {
                id: 'I210:183365;11098:286125;13564:75289',
                layerName: 'main',
                type: 'FRAME',
                parent: {
                  id: 'I210:183365;11098:286125',
                  layerName: '_Alert-Structure',
                  type: 'INSTANCE',
                  parent: {
                    id: '210:183365',
                    layerName: 'Alert',
                    type: 'INSTANCE',
                    parent: null,
                  },
                },
              },
              children: [
                {
                  id: 'I210:183365;11098:286125;6914:507',
                  layerName: 'content',
                  type: 'FRAME',
                  parent: {
                    id: 'I210:183365;11098:286125;6914:506',
                    layerName: 'alert-body',
                    type: 'FRAME',
                    parent: {
                      id: 'I210:183365;11098:286125;13564:75289',
                      layerName: 'main',
                      type: 'FRAME',
                      parent: {
                        id: 'I210:183365;11098:286125',
                        layerName: '_Alert-Structure',
                        type: 'INSTANCE',
                        parent: {
                          id: '210:183365',
                          layerName: 'Alert',
                          type: 'INSTANCE',
                          parent: null,
                        },
                      },
                    },
                  },
                  children: [
                    {
                      id: 'I210:183365;11098:286125;6914:508',
                      layerName: 'title',
                      type: 'TEXT',
                      parent: {
                        id: 'I210:183365;11098:286125;6914:507',
                        layerName: 'content',
                        type: 'FRAME',
                        parent: {
                          id: 'I210:183365;11098:286125;6914:506',
                          layerName: 'alert-body',
                          type: 'FRAME',
                          parent: {
                            id: 'I210:183365;11098:286125;13564:75289',
                            layerName: 'main',
                            type: 'FRAME',
                            parent: {
                              id: 'I210:183365;11098:286125',
                              layerName: '_Alert-Structure',
                              type: 'INSTANCE',
                              parent: {
                                id: '210:183365',
                                layerName: 'Alert',
                                type: 'INSTANCE',
                                parent: null,
                              },
                            },
                          },
                        },
                      },
                      characters: 'I am the alert title',
                      textStyleId: 'S:677665330fe5d039031a4f09bf4b93b721e69fb4,12837:0',
                    },
                    {
                      id: 'I210:183365;11098:286125;14264:61201',
                      layerName: 'message-holder',
                      type: 'FRAME',
                      parent: {
                        id: 'I210:183365;11098:286125;6914:507',
                        layerName: 'content',
                        type: 'FRAME',
                        parent: {
                          id: 'I210:183365;11098:286125;6914:506',
                          layerName: 'alert-body',
                          type: 'FRAME',
                          parent: {
                            id: 'I210:183365;11098:286125;13564:75289',
                            layerName: 'main',
                            type: 'FRAME',
                            parent: {
                              id: 'I210:183365;11098:286125',
                              layerName: '_Alert-Structure',
                              type: 'INSTANCE',
                              parent: {
                                id: '210:183365',
                                layerName: 'Alert',
                                type: 'INSTANCE',
                                parent: null,
                              },
                            },
                          },
                        },
                      },
                      children: [
                        {
                          id: 'I210:183365;11098:286125;6914:509',
                          layerName: 'message',
                          type: 'TEXT',
                          parent: {
                            id: 'I210:183365;11098:286125;14264:61201',
                            layerName: 'message-holder',
                            type: 'FRAME',
                            parent: {
                              id: 'I210:183365;11098:286125;6914:507',
                              layerName: 'content',
                              type: 'FRAME',
                              parent: {
                                id: 'I210:183365;11098:286125;6914:506',
                                layerName: 'alert-body',
                                type: 'FRAME',
                                parent: {
                                  id: 'I210:183365;11098:286125;13564:75289',
                                  layerName: 'main',
                                  type: 'FRAME',
                                  parent: {
                                    id: 'I210:183365;11098:286125',
                                    layerName: '_Alert-Structure',
                                    type: 'INSTANCE',
                                    parent: {
                                      id: '210:183365',
                                      layerName: 'Alert',
                                      type: 'INSTANCE',
                                      parent: null,
                                    },
                                  },
                                },
                              },
                            },
                          },
                          characters:
                            'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.',
                          textStyleId: 'S:5eb1293d503fbc90da65c6fc60d2f5f93607b898,12837:6',
                        },
                      ],
                      counterAxisAlignItems: 'MIN',
                      primaryAxisAlignItems: 'MIN',
                      paddingTop: 2,
                      paddingRight: 0,
                      paddingLeft: 0,
                      paddingBottom: 0,
                      layoutMode: 'HORIZONTAL',
                      itemSpacing: 0,
                    },
                  ],
                  counterAxisAlignItems: 'MIN',
                  primaryAxisAlignItems: 'MIN',
                  paddingTop: 0,
                  paddingRight: 0,
                  paddingLeft: 0,
                  paddingBottom: 0,
                  layoutMode: 'VERTICAL',
                  itemSpacing: 2,
                },
              ],
              counterAxisAlignItems: 'MIN',
              primaryAxisAlignItems: 'MIN',
              paddingTop: 0,
              paddingRight: 0,
              paddingLeft: 0,
              paddingBottom: 0,
              layoutMode: 'VERTICAL',
              itemSpacing: 12,
            },
            {
              id: 'I210:183365;11098:286125;6914:513',
              layerName: 'alert-dismiss-button',
              type: 'GROUP',
              parent: {
                id: 'I210:183365;11098:286125;13564:75289',
                layerName: 'main',
                type: 'FRAME',
                parent: {
                  id: 'I210:183365;11098:286125',
                  layerName: '_Alert-Structure',
                  type: 'INSTANCE',
                  parent: {
                    id: '210:183365',
                    layerName: 'Alert',
                    type: 'INSTANCE',
                    parent: null,
                  },
                },
              },
              children: [
                {
                  id: 'I210:183365;11098:286125;6914:514',
                  layerName: '_Alert-Action',
                  type: 'INSTANCE',
                  parent: {
                    id: 'I210:183365;11098:286125;6914:513',
                    layerName: 'alert-dismiss-button',
                    type: 'GROUP',
                    parent: {
                      id: 'I210:183365;11098:286125;13564:75289',
                      layerName: 'main',
                      type: 'FRAME',
                      parent: {
                        id: 'I210:183365;11098:286125',
                        layerName: '_Alert-Structure',
                        type: 'INSTANCE',
                        parent: {
                          id: '210:183365',
                          layerName: 'Alert',
                          type: 'INSTANCE',
                          parent: null,
                        },
                      },
                    },
                  },
                  componentProperties: {
                    type: {
                      value: 'Close',
                      type: 'VARIANT',
                    },
                    size: {
                      value: 'Small',
                      type: 'VARIANT',
                    },
                    intent: {
                      value: 'N/A',
                      type: 'VARIANT',
                    },
                    screenSize: {
                      value: 'Desktop',
                      type: 'VARIANT',
                    },
                    contrast: {
                      value: 'Low',
                      type: 'VARIANT',
                    },
                  },
                  children: [
                    {
                      id: 'I210:183365;11098:286125;6914:514;12497:401500',
                      layerName: 'IconButton',
                      type: 'INSTANCE',
                      parent: {
                        id: 'I210:183365;11098:286125;6914:514',
                        layerName: '_Alert-Action',
                        type: 'INSTANCE',
                        parent: {
                          id: 'I210:183365;11098:286125;6914:513',
                          layerName: 'alert-dismiss-button',
                          type: 'GROUP',
                          parent: {
                            id: 'I210:183365;11098:286125;13564:75289',
                            layerName: 'main',
                            type: 'FRAME',
                            parent: {
                              id: 'I210:183365;11098:286125',
                              layerName: '_Alert-Structure',
                              type: 'INSTANCE',
                              parent: {
                                id: '210:183365',
                                layerName: 'Alert',
                                type: 'INSTANCE',
                                parent: null,
                              },
                            },
                          },
                        },
                      },
                      componentProperties: {
                        size: {
                          value: '16px',
                          type: 'VARIANT',
                        },
                        state: {
                          value: 'Default',
                          type: 'VARIANT',
                        },
                        screenSize: {
                          value: 'Desktop',
                          type: 'VARIANT',
                        },
                        contrast: {
                          value: 'Low',
                          type: 'VARIANT',
                        },
                      },
                      children: [
                        {
                          id: 'I210:183365;11098:286125;6914:514;12497:401500;10883:249482',
                          layerName: 'Size',
                          type: 'INSTANCE',
                          parent: {
                            id: 'I210:183365;11098:286125;6914:514;12497:401500',
                            layerName: 'IconButton',
                            type: 'INSTANCE',
                            parent: {
                              id: 'I210:183365;11098:286125;6914:514',
                              layerName: '_Alert-Action',
                              type: 'INSTANCE',
                              parent: {
                                id: 'I210:183365;11098:286125;6914:513',
                                layerName: 'alert-dismiss-button',
                                type: 'GROUP',
                                parent: {
                                  id: 'I210:183365;11098:286125;13564:75289',
                                  layerName: 'main',
                                  type: 'FRAME',
                                  parent: {
                                    id: 'I210:183365;11098:286125',
                                    layerName: '_Alert-Structure',
                                    type: 'INSTANCE',
                                    parent: {
                                      id: '210:183365',
                                      layerName: 'Alert',
                                      type: 'INSTANCE',
                                      parent: null,
                                    },
                                  },
                                },
                              },
                            },
                          },
                          componentProperties: {
                            size: {
                              value: 'md (16px)',
                              type: 'VARIANT',
                            },
                          },
                          children: [
                            {
                              id:
                                'I210:183365;11098:286125;6914:514;12497:401500;10883:249482;98:46',
                              layerName: 'Shape',
                              type: 'GROUP',
                              parent: {
                                id: 'I210:183365;11098:286125;6914:514;12497:401500;10883:249482',
                                layerName: 'Size',
                                type: 'INSTANCE',
                                parent: {
                                  id: 'I210:183365;11098:286125;6914:514;12497:401500',
                                  layerName: 'IconButton',
                                  type: 'INSTANCE',
                                  parent: {
                                    id: 'I210:183365;11098:286125;6914:514',
                                    layerName: '_Alert-Action',
                                    type: 'INSTANCE',
                                    parent: {
                                      id: 'I210:183365;11098:286125;6914:513',
                                      layerName: 'alert-dismiss-button',
                                      type: 'GROUP',
                                      parent: {
                                        id: 'I210:183365;11098:286125;13564:75289',
                                        layerName: 'main',
                                        type: 'FRAME',
                                        parent: {
                                          id: 'I210:183365;11098:286125',
                                          layerName: '_Alert-Structure',
                                          type: 'INSTANCE',
                                          parent: {
                                            id: '210:183365',
                                            layerName: 'Alert',
                                            type: 'INSTANCE',
                                            parent: null,
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                              children: [
                                {
                                  id:
                                    'I210:183365;11098:286125;6914:514;12497:401500;10883:249482;98:47',
                                  layerName: 'Icon (change here)',
                                  type: 'INSTANCE',
                                  parent: {
                                    id:
                                      'I210:183365;11098:286125;6914:514;12497:401500;10883:249482;98:46',
                                    layerName: 'Shape',
                                    type: 'GROUP',
                                    parent: {
                                      id:
                                        'I210:183365;11098:286125;6914:514;12497:401500;10883:249482',
                                      layerName: 'Size',
                                      type: 'INSTANCE',
                                      parent: {
                                        id: 'I210:183365;11098:286125;6914:514;12497:401500',
                                        layerName: 'IconButton',
                                        type: 'INSTANCE',
                                        parent: {
                                          id: 'I210:183365;11098:286125;6914:514',
                                          layerName: '_Alert-Action',
                                          type: 'INSTANCE',
                                          parent: {
                                            id: 'I210:183365;11098:286125;6914:513',
                                            layerName: 'alert-dismiss-button',
                                            type: 'GROUP',
                                            parent: {
                                              id: 'I210:183365;11098:286125;13564:75289',
                                              layerName: 'main',
                                              type: 'FRAME',
                                              parent: {
                                                id: 'I210:183365;11098:286125',
                                                layerName: '_Alert-Structure',
                                                type: 'INSTANCE',
                                                parent: {
                                                  id: '210:183365',
                                                  layerName: 'Alert',
                                                  type: 'INSTANCE',
                                                  parent: null,
                                                },
                                              },
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                  componentProperties: {},
                                  children: [
                                    {
                                      id:
                                        'I210:183365;11098:286125;6914:514;12497:401500;10883:249482;98:47;9308:64865',
                                      layerName: 'close',
                                      type: 'INSTANCE',
                                      parent: {
                                        id:
                                          'I210:183365;11098:286125;6914:514;12497:401500;10883:249482;98:47',
                                        layerName: 'Icon (change here)',
                                        type: 'INSTANCE',
                                        parent: {
                                          id:
                                            'I210:183365;11098:286125;6914:514;12497:401500;10883:249482;98:46',
                                          layerName: 'Shape',
                                          type: 'GROUP',
                                          parent: {
                                            id:
                                              'I210:183365;11098:286125;6914:514;12497:401500;10883:249482',
                                            layerName: 'Size',
                                            type: 'INSTANCE',
                                            parent: {
                                              id: 'I210:183365;11098:286125;6914:514;12497:401500',
                                              layerName: 'IconButton',
                                              type: 'INSTANCE',
                                              parent: {
                                                id: 'I210:183365;11098:286125;6914:514',
                                                layerName: '_Alert-Action',
                                                type: 'INSTANCE',
                                                parent: {
                                                  id: 'I210:183365;11098:286125;6914:513',
                                                  layerName: 'alert-dismiss-button',
                                                  type: 'GROUP',
                                                  parent: {
                                                    id: 'I210:183365;11098:286125;13564:75289',
                                                    layerName: 'main',
                                                    type: 'FRAME',
                                                    parent: {
                                                      id: 'I210:183365;11098:286125',
                                                      layerName: '_Alert-Structure',
                                                      type: 'INSTANCE',
                                                      parent: {
                                                        id: '210:183365',
                                                        layerName: 'Alert',
                                                        type: 'INSTANCE',
                                                        parent: null,
                                                      },
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                          },
                                        },
                                      },
                                      componentProperties: {},
                                      children: [
                                        {
                                          id:
                                            'I210:183365;11098:286125;6914:514;12497:401500;10883:249482;98:47;9308:64865;58:551',
                                          layerName: 'Union',
                                          type: 'VECTOR',
                                          parent: {
                                            id:
                                              'I210:183365;11098:286125;6914:514;12497:401500;10883:249482;98:47;9308:64865',
                                            layerName: 'close',
                                            type: 'INSTANCE',
                                            parent: {
                                              id:
                                                'I210:183365;11098:286125;6914:514;12497:401500;10883:249482;98:47',
                                              layerName: 'Icon (change here)',
                                              type: 'INSTANCE',
                                              parent: {
                                                id:
                                                  'I210:183365;11098:286125;6914:514;12497:401500;10883:249482;98:46',
                                                layerName: 'Shape',
                                                type: 'GROUP',
                                                parent: {
                                                  id:
                                                    'I210:183365;11098:286125;6914:514;12497:401500;10883:249482',
                                                  layerName: 'Size',
                                                  type: 'INSTANCE',
                                                  parent: {
                                                    id:
                                                      'I210:183365;11098:286125;6914:514;12497:401500',
                                                    layerName: 'IconButton',
                                                    type: 'INSTANCE',
                                                    parent: {
                                                      id: 'I210:183365;11098:286125;6914:514',
                                                      layerName: '_Alert-Action',
                                                      type: 'INSTANCE',
                                                      parent: {
                                                        id: 'I210:183365;11098:286125;6914:513',
                                                        layerName: 'alert-dismiss-button',
                                                        type: 'GROUP',
                                                        parent: {
                                                          id:
                                                            'I210:183365;11098:286125;13564:75289',
                                                          layerName: 'main',
                                                          type: 'FRAME',
                                                          parent: {
                                                            id: 'I210:183365;11098:286125',
                                                            layerName: '_Alert-Structure',
                                                            type: 'INSTANCE',
                                                            parent: {
                                                              id: '210:183365',
                                                              layerName: 'Alert',
                                                              type: 'INSTANCE',
                                                              parent: null,
                                                            },
                                                          },
                                                        },
                                                      },
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                          },
                                        },
                                      ],
                                      name: 'close',
                                    },
                                  ],
                                  name: 'close',
                                },
                              ],
                            },
                            {
                              id:
                                'I210:183365;11098:286125;6914:514;12497:401500;10883:249482;98:48',
                              layerName: 'Color',
                              type: 'RECTANGLE',
                              parent: {
                                id: 'I210:183365;11098:286125;6914:514;12497:401500;10883:249482',
                                layerName: 'Size',
                                type: 'INSTANCE',
                                parent: {
                                  id: 'I210:183365;11098:286125;6914:514;12497:401500',
                                  layerName: 'IconButton',
                                  type: 'INSTANCE',
                                  parent: {
                                    id: 'I210:183365;11098:286125;6914:514',
                                    layerName: '_Alert-Action',
                                    type: 'INSTANCE',
                                    parent: {
                                      id: 'I210:183365;11098:286125;6914:513',
                                      layerName: 'alert-dismiss-button',
                                      type: 'GROUP',
                                      parent: {
                                        id: 'I210:183365;11098:286125;13564:75289',
                                        layerName: 'main',
                                        type: 'FRAME',
                                        parent: {
                                          id: 'I210:183365;11098:286125',
                                          layerName: '_Alert-Structure',
                                          type: 'INSTANCE',
                                          parent: {
                                            id: '210:183365',
                                            layerName: 'Alert',
                                            type: 'INSTANCE',
                                            parent: null,
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          ],
                          name: 'Size',
                        },
                      ],
                      name: 'IconButton',
                    },
                  ],
                  name: '_Alert-Action',
                },
              ],
            },
          ],
          counterAxisAlignItems: 'MIN',
          primaryAxisAlignItems: 'MIN',
          paddingTop: 0,
          paddingRight: 0,
          paddingLeft: 0,
          paddingBottom: 0,
          layoutMode: 'HORIZONTAL',
          itemSpacing: 4,
        },
      ],
      name: '_Alert-Structure',
    },
  ],
  name: 'Alert',
  fills: [],
  fillStyleId: '',
  width: 0,
  height: 0,
};

export const highContrastDismissibleWarningAlert: BladeComponentInstanceNode = {
  id: '210:183615',
  layerName: 'Alert',
  type: 'INSTANCE',
  parent: null,
  componentProperties: {
    Intent: { value: 'Notice', type: 'VARIANT' },
    isDismissible: { value: 'True', type: 'VARIANT' },
    primaryAction: { value: 'False', type: 'VARIANT' },
    secondaryAction: { value: 'False', type: 'VARIANT' },
    isFullWidth: { value: 'False', type: 'VARIANT' },
    screenSize: { value: 'Desktop', type: 'VARIANT' },
    contrast: { value: 'High', type: 'VARIANT' },
  },
  children: [
    {
      id: 'I210:183615;11098:286221',
      layerName: '_Alert-Structure',
      type: 'INSTANCE',
      parent: {
        id: '210:183615',
        layerName: 'Alert',
        type: 'INSTANCE',
        parent: null,
      },
      componentProperties: {
        screenSize: { value: 'Large', type: 'VARIANT' },
        isFlat: { value: 'False', type: 'VARIANT' },
      },
      children: [
        {
          id: 'I210:183615;11098:286221;6914:504',
          layerName: 'alert-icon',
          type: 'FRAME',
          parent: {
            id: 'I210:183615;11098:286221',
            layerName: '_Alert-Structure',
            type: 'INSTANCE',
            parent: {
              id: '210:183615',
              layerName: 'Alert',
              type: 'INSTANCE',
              parent: null,
            },
          },
          children: [
            {
              id: 'I210:183615;11098:286221;6914:505',
              layerName: 'Size',
              type: 'INSTANCE',
              parent: {
                id: 'I210:183615;11098:286221;6914:504',
                layerName: 'alert-icon',
                type: 'FRAME',
                parent: {
                  id: 'I210:183615;11098:286221',
                  layerName: '_Alert-Structure',
                  type: 'INSTANCE',
                  parent: {
                    id: '210:183615',
                    layerName: 'Alert',
                    type: 'INSTANCE',
                    parent: null,
                  },
                },
              },
              componentProperties: {
                size: { value: 'md (16px)', type: 'VARIANT' },
              },
              children: [
                {
                  id: 'I210:183615;11098:286221;6914:505;98:46',
                  layerName: 'Shape',
                  type: 'GROUP',
                  parent: {
                    id: 'I210:183615;11098:286221;6914:505',
                    layerName: 'Size',
                    type: 'INSTANCE',
                    parent: {
                      id: 'I210:183615;11098:286221;6914:504',
                      layerName: 'alert-icon',
                      type: 'FRAME',
                      parent: {
                        id: 'I210:183615;11098:286221',
                        layerName: '_Alert-Structure',
                        type: 'INSTANCE',
                        parent: {
                          id: '210:183615',
                          layerName: 'Alert',
                          type: 'INSTANCE',
                          parent: null,
                        },
                      },
                    },
                  },
                  children: [
                    {
                      id: 'I210:183615;11098:286221;6914:505;98:47',
                      layerName: 'Action / alert-triangle',
                      type: 'INSTANCE',
                      parent: {
                        id: 'I210:183615;11098:286221;6914:505;98:46',
                        layerName: 'Shape',
                        type: 'GROUP',
                        parent: {
                          id: 'I210:183615;11098:286221;6914:505',
                          layerName: 'Size',
                          type: 'INSTANCE',
                          parent: {
                            id: 'I210:183615;11098:286221;6914:504',
                            layerName: 'alert-icon',
                            type: 'FRAME',
                            parent: {
                              id: 'I210:183615;11098:286221',
                              layerName: '_Alert-Structure',
                              type: 'INSTANCE',
                              parent: {
                                id: '210:183615',
                                layerName: 'Alert',
                                type: 'INSTANCE',
                                parent: null,
                              },
                            },
                          },
                        },
                      },
                      componentProperties: {},
                      children: [
                        {
                          id: 'I210:183615;11098:286221;6914:505;98:47;59:730',
                          layerName: 'alert-triangle',
                          type: 'INSTANCE',
                          parent: {
                            id: 'I210:183615;11098:286221;6914:505;98:47',
                            layerName: 'Action / alert-triangle',
                            type: 'INSTANCE',
                            parent: {
                              id: 'I210:183615;11098:286221;6914:505;98:46',
                              layerName: 'Shape',
                              type: 'GROUP',
                              parent: {
                                id: 'I210:183615;11098:286221;6914:505',
                                layerName: 'Size',
                                type: 'INSTANCE',
                                parent: {
                                  id: 'I210:183615;11098:286221;6914:504',
                                  layerName: 'alert-icon',
                                  type: 'FRAME',
                                  parent: {
                                    id: 'I210:183615;11098:286221',
                                    layerName: '_Alert-Structure',
                                    type: 'INSTANCE',
                                    parent: {
                                      id: '210:183615',
                                      layerName: 'Alert',
                                      type: 'INSTANCE',
                                      parent: null,
                                    },
                                  },
                                },
                              },
                            },
                          },
                          componentProperties: {},
                          children: [
                            {
                              id: 'I210:183615;11098:286221;6914:505;98:47;59:730;58:41',
                              layerName: 'Union',
                              type: 'VECTOR',
                              parent: {
                                id: 'I210:183615;11098:286221;6914:505;98:47;59:730',
                                layerName: 'alert-triangle',
                                type: 'INSTANCE',
                                parent: {
                                  id: 'I210:183615;11098:286221;6914:505;98:47',
                                  layerName: 'Action / alert-triangle',
                                  type: 'INSTANCE',
                                  parent: {
                                    id: 'I210:183615;11098:286221;6914:505;98:46',
                                    layerName: 'Shape',
                                    type: 'GROUP',
                                    parent: {
                                      id: 'I210:183615;11098:286221;6914:505',
                                      layerName: 'Size',
                                      type: 'INSTANCE',
                                      parent: {
                                        id: 'I210:183615;11098:286221;6914:504',
                                        layerName: 'alert-icon',
                                        type: 'FRAME',
                                        parent: {
                                          id: 'I210:183615;11098:286221',
                                          layerName: '_Alert-Structure',
                                          type: 'INSTANCE',
                                          parent: {
                                            id: '210:183615',
                                            layerName: 'Alert',
                                            type: 'INSTANCE',
                                            parent: null,
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          ],
                          name: 'alert-triangle',
                        },
                      ],
                      name: 'Action / alert-triangle',
                    },
                  ],
                },
                {
                  id: 'I210:183615;11098:286221;6914:505;98:48',
                  layerName: 'Color',
                  type: 'RECTANGLE',
                  parent: {
                    id: 'I210:183615;11098:286221;6914:505',
                    layerName: 'Size',
                    type: 'INSTANCE',
                    parent: {
                      id: 'I210:183615;11098:286221;6914:504',
                      layerName: 'alert-icon',
                      type: 'FRAME',
                      parent: {
                        id: 'I210:183615;11098:286221',
                        layerName: '_Alert-Structure',
                        type: 'INSTANCE',
                        parent: {
                          id: '210:183615',
                          layerName: 'Alert',
                          type: 'INSTANCE',
                          parent: null,
                        },
                      },
                    },
                  },
                },
              ],
              name: 'Size',
            },
          ],
          counterAxisAlignItems: 'MIN',
          primaryAxisAlignItems: 'MIN',
          paddingTop: 2,
          paddingRight: 0,
          paddingLeft: 0,
          paddingBottom: 0,
          layoutMode: 'HORIZONTAL',
          itemSpacing: 8,
        },
        {
          id: 'I210:183615;11098:286221;13564:75289',
          layerName: 'main',
          type: 'FRAME',
          parent: {
            id: 'I210:183615;11098:286221',
            layerName: '_Alert-Structure',
            type: 'INSTANCE',
            parent: {
              id: '210:183615',
              layerName: 'Alert',
              type: 'INSTANCE',
              parent: null,
            },
          },
          children: [
            {
              id: 'I210:183615;11098:286221;6914:506',
              layerName: 'alert-body',
              type: 'FRAME',
              parent: {
                id: 'I210:183615;11098:286221;13564:75289',
                layerName: 'main',
                type: 'FRAME',
                parent: {
                  id: 'I210:183615;11098:286221',
                  layerName: '_Alert-Structure',
                  type: 'INSTANCE',
                  parent: {
                    id: '210:183615',
                    layerName: 'Alert',
                    type: 'INSTANCE',
                    parent: null,
                  },
                },
              },
              children: [
                {
                  id: 'I210:183615;11098:286221;6914:507',
                  layerName: 'content',
                  type: 'FRAME',
                  parent: {
                    id: 'I210:183615;11098:286221;6914:506',
                    layerName: 'alert-body',
                    type: 'FRAME',
                    parent: {
                      id: 'I210:183615;11098:286221;13564:75289',
                      layerName: 'main',
                      type: 'FRAME',
                      parent: {
                        id: 'I210:183615;11098:286221',
                        layerName: '_Alert-Structure',
                        type: 'INSTANCE',
                        parent: {
                          id: '210:183615',
                          layerName: 'Alert',
                          type: 'INSTANCE',
                          parent: null,
                        },
                      },
                    },
                  },
                  children: [
                    {
                      id: 'I210:183615;11098:286221;6914:508',
                      layerName: 'title',
                      type: 'TEXT',
                      parent: {
                        id: 'I210:183615;11098:286221;6914:507',
                        layerName: 'content',
                        type: 'FRAME',
                        parent: {
                          id: 'I210:183615;11098:286221;6914:506',
                          layerName: 'alert-body',
                          type: 'FRAME',
                          parent: {
                            id: 'I210:183615;11098:286221;13564:75289',
                            layerName: 'main',
                            type: 'FRAME',
                            parent: {
                              id: 'I210:183615;11098:286221',
                              layerName: '_Alert-Structure',
                              type: 'INSTANCE',
                              parent: {
                                id: '210:183615',
                                layerName: 'Alert',
                                type: 'INSTANCE',
                                parent: null,
                              },
                            },
                          },
                        },
                      },
                      characters: 'I am the alert title',
                      textStyleId: 'S:677665330fe5d039031a4f09bf4b93b721e69fb4,12837:0',
                    },
                    {
                      id: 'I210:183615;11098:286221;14264:61201',
                      layerName: 'message-holder',
                      type: 'FRAME',
                      parent: {
                        id: 'I210:183615;11098:286221;6914:507',
                        layerName: 'content',
                        type: 'FRAME',
                        parent: {
                          id: 'I210:183615;11098:286221;6914:506',
                          layerName: 'alert-body',
                          type: 'FRAME',
                          parent: {
                            id: 'I210:183615;11098:286221;13564:75289',
                            layerName: 'main',
                            type: 'FRAME',
                            parent: {
                              id: 'I210:183615;11098:286221',
                              layerName: '_Alert-Structure',
                              type: 'INSTANCE',
                              parent: {
                                id: '210:183615',
                                layerName: 'Alert',
                                type: 'INSTANCE',
                                parent: null,
                              },
                            },
                          },
                        },
                      },
                      children: [
                        {
                          id: 'I210:183615;11098:286221;6914:509',
                          layerName: 'message',
                          type: 'TEXT',
                          parent: {
                            id: 'I210:183615;11098:286221;14264:61201',
                            layerName: 'message-holder',
                            type: 'FRAME',
                            parent: {
                              id: 'I210:183615;11098:286221;6914:507',
                              layerName: 'content',
                              type: 'FRAME',
                              parent: {
                                id: 'I210:183615;11098:286221;6914:506',
                                layerName: 'alert-body',
                                type: 'FRAME',
                                parent: {
                                  id: 'I210:183615;11098:286221;13564:75289',
                                  layerName: 'main',
                                  type: 'FRAME',
                                  parent: {
                                    id: 'I210:183615;11098:286221',
                                    layerName: '_Alert-Structure',
                                    type: 'INSTANCE',
                                    parent: {
                                      id: '210:183615',
                                      layerName: 'Alert',
                                      type: 'INSTANCE',
                                      parent: null,
                                    },
                                  },
                                },
                              },
                            },
                          },
                          characters:
                            'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.',
                          textStyleId: 'S:5eb1293d503fbc90da65c6fc60d2f5f93607b898,12837:6',
                        },
                      ],
                      counterAxisAlignItems: 'MIN',
                      primaryAxisAlignItems: 'MIN',
                      paddingTop: 2,
                      paddingRight: 0,
                      paddingLeft: 0,
                      paddingBottom: 0,
                      layoutMode: 'HORIZONTAL',
                      itemSpacing: 0,
                    },
                  ],
                  counterAxisAlignItems: 'MIN',
                  primaryAxisAlignItems: 'MIN',
                  paddingTop: 0,
                  paddingRight: 0,
                  paddingLeft: 0,
                  paddingBottom: 0,
                  layoutMode: 'VERTICAL',
                  itemSpacing: 2,
                },
              ],
              counterAxisAlignItems: 'MIN',
              primaryAxisAlignItems: 'MIN',
              paddingTop: 0,
              paddingRight: 0,
              paddingLeft: 0,
              paddingBottom: 0,
              layoutMode: 'VERTICAL',
              itemSpacing: 12,
            },
            {
              id: 'I210:183615;11098:286221;6914:513',
              layerName: 'alert-dismiss-button',
              type: 'GROUP',
              parent: {
                id: 'I210:183615;11098:286221;13564:75289',
                layerName: 'main',
                type: 'FRAME',
                parent: {
                  id: 'I210:183615;11098:286221',
                  layerName: '_Alert-Structure',
                  type: 'INSTANCE',
                  parent: {
                    id: '210:183615',
                    layerName: 'Alert',
                    type: 'INSTANCE',
                    parent: null,
                  },
                },
              },
              children: [
                {
                  id: 'I210:183615;11098:286221;6914:514',
                  layerName: '_Alert-Action',
                  type: 'INSTANCE',
                  parent: {
                    id: 'I210:183615;11098:286221;6914:513',
                    layerName: 'alert-dismiss-button',
                    type: 'GROUP',
                    parent: {
                      id: 'I210:183615;11098:286221;13564:75289',
                      layerName: 'main',
                      type: 'FRAME',
                      parent: {
                        id: 'I210:183615;11098:286221',
                        layerName: '_Alert-Structure',
                        type: 'INSTANCE',
                        parent: {
                          id: '210:183615',
                          layerName: 'Alert',
                          type: 'INSTANCE',
                          parent: null,
                        },
                      },
                    },
                  },
                  componentProperties: {
                    type: { value: 'Close', type: 'VARIANT' },
                    size: { value: 'Small', type: 'VARIANT' },
                    intent: { value: 'N/A', type: 'VARIANT' },
                    screenSize: { value: 'Desktop', type: 'VARIANT' },
                    contrast: { value: 'High', type: 'VARIANT' },
                  },
                  children: [
                    {
                      id: 'I210:183615;11098:286221;6914:514;12497:401514',
                      layerName: 'IconButton',
                      type: 'INSTANCE',
                      parent: {
                        id: 'I210:183615;11098:286221;6914:514',
                        layerName: '_Alert-Action',
                        type: 'INSTANCE',
                        parent: {
                          id: 'I210:183615;11098:286221;6914:513',
                          layerName: 'alert-dismiss-button',
                          type: 'GROUP',
                          parent: {
                            id: 'I210:183615;11098:286221;13564:75289',
                            layerName: 'main',
                            type: 'FRAME',
                            parent: {
                              id: 'I210:183615;11098:286221',
                              layerName: '_Alert-Structure',
                              type: 'INSTANCE',
                              parent: {
                                id: '210:183615',
                                layerName: 'Alert',
                                type: 'INSTANCE',
                                parent: null,
                              },
                            },
                          },
                        },
                      },
                      componentProperties: {
                        size: { value: '16px', type: 'VARIANT' },
                        state: { value: 'Default', type: 'VARIANT' },
                        screenSize: { value: 'Desktop', type: 'VARIANT' },
                        contrast: { value: 'High', type: 'VARIANT' },
                      },
                      children: [
                        {
                          id: 'I210:183615;11098:286221;6914:514;12497:401514;10883:249526',
                          layerName: 'Size',
                          type: 'INSTANCE',
                          parent: {
                            id: 'I210:183615;11098:286221;6914:514;12497:401514',
                            layerName: 'IconButton',
                            type: 'INSTANCE',
                            parent: {
                              id: 'I210:183615;11098:286221;6914:514',
                              layerName: '_Alert-Action',
                              type: 'INSTANCE',
                              parent: {
                                id: 'I210:183615;11098:286221;6914:513',
                                layerName: 'alert-dismiss-button',
                                type: 'GROUP',
                                parent: {
                                  id: 'I210:183615;11098:286221;13564:75289',
                                  layerName: 'main',
                                  type: 'FRAME',
                                  parent: {
                                    id: 'I210:183615;11098:286221',
                                    layerName: '_Alert-Structure',
                                    type: 'INSTANCE',
                                    parent: {
                                      id: '210:183615',
                                      layerName: 'Alert',
                                      type: 'INSTANCE',
                                      parent: null,
                                    },
                                  },
                                },
                              },
                            },
                          },
                          componentProperties: {
                            size: { value: 'md (16px)', type: 'VARIANT' },
                          },
                          children: [
                            {
                              id:
                                'I210:183615;11098:286221;6914:514;12497:401514;10883:249526;98:46',
                              layerName: 'Shape',
                              type: 'GROUP',
                              parent: {
                                id: 'I210:183615;11098:286221;6914:514;12497:401514;10883:249526',
                                layerName: 'Size',
                                type: 'INSTANCE',
                                parent: {
                                  id: 'I210:183615;11098:286221;6914:514;12497:401514',
                                  layerName: 'IconButton',
                                  type: 'INSTANCE',
                                  parent: {
                                    id: 'I210:183615;11098:286221;6914:514',
                                    layerName: '_Alert-Action',
                                    type: 'INSTANCE',
                                    parent: {
                                      id: 'I210:183615;11098:286221;6914:513',
                                      layerName: 'alert-dismiss-button',
                                      type: 'GROUP',
                                      parent: {
                                        id: 'I210:183615;11098:286221;13564:75289',
                                        layerName: 'main',
                                        type: 'FRAME',
                                        parent: {
                                          id: 'I210:183615;11098:286221',
                                          layerName: '_Alert-Structure',
                                          type: 'INSTANCE',
                                          parent: {
                                            id: '210:183615',
                                            layerName: 'Alert',
                                            type: 'INSTANCE',
                                            parent: null,
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                              children: [
                                {
                                  id:
                                    'I210:183615;11098:286221;6914:514;12497:401514;10883:249526;98:47',
                                  layerName: 'Icon (change here)',
                                  type: 'INSTANCE',
                                  parent: {
                                    id:
                                      'I210:183615;11098:286221;6914:514;12497:401514;10883:249526;98:46',
                                    layerName: 'Shape',
                                    type: 'GROUP',
                                    parent: {
                                      id:
                                        'I210:183615;11098:286221;6914:514;12497:401514;10883:249526',
                                      layerName: 'Size',
                                      type: 'INSTANCE',
                                      parent: {
                                        id: 'I210:183615;11098:286221;6914:514;12497:401514',
                                        layerName: 'IconButton',
                                        type: 'INSTANCE',
                                        parent: {
                                          id: 'I210:183615;11098:286221;6914:514',
                                          layerName: '_Alert-Action',
                                          type: 'INSTANCE',
                                          parent: {
                                            id: 'I210:183615;11098:286221;6914:513',
                                            layerName: 'alert-dismiss-button',
                                            type: 'GROUP',
                                            parent: {
                                              id: 'I210:183615;11098:286221;13564:75289',
                                              layerName: 'main',
                                              type: 'FRAME',
                                              parent: {
                                                id: 'I210:183615;11098:286221',
                                                layerName: '_Alert-Structure',
                                                type: 'INSTANCE',
                                                parent: {
                                                  id: '210:183615',
                                                  layerName: 'Alert',
                                                  type: 'INSTANCE',
                                                  parent: null,
                                                },
                                              },
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                  componentProperties: {},
                                  children: [
                                    {
                                      id:
                                        'I210:183615;11098:286221;6914:514;12497:401514;10883:249526;98:47;9308:64865',
                                      layerName: 'close',
                                      type: 'INSTANCE',
                                      parent: {
                                        id:
                                          'I210:183615;11098:286221;6914:514;12497:401514;10883:249526;98:47',
                                        layerName: 'Icon (change here)',
                                        type: 'INSTANCE',
                                        parent: {
                                          id:
                                            'I210:183615;11098:286221;6914:514;12497:401514;10883:249526;98:46',
                                          layerName: 'Shape',
                                          type: 'GROUP',
                                          parent: {
                                            id:
                                              'I210:183615;11098:286221;6914:514;12497:401514;10883:249526',
                                            layerName: 'Size',
                                            type: 'INSTANCE',
                                            parent: {
                                              id: 'I210:183615;11098:286221;6914:514;12497:401514',
                                              layerName: 'IconButton',
                                              type: 'INSTANCE',
                                              parent: {
                                                id: 'I210:183615;11098:286221;6914:514',
                                                layerName: '_Alert-Action',
                                                type: 'INSTANCE',
                                                parent: {
                                                  id: 'I210:183615;11098:286221;6914:513',
                                                  layerName: 'alert-dismiss-button',
                                                  type: 'GROUP',
                                                  parent: {
                                                    id: 'I210:183615;11098:286221;13564:75289',
                                                    layerName: 'main',
                                                    type: 'FRAME',
                                                    parent: {
                                                      id: 'I210:183615;11098:286221',
                                                      layerName: '_Alert-Structure',
                                                      type: 'INSTANCE',
                                                      parent: {
                                                        id: '210:183615',
                                                        layerName: 'Alert',
                                                        type: 'INSTANCE',
                                                        parent: null,
                                                      },
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                          },
                                        },
                                      },
                                      componentProperties: {},
                                      children: [
                                        {
                                          id:
                                            'I210:183615;11098:286221;6914:514;12497:401514;10883:249526;98:47;9308:64865;58:551',
                                          layerName: 'Union',
                                          type: 'VECTOR',
                                          parent: {
                                            id:
                                              'I210:183615;11098:286221;6914:514;12497:401514;10883:249526;98:47;9308:64865',
                                            layerName: 'close',
                                            type: 'INSTANCE',
                                            parent: {
                                              id:
                                                'I210:183615;11098:286221;6914:514;12497:401514;10883:249526;98:47',
                                              layerName: 'Icon (change here)',
                                              type: 'INSTANCE',
                                              parent: {
                                                id:
                                                  'I210:183615;11098:286221;6914:514;12497:401514;10883:249526;98:46',
                                                layerName: 'Shape',
                                                type: 'GROUP',
                                                parent: {
                                                  id:
                                                    'I210:183615;11098:286221;6914:514;12497:401514;10883:249526',
                                                  layerName: 'Size',
                                                  type: 'INSTANCE',
                                                  parent: {
                                                    id:
                                                      'I210:183615;11098:286221;6914:514;12497:401514',
                                                    layerName: 'IconButton',
                                                    type: 'INSTANCE',
                                                    parent: {
                                                      id: 'I210:183615;11098:286221;6914:514',
                                                      layerName: '_Alert-Action',
                                                      type: 'INSTANCE',
                                                      parent: {
                                                        id: 'I210:183615;11098:286221;6914:513',
                                                        layerName: 'alert-dismiss-button',
                                                        type: 'GROUP',
                                                        parent: {
                                                          id:
                                                            'I210:183615;11098:286221;13564:75289',
                                                          layerName: 'main',
                                                          type: 'FRAME',
                                                          parent: {
                                                            id: 'I210:183615;11098:286221',
                                                            layerName: '_Alert-Structure',
                                                            type: 'INSTANCE',
                                                            parent: {
                                                              id: '210:183615',
                                                              layerName: 'Alert',
                                                              type: 'INSTANCE',
                                                              parent: null,
                                                            },
                                                          },
                                                        },
                                                      },
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                          },
                                        },
                                      ],
                                      name: 'close',
                                    },
                                  ],
                                  name: 'close',
                                },
                              ],
                            },
                            {
                              id:
                                'I210:183615;11098:286221;6914:514;12497:401514;10883:249526;98:48',
                              layerName: 'Color',
                              type: 'RECTANGLE',
                              parent: {
                                id: 'I210:183615;11098:286221;6914:514;12497:401514;10883:249526',
                                layerName: 'Size',
                                type: 'INSTANCE',
                                parent: {
                                  id: 'I210:183615;11098:286221;6914:514;12497:401514',
                                  layerName: 'IconButton',
                                  type: 'INSTANCE',
                                  parent: {
                                    id: 'I210:183615;11098:286221;6914:514',
                                    layerName: '_Alert-Action',
                                    type: 'INSTANCE',
                                    parent: {
                                      id: 'I210:183615;11098:286221;6914:513',
                                      layerName: 'alert-dismiss-button',
                                      type: 'GROUP',
                                      parent: {
                                        id: 'I210:183615;11098:286221;13564:75289',
                                        layerName: 'main',
                                        type: 'FRAME',
                                        parent: {
                                          id: 'I210:183615;11098:286221',
                                          layerName: '_Alert-Structure',
                                          type: 'INSTANCE',
                                          parent: {
                                            id: '210:183615',
                                            layerName: 'Alert',
                                            type: 'INSTANCE',
                                            parent: null,
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          ],
                          name: 'Size',
                        },
                      ],
                      name: 'IconButton',
                    },
                  ],
                  name: '_Alert-Action',
                },
              ],
            },
          ],
          counterAxisAlignItems: 'MIN',
          primaryAxisAlignItems: 'MIN',
          paddingTop: 0,
          paddingRight: 0,
          paddingLeft: 0,
          paddingBottom: 0,
          layoutMode: 'HORIZONTAL',
          itemSpacing: 4,
        },
      ],
      name: '_Alert-Structure',
    },
  ],
  name: 'Alert',
  fills: [],
  fillStyleId: '',
  width: 0,
  height: 0,
};

export const infoAlert: BladeComponentInstanceNode = {
  id: '210:185255',
  layerName: 'Alert',
  type: 'INSTANCE',
  parent: null,
  componentProperties: {
    Intent: { value: 'Information', type: 'VARIANT' },
    isDismissible: { value: 'False', type: 'VARIANT' },
    primaryAction: { value: 'False', type: 'VARIANT' },
    secondaryAction: { value: 'False', type: 'VARIANT' },
    isFullWidth: { value: 'False', type: 'VARIANT' },
    screenSize: { value: 'Desktop', type: 'VARIANT' },
    contrast: { value: 'Low', type: 'VARIANT' },
  },
  children: [
    {
      id: 'I210:185255;11098:286199',
      layerName: '_Alert-Structure',
      type: 'INSTANCE',
      parent: {
        id: '210:185255',
        layerName: 'Alert',
        type: 'INSTANCE',
        parent: null,
      },
      componentProperties: {
        screenSize: { value: 'Large', type: 'VARIANT' },
        isFlat: { value: 'False', type: 'VARIANT' },
      },
      children: [
        {
          id: 'I210:185255;11098:286199;6914:504',
          layerName: 'alert-icon',
          type: 'FRAME',
          parent: {
            id: 'I210:185255;11098:286199',
            layerName: '_Alert-Structure',
            type: 'INSTANCE',
            parent: {
              id: '210:185255',
              layerName: 'Alert',
              type: 'INSTANCE',
              parent: null,
            },
          },
          children: [
            {
              id: 'I210:185255;11098:286199;6914:505',
              layerName: 'Size',
              type: 'INSTANCE',
              parent: {
                id: 'I210:185255;11098:286199;6914:504',
                layerName: 'alert-icon',
                type: 'FRAME',
                parent: {
                  id: 'I210:185255;11098:286199',
                  layerName: '_Alert-Structure',
                  type: 'INSTANCE',
                  parent: {
                    id: '210:185255',
                    layerName: 'Alert',
                    type: 'INSTANCE',
                    parent: null,
                  },
                },
              },
              componentProperties: {
                size: { value: 'md (16px)', type: 'VARIANT' },
              },
              children: [
                {
                  id: 'I210:185255;11098:286199;6914:505;98:46',
                  layerName: 'Shape',
                  type: 'GROUP',
                  parent: {
                    id: 'I210:185255;11098:286199;6914:505',
                    layerName: 'Size',
                    type: 'INSTANCE',
                    parent: {
                      id: 'I210:185255;11098:286199;6914:504',
                      layerName: 'alert-icon',
                      type: 'FRAME',
                      parent: {
                        id: 'I210:185255;11098:286199',
                        layerName: '_Alert-Structure',
                        type: 'INSTANCE',
                        parent: {
                          id: '210:185255',
                          layerName: 'Alert',
                          type: 'INSTANCE',
                          parent: null,
                        },
                      },
                    },
                  },
                  children: [
                    {
                      id: 'I210:185255;11098:286199;6914:505;98:47',
                      layerName: 'info',
                      type: 'INSTANCE',
                      parent: {
                        id: 'I210:185255;11098:286199;6914:505;98:46',
                        layerName: 'Shape',
                        type: 'GROUP',
                        parent: {
                          id: 'I210:185255;11098:286199;6914:505',
                          layerName: 'Size',
                          type: 'INSTANCE',
                          parent: {
                            id: 'I210:185255;11098:286199;6914:504',
                            layerName: 'alert-icon',
                            type: 'FRAME',
                            parent: {
                              id: 'I210:185255;11098:286199',
                              layerName: '_Alert-Structure',
                              type: 'INSTANCE',
                              parent: {
                                id: '210:185255',
                                layerName: 'Alert',
                                type: 'INSTANCE',
                                parent: null,
                              },
                            },
                          },
                        },
                      },
                      componentProperties: {},
                      children: [
                        {
                          id: 'I210:185255;11098:286199;6914:505;98:47;9308:64915',
                          layerName: 'info',
                          type: 'INSTANCE',
                          parent: {
                            id: 'I210:185255;11098:286199;6914:505;98:47',
                            layerName: 'info',
                            type: 'INSTANCE',
                            parent: {
                              id: 'I210:185255;11098:286199;6914:505;98:46',
                              layerName: 'Shape',
                              type: 'GROUP',
                              parent: {
                                id: 'I210:185255;11098:286199;6914:505',
                                layerName: 'Size',
                                type: 'INSTANCE',
                                parent: {
                                  id: 'I210:185255;11098:286199;6914:504',
                                  layerName: 'alert-icon',
                                  type: 'FRAME',
                                  parent: {
                                    id: 'I210:185255;11098:286199',
                                    layerName: '_Alert-Structure',
                                    type: 'INSTANCE',
                                    parent: {
                                      id: '210:185255',
                                      layerName: 'Alert',
                                      type: 'INSTANCE',
                                      parent: null,
                                    },
                                  },
                                },
                              },
                            },
                          },
                          componentProperties: {},
                          children: [
                            {
                              id: 'I210:185255;11098:286199;6914:505;98:47;9308:64915;58:543',
                              layerName: 'Union',
                              type: 'VECTOR',
                              parent: {
                                id: 'I210:185255;11098:286199;6914:505;98:47;9308:64915',
                                layerName: 'info',
                                type: 'INSTANCE',
                                parent: {
                                  id: 'I210:185255;11098:286199;6914:505;98:47',
                                  layerName: 'info',
                                  type: 'INSTANCE',
                                  parent: {
                                    id: 'I210:185255;11098:286199;6914:505;98:46',
                                    layerName: 'Shape',
                                    type: 'GROUP',
                                    parent: {
                                      id: 'I210:185255;11098:286199;6914:505',
                                      layerName: 'Size',
                                      type: 'INSTANCE',
                                      parent: {
                                        id: 'I210:185255;11098:286199;6914:504',
                                        layerName: 'alert-icon',
                                        type: 'FRAME',
                                        parent: {
                                          id: 'I210:185255;11098:286199',
                                          layerName: '_Alert-Structure',
                                          type: 'INSTANCE',
                                          parent: {
                                            id: '210:185255',
                                            layerName: 'Alert',
                                            type: 'INSTANCE',
                                            parent: null,
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          ],
                          name: 'info',
                        },
                      ],
                      name: 'info',
                    },
                  ],
                },
                {
                  id: 'I210:185255;11098:286199;6914:505;98:48',
                  layerName: 'Color',
                  type: 'RECTANGLE',
                  parent: {
                    id: 'I210:185255;11098:286199;6914:505',
                    layerName: 'Size',
                    type: 'INSTANCE',
                    parent: {
                      id: 'I210:185255;11098:286199;6914:504',
                      layerName: 'alert-icon',
                      type: 'FRAME',
                      parent: {
                        id: 'I210:185255;11098:286199',
                        layerName: '_Alert-Structure',
                        type: 'INSTANCE',
                        parent: {
                          id: '210:185255',
                          layerName: 'Alert',
                          type: 'INSTANCE',
                          parent: null,
                        },
                      },
                    },
                  },
                },
              ],
              name: 'Size',
            },
          ],
          counterAxisAlignItems: 'MIN',
          primaryAxisAlignItems: 'MIN',
          paddingTop: 2,
          paddingRight: 0,
          paddingLeft: 0,
          paddingBottom: 0,
          layoutMode: 'HORIZONTAL',
          itemSpacing: 8,
        },
        {
          id: 'I210:185255;11098:286199;13564:75289',
          layerName: 'main',
          type: 'FRAME',
          parent: {
            id: 'I210:185255;11098:286199',
            layerName: '_Alert-Structure',
            type: 'INSTANCE',
            parent: {
              id: '210:185255',
              layerName: 'Alert',
              type: 'INSTANCE',
              parent: null,
            },
          },
          children: [
            {
              id: 'I210:185255;11098:286199;6914:506',
              layerName: 'alert-body',
              type: 'FRAME',
              parent: {
                id: 'I210:185255;11098:286199;13564:75289',
                layerName: 'main',
                type: 'FRAME',
                parent: {
                  id: 'I210:185255;11098:286199',
                  layerName: '_Alert-Structure',
                  type: 'INSTANCE',
                  parent: {
                    id: '210:185255',
                    layerName: 'Alert',
                    type: 'INSTANCE',
                    parent: null,
                  },
                },
              },
              children: [
                {
                  id: 'I210:185255;11098:286199;6914:507',
                  layerName: 'content',
                  type: 'FRAME',
                  parent: {
                    id: 'I210:185255;11098:286199;6914:506',
                    layerName: 'alert-body',
                    type: 'FRAME',
                    parent: {
                      id: 'I210:185255;11098:286199;13564:75289',
                      layerName: 'main',
                      type: 'FRAME',
                      parent: {
                        id: 'I210:185255;11098:286199',
                        layerName: '_Alert-Structure',
                        type: 'INSTANCE',
                        parent: {
                          id: '210:185255',
                          layerName: 'Alert',
                          type: 'INSTANCE',
                          parent: null,
                        },
                      },
                    },
                  },
                  children: [
                    {
                      id: 'I210:185255;11098:286199;6914:508',
                      layerName: 'title',
                      type: 'TEXT',
                      parent: {
                        id: 'I210:185255;11098:286199;6914:507',
                        layerName: 'content',
                        type: 'FRAME',
                        parent: {
                          id: 'I210:185255;11098:286199;6914:506',
                          layerName: 'alert-body',
                          type: 'FRAME',
                          parent: {
                            id: 'I210:185255;11098:286199;13564:75289',
                            layerName: 'main',
                            type: 'FRAME',
                            parent: {
                              id: 'I210:185255;11098:286199',
                              layerName: '_Alert-Structure',
                              type: 'INSTANCE',
                              parent: {
                                id: '210:185255',
                                layerName: 'Alert',
                                type: 'INSTANCE',
                                parent: null,
                              },
                            },
                          },
                        },
                      },
                      characters: 'I am the alert title',
                      textStyleId: 'S:677665330fe5d039031a4f09bf4b93b721e69fb4,12837:0',
                    },
                    {
                      id: 'I210:185255;11098:286199;14264:61201',
                      layerName: 'message-holder',
                      type: 'FRAME',
                      parent: {
                        id: 'I210:185255;11098:286199;6914:507',
                        layerName: 'content',
                        type: 'FRAME',
                        parent: {
                          id: 'I210:185255;11098:286199;6914:506',
                          layerName: 'alert-body',
                          type: 'FRAME',
                          parent: {
                            id: 'I210:185255;11098:286199;13564:75289',
                            layerName: 'main',
                            type: 'FRAME',
                            parent: {
                              id: 'I210:185255;11098:286199',
                              layerName: '_Alert-Structure',
                              type: 'INSTANCE',
                              parent: {
                                id: '210:185255',
                                layerName: 'Alert',
                                type: 'INSTANCE',
                                parent: null,
                              },
                            },
                          },
                        },
                      },
                      children: [
                        {
                          id: 'I210:185255;11098:286199;6914:509',
                          layerName: 'message',
                          type: 'TEXT',
                          parent: {
                            id: 'I210:185255;11098:286199;14264:61201',
                            layerName: 'message-holder',
                            type: 'FRAME',
                            parent: {
                              id: 'I210:185255;11098:286199;6914:507',
                              layerName: 'content',
                              type: 'FRAME',
                              parent: {
                                id: 'I210:185255;11098:286199;6914:506',
                                layerName: 'alert-body',
                                type: 'FRAME',
                                parent: {
                                  id: 'I210:185255;11098:286199;13564:75289',
                                  layerName: 'main',
                                  type: 'FRAME',
                                  parent: {
                                    id: 'I210:185255;11098:286199',
                                    layerName: '_Alert-Structure',
                                    type: 'INSTANCE',
                                    parent: {
                                      id: '210:185255',
                                      layerName: 'Alert',
                                      type: 'INSTANCE',
                                      parent: null,
                                    },
                                  },
                                },
                              },
                            },
                          },
                          characters:
                            'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.',
                          textStyleId: 'S:5eb1293d503fbc90da65c6fc60d2f5f93607b898,12837:6',
                        },
                      ],
                      counterAxisAlignItems: 'MIN',
                      primaryAxisAlignItems: 'MIN',
                      paddingTop: 2,
                      paddingRight: 0,
                      paddingLeft: 0,
                      paddingBottom: 0,
                      layoutMode: 'HORIZONTAL',
                      itemSpacing: 0,
                    },
                  ],
                  counterAxisAlignItems: 'MIN',
                  primaryAxisAlignItems: 'MIN',
                  paddingTop: 0,
                  paddingRight: 0,
                  paddingLeft: 0,
                  paddingBottom: 0,
                  layoutMode: 'VERTICAL',
                  itemSpacing: 2,
                },
              ],
              counterAxisAlignItems: 'MIN',
              primaryAxisAlignItems: 'MIN',
              paddingTop: 0,
              paddingRight: 0,
              paddingLeft: 0,
              paddingBottom: 0,
              layoutMode: 'VERTICAL',
              itemSpacing: 12,
            },
          ],
          counterAxisAlignItems: 'MIN',
          primaryAxisAlignItems: 'MIN',
          paddingTop: 0,
          paddingRight: 0,
          paddingLeft: 0,
          paddingBottom: 0,
          layoutMode: 'HORIZONTAL',
          itemSpacing: 4,
        },
      ],
      name: '_Alert-Structure',
    },
  ],
  name: 'Alert',
  fills: [],
  fillStyleId: '',
  width: 0,
  height: 0,
};

export const successAlert: BladeComponentInstanceNode = {
  id: '210:185472',
  layerName: 'Alert',
  type: 'INSTANCE',
  parent: null,
  componentProperties: {
    Intent: { value: 'Positive', type: 'VARIANT' },
    isDismissible: { value: 'False', type: 'VARIANT' },
    primaryAction: { value: 'False', type: 'VARIANT' },
    secondaryAction: { value: 'False', type: 'VARIANT' },
    isFullWidth: { value: 'False', type: 'VARIANT' },
    screenSize: { value: 'Desktop', type: 'VARIANT' },
    contrast: { value: 'Low', type: 'VARIANT' },
  },
  children: [
    {
      id: 'I210:185472;11098:286151',
      layerName: '_Alert-Structure',
      type: 'INSTANCE',
      parent: {
        id: '210:185472',
        layerName: 'Alert',
        type: 'INSTANCE',
        parent: null,
      },
      componentProperties: {
        screenSize: { value: 'Large', type: 'VARIANT' },
        isFlat: { value: 'False', type: 'VARIANT' },
      },
      children: [
        {
          id: 'I210:185472;11098:286151;6914:504',
          layerName: 'alert-icon',
          type: 'FRAME',
          parent: {
            id: 'I210:185472;11098:286151',
            layerName: '_Alert-Structure',
            type: 'INSTANCE',
            parent: {
              id: '210:185472',
              layerName: 'Alert',
              type: 'INSTANCE',
              parent: null,
            },
          },
          children: [
            {
              id: 'I210:185472;11098:286151;6914:505',
              layerName: 'Size',
              type: 'INSTANCE',
              parent: {
                id: 'I210:185472;11098:286151;6914:504',
                layerName: 'alert-icon',
                type: 'FRAME',
                parent: {
                  id: 'I210:185472;11098:286151',
                  layerName: '_Alert-Structure',
                  type: 'INSTANCE',
                  parent: {
                    id: '210:185472',
                    layerName: 'Alert',
                    type: 'INSTANCE',
                    parent: null,
                  },
                },
              },
              componentProperties: {
                size: { value: 'md (16px)', type: 'VARIANT' },
              },
              children: [
                {
                  id: 'I210:185472;11098:286151;6914:505;98:46',
                  layerName: 'Shape',
                  type: 'GROUP',
                  parent: {
                    id: 'I210:185472;11098:286151;6914:505',
                    layerName: 'Size',
                    type: 'INSTANCE',
                    parent: {
                      id: 'I210:185472;11098:286151;6914:504',
                      layerName: 'alert-icon',
                      type: 'FRAME',
                      parent: {
                        id: 'I210:185472;11098:286151',
                        layerName: '_Alert-Structure',
                        type: 'INSTANCE',
                        parent: {
                          id: '210:185472',
                          layerName: 'Alert',
                          type: 'INSTANCE',
                          parent: null,
                        },
                      },
                    },
                  },
                  children: [
                    {
                      id: 'I210:185472;11098:286151;6914:505;98:47',
                      layerName: 'check-circle',
                      type: 'INSTANCE',
                      parent: {
                        id: 'I210:185472;11098:286151;6914:505;98:46',
                        layerName: 'Shape',
                        type: 'GROUP',
                        parent: {
                          id: 'I210:185472;11098:286151;6914:505',
                          layerName: 'Size',
                          type: 'INSTANCE',
                          parent: {
                            id: 'I210:185472;11098:286151;6914:504',
                            layerName: 'alert-icon',
                            type: 'FRAME',
                            parent: {
                              id: 'I210:185472;11098:286151',
                              layerName: '_Alert-Structure',
                              type: 'INSTANCE',
                              parent: {
                                id: '210:185472',
                                layerName: 'Alert',
                                type: 'INSTANCE',
                                parent: null,
                              },
                            },
                          },
                        },
                      },
                      componentProperties: {},
                      children: [
                        {
                          id: 'I210:185472;11098:286151;6914:505;98:47;9308:64861',
                          layerName: 'check-circle',
                          type: 'INSTANCE',
                          parent: {
                            id: 'I210:185472;11098:286151;6914:505;98:47',
                            layerName: 'check-circle',
                            type: 'INSTANCE',
                            parent: {
                              id: 'I210:185472;11098:286151;6914:505;98:46',
                              layerName: 'Shape',
                              type: 'GROUP',
                              parent: {
                                id: 'I210:185472;11098:286151;6914:505',
                                layerName: 'Size',
                                type: 'INSTANCE',
                                parent: {
                                  id: 'I210:185472;11098:286151;6914:504',
                                  layerName: 'alert-icon',
                                  type: 'FRAME',
                                  parent: {
                                    id: 'I210:185472;11098:286151',
                                    layerName: '_Alert-Structure',
                                    type: 'INSTANCE',
                                    parent: {
                                      id: '210:185472',
                                      layerName: 'Alert',
                                      type: 'INSTANCE',
                                      parent: null,
                                    },
                                  },
                                },
                              },
                            },
                          },
                          componentProperties: {},
                          children: [
                            {
                              id: 'I210:185472;11098:286151;6914:505;98:47;9308:64861;58:117',
                              layerName: 'Union',
                              type: 'VECTOR',
                              parent: {
                                id: 'I210:185472;11098:286151;6914:505;98:47;9308:64861',
                                layerName: 'check-circle',
                                type: 'INSTANCE',
                                parent: {
                                  id: 'I210:185472;11098:286151;6914:505;98:47',
                                  layerName: 'check-circle',
                                  type: 'INSTANCE',
                                  parent: {
                                    id: 'I210:185472;11098:286151;6914:505;98:46',
                                    layerName: 'Shape',
                                    type: 'GROUP',
                                    parent: {
                                      id: 'I210:185472;11098:286151;6914:505',
                                      layerName: 'Size',
                                      type: 'INSTANCE',
                                      parent: {
                                        id: 'I210:185472;11098:286151;6914:504',
                                        layerName: 'alert-icon',
                                        type: 'FRAME',
                                        parent: {
                                          id: 'I210:185472;11098:286151',
                                          layerName: '_Alert-Structure',
                                          type: 'INSTANCE',
                                          parent: {
                                            id: '210:185472',
                                            layerName: 'Alert',
                                            type: 'INSTANCE',
                                            parent: null,
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          ],
                          name: 'check-circle',
                        },
                      ],
                      name: 'check-circle',
                    },
                  ],
                },
                {
                  id: 'I210:185472;11098:286151;6914:505;98:48',
                  layerName: 'Color',
                  type: 'RECTANGLE',
                  parent: {
                    id: 'I210:185472;11098:286151;6914:505',
                    layerName: 'Size',
                    type: 'INSTANCE',
                    parent: {
                      id: 'I210:185472;11098:286151;6914:504',
                      layerName: 'alert-icon',
                      type: 'FRAME',
                      parent: {
                        id: 'I210:185472;11098:286151',
                        layerName: '_Alert-Structure',
                        type: 'INSTANCE',
                        parent: {
                          id: '210:185472',
                          layerName: 'Alert',
                          type: 'INSTANCE',
                          parent: null,
                        },
                      },
                    },
                  },
                },
              ],
              name: 'Size',
            },
          ],
          counterAxisAlignItems: 'MIN',
          primaryAxisAlignItems: 'MIN',
          paddingTop: 2,
          paddingRight: 0,
          paddingLeft: 0,
          paddingBottom: 0,
          layoutMode: 'HORIZONTAL',
          itemSpacing: 8,
        },
        {
          id: 'I210:185472;11098:286151;13564:75289',
          layerName: 'main',
          type: 'FRAME',
          parent: {
            id: 'I210:185472;11098:286151',
            layerName: '_Alert-Structure',
            type: 'INSTANCE',
            parent: {
              id: '210:185472',
              layerName: 'Alert',
              type: 'INSTANCE',
              parent: null,
            },
          },
          children: [
            {
              id: 'I210:185472;11098:286151;6914:506',
              layerName: 'alert-body',
              type: 'FRAME',
              parent: {
                id: 'I210:185472;11098:286151;13564:75289',
                layerName: 'main',
                type: 'FRAME',
                parent: {
                  id: 'I210:185472;11098:286151',
                  layerName: '_Alert-Structure',
                  type: 'INSTANCE',
                  parent: {
                    id: '210:185472',
                    layerName: 'Alert',
                    type: 'INSTANCE',
                    parent: null,
                  },
                },
              },
              children: [
                {
                  id: 'I210:185472;11098:286151;6914:507',
                  layerName: 'content',
                  type: 'FRAME',
                  parent: {
                    id: 'I210:185472;11098:286151;6914:506',
                    layerName: 'alert-body',
                    type: 'FRAME',
                    parent: {
                      id: 'I210:185472;11098:286151;13564:75289',
                      layerName: 'main',
                      type: 'FRAME',
                      parent: {
                        id: 'I210:185472;11098:286151',
                        layerName: '_Alert-Structure',
                        type: 'INSTANCE',
                        parent: {
                          id: '210:185472',
                          layerName: 'Alert',
                          type: 'INSTANCE',
                          parent: null,
                        },
                      },
                    },
                  },
                  children: [
                    {
                      id: 'I210:185472;11098:286151;6914:508',
                      layerName: 'title',
                      type: 'TEXT',
                      parent: {
                        id: 'I210:185472;11098:286151;6914:507',
                        layerName: 'content',
                        type: 'FRAME',
                        parent: {
                          id: 'I210:185472;11098:286151;6914:506',
                          layerName: 'alert-body',
                          type: 'FRAME',
                          parent: {
                            id: 'I210:185472;11098:286151;13564:75289',
                            layerName: 'main',
                            type: 'FRAME',
                            parent: {
                              id: 'I210:185472;11098:286151',
                              layerName: '_Alert-Structure',
                              type: 'INSTANCE',
                              parent: {
                                id: '210:185472',
                                layerName: 'Alert',
                                type: 'INSTANCE',
                                parent: null,
                              },
                            },
                          },
                        },
                      },
                      characters: 'I am the alert title',
                      textStyleId: 'S:677665330fe5d039031a4f09bf4b93b721e69fb4,12837:0',
                    },
                    {
                      id: 'I210:185472;11098:286151;14264:61201',
                      layerName: 'message-holder',
                      type: 'FRAME',
                      parent: {
                        id: 'I210:185472;11098:286151;6914:507',
                        layerName: 'content',
                        type: 'FRAME',
                        parent: {
                          id: 'I210:185472;11098:286151;6914:506',
                          layerName: 'alert-body',
                          type: 'FRAME',
                          parent: {
                            id: 'I210:185472;11098:286151;13564:75289',
                            layerName: 'main',
                            type: 'FRAME',
                            parent: {
                              id: 'I210:185472;11098:286151',
                              layerName: '_Alert-Structure',
                              type: 'INSTANCE',
                              parent: {
                                id: '210:185472',
                                layerName: 'Alert',
                                type: 'INSTANCE',
                                parent: null,
                              },
                            },
                          },
                        },
                      },
                      children: [
                        {
                          id: 'I210:185472;11098:286151;6914:509',
                          layerName: 'message',
                          type: 'TEXT',
                          parent: {
                            id: 'I210:185472;11098:286151;14264:61201',
                            layerName: 'message-holder',
                            type: 'FRAME',
                            parent: {
                              id: 'I210:185472;11098:286151;6914:507',
                              layerName: 'content',
                              type: 'FRAME',
                              parent: {
                                id: 'I210:185472;11098:286151;6914:506',
                                layerName: 'alert-body',
                                type: 'FRAME',
                                parent: {
                                  id: 'I210:185472;11098:286151;13564:75289',
                                  layerName: 'main',
                                  type: 'FRAME',
                                  parent: {
                                    id: 'I210:185472;11098:286151',
                                    layerName: '_Alert-Structure',
                                    type: 'INSTANCE',
                                    parent: {
                                      id: '210:185472',
                                      layerName: 'Alert',
                                      type: 'INSTANCE',
                                      parent: null,
                                    },
                                  },
                                },
                              },
                            },
                          },
                          characters:
                            'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.',
                          textStyleId: 'S:5eb1293d503fbc90da65c6fc60d2f5f93607b898,12837:6',
                        },
                      ],
                      counterAxisAlignItems: 'MIN',
                      primaryAxisAlignItems: 'MIN',
                      paddingTop: 2,
                      paddingRight: 0,
                      paddingLeft: 0,
                      paddingBottom: 0,
                      layoutMode: 'HORIZONTAL',
                      itemSpacing: 0,
                    },
                  ],
                  counterAxisAlignItems: 'MIN',
                  primaryAxisAlignItems: 'MIN',
                  paddingTop: 0,
                  paddingRight: 0,
                  paddingLeft: 0,
                  paddingBottom: 0,
                  layoutMode: 'VERTICAL',
                  itemSpacing: 2,
                },
              ],
              counterAxisAlignItems: 'MIN',
              primaryAxisAlignItems: 'MIN',
              paddingTop: 0,
              paddingRight: 0,
              paddingLeft: 0,
              paddingBottom: 0,
              layoutMode: 'VERTICAL',
              itemSpacing: 12,
            },
          ],
          counterAxisAlignItems: 'MIN',
          primaryAxisAlignItems: 'MIN',
          paddingTop: 0,
          paddingRight: 0,
          paddingLeft: 0,
          paddingBottom: 0,
          layoutMode: 'HORIZONTAL',
          itemSpacing: 4,
        },
      ],
      name: '_Alert-Structure',
    },
  ],
  name: 'Alert',
  fills: [],
  fillStyleId: '',
  width: 0,
  height: 0,
};

export const neutralAlert: BladeComponentInstanceNode = {
  id: '210:185527',
  layerName: 'Alert',
  type: 'INSTANCE',
  parent: null,
  componentProperties: {
    Intent: { value: 'Neutral', type: 'VARIANT' },
    isDismissible: { value: 'False', type: 'VARIANT' },
    primaryAction: { value: 'False', type: 'VARIANT' },
    secondaryAction: { value: 'False', type: 'VARIANT' },
    isFullWidth: { value: 'False', type: 'VARIANT' },
    screenSize: { value: 'Desktop', type: 'VARIANT' },
    contrast: { value: 'Low', type: 'VARIANT' },
  },
  children: [
    {
      id: 'I210:185527;12497:405646',
      layerName: '_Alert-Structure',
      type: 'INSTANCE',
      parent: {
        id: '210:185527',
        layerName: 'Alert',
        type: 'INSTANCE',
        parent: null,
      },
      componentProperties: {
        screenSize: { value: 'Large', type: 'VARIANT' },
        isFlat: { value: 'False', type: 'VARIANT' },
      },
      children: [
        {
          id: 'I210:185527;12497:405646;6914:504',
          layerName: 'alert-icon',
          type: 'FRAME',
          parent: {
            id: 'I210:185527;12497:405646',
            layerName: '_Alert-Structure',
            type: 'INSTANCE',
            parent: {
              id: '210:185527',
              layerName: 'Alert',
              type: 'INSTANCE',
              parent: null,
            },
          },
          children: [
            {
              id: 'I210:185527;12497:405646;6914:505',
              layerName: 'Size',
              type: 'INSTANCE',
              parent: {
                id: 'I210:185527;12497:405646;6914:504',
                layerName: 'alert-icon',
                type: 'FRAME',
                parent: {
                  id: 'I210:185527;12497:405646',
                  layerName: '_Alert-Structure',
                  type: 'INSTANCE',
                  parent: {
                    id: '210:185527',
                    layerName: 'Alert',
                    type: 'INSTANCE',
                    parent: null,
                  },
                },
              },
              componentProperties: {
                size: { value: 'md (16px)', type: 'VARIANT' },
              },
              children: [
                {
                  id: 'I210:185527;12497:405646;6914:505;98:46',
                  layerName: 'Shape',
                  type: 'GROUP',
                  parent: {
                    id: 'I210:185527;12497:405646;6914:505',
                    layerName: 'Size',
                    type: 'INSTANCE',
                    parent: {
                      id: 'I210:185527;12497:405646;6914:504',
                      layerName: 'alert-icon',
                      type: 'FRAME',
                      parent: {
                        id: 'I210:185527;12497:405646',
                        layerName: '_Alert-Structure',
                        type: 'INSTANCE',
                        parent: {
                          id: '210:185527',
                          layerName: 'Alert',
                          type: 'INSTANCE',
                          parent: null,
                        },
                      },
                    },
                  },
                  children: [
                    {
                      id: 'I210:185527;12497:405646;6914:505;98:47',
                      layerName: 'info',
                      type: 'INSTANCE',
                      parent: {
                        id: 'I210:185527;12497:405646;6914:505;98:46',
                        layerName: 'Shape',
                        type: 'GROUP',
                        parent: {
                          id: 'I210:185527;12497:405646;6914:505',
                          layerName: 'Size',
                          type: 'INSTANCE',
                          parent: {
                            id: 'I210:185527;12497:405646;6914:504',
                            layerName: 'alert-icon',
                            type: 'FRAME',
                            parent: {
                              id: 'I210:185527;12497:405646',
                              layerName: '_Alert-Structure',
                              type: 'INSTANCE',
                              parent: {
                                id: '210:185527',
                                layerName: 'Alert',
                                type: 'INSTANCE',
                                parent: null,
                              },
                            },
                          },
                        },
                      },
                      componentProperties: {},
                      children: [
                        {
                          id: 'I210:185527;12497:405646;6914:505;98:47;9308:64915',
                          layerName: 'info',
                          type: 'INSTANCE',
                          parent: {
                            id: 'I210:185527;12497:405646;6914:505;98:47',
                            layerName: 'info',
                            type: 'INSTANCE',
                            parent: {
                              id: 'I210:185527;12497:405646;6914:505;98:46',
                              layerName: 'Shape',
                              type: 'GROUP',
                              parent: {
                                id: 'I210:185527;12497:405646;6914:505',
                                layerName: 'Size',
                                type: 'INSTANCE',
                                parent: {
                                  id: 'I210:185527;12497:405646;6914:504',
                                  layerName: 'alert-icon',
                                  type: 'FRAME',
                                  parent: {
                                    id: 'I210:185527;12497:405646',
                                    layerName: '_Alert-Structure',
                                    type: 'INSTANCE',
                                    parent: {
                                      id: '210:185527',
                                      layerName: 'Alert',
                                      type: 'INSTANCE',
                                      parent: null,
                                    },
                                  },
                                },
                              },
                            },
                          },
                          componentProperties: {},
                          children: [
                            {
                              id: 'I210:185527;12497:405646;6914:505;98:47;9308:64915;58:543',
                              layerName: 'Union',
                              type: 'VECTOR',
                              parent: {
                                id: 'I210:185527;12497:405646;6914:505;98:47;9308:64915',
                                layerName: 'info',
                                type: 'INSTANCE',
                                parent: {
                                  id: 'I210:185527;12497:405646;6914:505;98:47',
                                  layerName: 'info',
                                  type: 'INSTANCE',
                                  parent: {
                                    id: 'I210:185527;12497:405646;6914:505;98:46',
                                    layerName: 'Shape',
                                    type: 'GROUP',
                                    parent: {
                                      id: 'I210:185527;12497:405646;6914:505',
                                      layerName: 'Size',
                                      type: 'INSTANCE',
                                      parent: {
                                        id: 'I210:185527;12497:405646;6914:504',
                                        layerName: 'alert-icon',
                                        type: 'FRAME',
                                        parent: {
                                          id: 'I210:185527;12497:405646',
                                          layerName: '_Alert-Structure',
                                          type: 'INSTANCE',
                                          parent: {
                                            id: '210:185527',
                                            layerName: 'Alert',
                                            type: 'INSTANCE',
                                            parent: null,
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          ],
                          name: 'info',
                        },
                      ],
                      name: 'info',
                    },
                  ],
                },
                {
                  id: 'I210:185527;12497:405646;6914:505;98:48',
                  layerName: 'Color',
                  type: 'RECTANGLE',
                  parent: {
                    id: 'I210:185527;12497:405646;6914:505',
                    layerName: 'Size',
                    type: 'INSTANCE',
                    parent: {
                      id: 'I210:185527;12497:405646;6914:504',
                      layerName: 'alert-icon',
                      type: 'FRAME',
                      parent: {
                        id: 'I210:185527;12497:405646',
                        layerName: '_Alert-Structure',
                        type: 'INSTANCE',
                        parent: {
                          id: '210:185527',
                          layerName: 'Alert',
                          type: 'INSTANCE',
                          parent: null,
                        },
                      },
                    },
                  },
                },
              ],
              name: 'Size',
            },
          ],
          counterAxisAlignItems: 'MIN',
          primaryAxisAlignItems: 'MIN',
          paddingTop: 2,
          paddingRight: 0,
          paddingLeft: 0,
          paddingBottom: 0,
          layoutMode: 'HORIZONTAL',
          itemSpacing: 8,
        },
        {
          id: 'I210:185527;12497:405646;13564:75289',
          layerName: 'main',
          type: 'FRAME',
          parent: {
            id: 'I210:185527;12497:405646',
            layerName: '_Alert-Structure',
            type: 'INSTANCE',
            parent: {
              id: '210:185527',
              layerName: 'Alert',
              type: 'INSTANCE',
              parent: null,
            },
          },
          children: [
            {
              id: 'I210:185527;12497:405646;6914:506',
              layerName: 'alert-body',
              type: 'FRAME',
              parent: {
                id: 'I210:185527;12497:405646;13564:75289',
                layerName: 'main',
                type: 'FRAME',
                parent: {
                  id: 'I210:185527;12497:405646',
                  layerName: '_Alert-Structure',
                  type: 'INSTANCE',
                  parent: {
                    id: '210:185527',
                    layerName: 'Alert',
                    type: 'INSTANCE',
                    parent: null,
                  },
                },
              },
              children: [
                {
                  id: 'I210:185527;12497:405646;6914:507',
                  layerName: 'content',
                  type: 'FRAME',
                  parent: {
                    id: 'I210:185527;12497:405646;6914:506',
                    layerName: 'alert-body',
                    type: 'FRAME',
                    parent: {
                      id: 'I210:185527;12497:405646;13564:75289',
                      layerName: 'main',
                      type: 'FRAME',
                      parent: {
                        id: 'I210:185527;12497:405646',
                        layerName: '_Alert-Structure',
                        type: 'INSTANCE',
                        parent: {
                          id: '210:185527',
                          layerName: 'Alert',
                          type: 'INSTANCE',
                          parent: null,
                        },
                      },
                    },
                  },
                  children: [
                    {
                      id: 'I210:185527;12497:405646;6914:508',
                      layerName: 'title',
                      type: 'TEXT',
                      parent: {
                        id: 'I210:185527;12497:405646;6914:507',
                        layerName: 'content',
                        type: 'FRAME',
                        parent: {
                          id: 'I210:185527;12497:405646;6914:506',
                          layerName: 'alert-body',
                          type: 'FRAME',
                          parent: {
                            id: 'I210:185527;12497:405646;13564:75289',
                            layerName: 'main',
                            type: 'FRAME',
                            parent: {
                              id: 'I210:185527;12497:405646',
                              layerName: '_Alert-Structure',
                              type: 'INSTANCE',
                              parent: {
                                id: '210:185527',
                                layerName: 'Alert',
                                type: 'INSTANCE',
                                parent: null,
                              },
                            },
                          },
                        },
                      },
                      characters: 'I am the alert title',
                      textStyleId: 'S:677665330fe5d039031a4f09bf4b93b721e69fb4,12837:0',
                    },
                    {
                      id: 'I210:185527;12497:405646;14264:61201',
                      layerName: 'message-holder',
                      type: 'FRAME',
                      parent: {
                        id: 'I210:185527;12497:405646;6914:507',
                        layerName: 'content',
                        type: 'FRAME',
                        parent: {
                          id: 'I210:185527;12497:405646;6914:506',
                          layerName: 'alert-body',
                          type: 'FRAME',
                          parent: {
                            id: 'I210:185527;12497:405646;13564:75289',
                            layerName: 'main',
                            type: 'FRAME',
                            parent: {
                              id: 'I210:185527;12497:405646',
                              layerName: '_Alert-Structure',
                              type: 'INSTANCE',
                              parent: {
                                id: '210:185527',
                                layerName: 'Alert',
                                type: 'INSTANCE',
                                parent: null,
                              },
                            },
                          },
                        },
                      },
                      children: [
                        {
                          id: 'I210:185527;12497:405646;6914:509',
                          layerName: 'message',
                          type: 'TEXT',
                          parent: {
                            id: 'I210:185527;12497:405646;14264:61201',
                            layerName: 'message-holder',
                            type: 'FRAME',
                            parent: {
                              id: 'I210:185527;12497:405646;6914:507',
                              layerName: 'content',
                              type: 'FRAME',
                              parent: {
                                id: 'I210:185527;12497:405646;6914:506',
                                layerName: 'alert-body',
                                type: 'FRAME',
                                parent: {
                                  id: 'I210:185527;12497:405646;13564:75289',
                                  layerName: 'main',
                                  type: 'FRAME',
                                  parent: {
                                    id: 'I210:185527;12497:405646',
                                    layerName: '_Alert-Structure',
                                    type: 'INSTANCE',
                                    parent: {
                                      id: '210:185527',
                                      layerName: 'Alert',
                                      type: 'INSTANCE',
                                      parent: null,
                                    },
                                  },
                                },
                              },
                            },
                          },
                          characters:
                            'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.',
                          textStyleId: 'S:5eb1293d503fbc90da65c6fc60d2f5f93607b898,12837:6',
                        },
                      ],
                      counterAxisAlignItems: 'MIN',
                      primaryAxisAlignItems: 'MIN',
                      paddingTop: 2,
                      paddingRight: 0,
                      paddingLeft: 0,
                      paddingBottom: 0,
                      layoutMode: 'HORIZONTAL',
                      itemSpacing: 0,
                    },
                  ],
                  counterAxisAlignItems: 'MIN',
                  primaryAxisAlignItems: 'MIN',
                  paddingTop: 0,
                  paddingRight: 0,
                  paddingLeft: 0,
                  paddingBottom: 0,
                  layoutMode: 'VERTICAL',
                  itemSpacing: 2,
                },
              ],
              counterAxisAlignItems: 'MIN',
              primaryAxisAlignItems: 'MIN',
              paddingTop: 0,
              paddingRight: 0,
              paddingLeft: 0,
              paddingBottom: 0,
              layoutMode: 'VERTICAL',
              itemSpacing: 12,
            },
          ],
          counterAxisAlignItems: 'MIN',
          primaryAxisAlignItems: 'MIN',
          paddingTop: 0,
          paddingRight: 0,
          paddingLeft: 0,
          paddingBottom: 0,
          layoutMode: 'HORIZONTAL',
          itemSpacing: 4,
        },
      ],
      name: '_Alert-Structure',
    },
  ],
  name: 'Alert',
  fills: [],
  fillStyleId: '',
  width: 0,
  height: 0,
};

export const dangerAlert: BladeComponentInstanceNode = {
  id: '210:185804',
  layerName: 'Alert',
  type: 'INSTANCE',
  parent: null,
  componentProperties: {
    Intent: { value: 'Negative', type: 'VARIANT' },
    isDismissible: { value: 'False', type: 'VARIANT' },
    primaryAction: { value: 'True', type: 'VARIANT' },
    secondaryAction: { value: 'True', type: 'VARIANT' },
    isFullWidth: { value: 'False', type: 'VARIANT' },
    screenSize: { value: 'Desktop', type: 'VARIANT' },
    contrast: { value: 'Low', type: 'VARIANT' },
  },
  children: [
    {
      id: 'I210:185804;11098:286183',
      layerName: '_Alert-Structure',
      type: 'INSTANCE',
      parent: {
        id: '210:185804',
        layerName: 'Alert',
        type: 'INSTANCE',
        parent: null,
      },
      componentProperties: {
        screenSize: { value: 'Large', type: 'VARIANT' },
        isFlat: { value: 'False', type: 'VARIANT' },
      },
      children: [
        {
          id: 'I210:185804;11098:286183;6914:504',
          layerName: 'alert-icon',
          type: 'FRAME',
          parent: {
            id: 'I210:185804;11098:286183',
            layerName: '_Alert-Structure',
            type: 'INSTANCE',
            parent: {
              id: '210:185804',
              layerName: 'Alert',
              type: 'INSTANCE',
              parent: null,
            },
          },
          children: [
            {
              id: 'I210:185804;11098:286183;6914:505',
              layerName: 'Size',
              type: 'INSTANCE',
              parent: {
                id: 'I210:185804;11098:286183;6914:504',
                layerName: 'alert-icon',
                type: 'FRAME',
                parent: {
                  id: 'I210:185804;11098:286183',
                  layerName: '_Alert-Structure',
                  type: 'INSTANCE',
                  parent: {
                    id: '210:185804',
                    layerName: 'Alert',
                    type: 'INSTANCE',
                    parent: null,
                  },
                },
              },
              componentProperties: {
                size: { value: 'md (16px)', type: 'VARIANT' },
              },
              children: [
                {
                  id: 'I210:185804;11098:286183;6914:505;98:46',
                  layerName: 'Shape',
                  type: 'GROUP',
                  parent: {
                    id: 'I210:185804;11098:286183;6914:505',
                    layerName: 'Size',
                    type: 'INSTANCE',
                    parent: {
                      id: 'I210:185804;11098:286183;6914:504',
                      layerName: 'alert-icon',
                      type: 'FRAME',
                      parent: {
                        id: 'I210:185804;11098:286183',
                        layerName: '_Alert-Structure',
                        type: 'INSTANCE',
                        parent: {
                          id: '210:185804',
                          layerName: 'Alert',
                          type: 'INSTANCE',
                          parent: null,
                        },
                      },
                    },
                  },
                  children: [
                    {
                      id: 'I210:185804;11098:286183;6914:505;98:47',
                      layerName: 'alert-octagon',
                      type: 'INSTANCE',
                      parent: {
                        id: 'I210:185804;11098:286183;6914:505;98:46',
                        layerName: 'Shape',
                        type: 'GROUP',
                        parent: {
                          id: 'I210:185804;11098:286183;6914:505',
                          layerName: 'Size',
                          type: 'INSTANCE',
                          parent: {
                            id: 'I210:185804;11098:286183;6914:504',
                            layerName: 'alert-icon',
                            type: 'FRAME',
                            parent: {
                              id: 'I210:185804;11098:286183',
                              layerName: '_Alert-Structure',
                              type: 'INSTANCE',
                              parent: {
                                id: '210:185804',
                                layerName: 'Alert',
                                type: 'INSTANCE',
                                parent: null,
                              },
                            },
                          },
                        },
                      },
                      componentProperties: {},
                      children: [
                        {
                          id: 'I210:185804;11098:286183;6914:505;98:47;9308:64845',
                          layerName: 'alert-octagon',
                          type: 'INSTANCE',
                          parent: {
                            id: 'I210:185804;11098:286183;6914:505;98:47',
                            layerName: 'alert-octagon',
                            type: 'INSTANCE',
                            parent: {
                              id: 'I210:185804;11098:286183;6914:505;98:46',
                              layerName: 'Shape',
                              type: 'GROUP',
                              parent: {
                                id: 'I210:185804;11098:286183;6914:505',
                                layerName: 'Size',
                                type: 'INSTANCE',
                                parent: {
                                  id: 'I210:185804;11098:286183;6914:504',
                                  layerName: 'alert-icon',
                                  type: 'FRAME',
                                  parent: {
                                    id: 'I210:185804;11098:286183',
                                    layerName: '_Alert-Structure',
                                    type: 'INSTANCE',
                                    parent: {
                                      id: '210:185804',
                                      layerName: 'Alert',
                                      type: 'INSTANCE',
                                      parent: null,
                                    },
                                  },
                                },
                              },
                            },
                          },
                          componentProperties: {},
                          children: [
                            {
                              id: 'I210:185804;11098:286183;6914:505;98:47;9308:64845;58:39',
                              layerName: 'Union',
                              type: 'VECTOR',
                              parent: {
                                id: 'I210:185804;11098:286183;6914:505;98:47;9308:64845',
                                layerName: 'alert-octagon',
                                type: 'INSTANCE',
                                parent: {
                                  id: 'I210:185804;11098:286183;6914:505;98:47',
                                  layerName: 'alert-octagon',
                                  type: 'INSTANCE',
                                  parent: {
                                    id: 'I210:185804;11098:286183;6914:505;98:46',
                                    layerName: 'Shape',
                                    type: 'GROUP',
                                    parent: {
                                      id: 'I210:185804;11098:286183;6914:505',
                                      layerName: 'Size',
                                      type: 'INSTANCE',
                                      parent: {
                                        id: 'I210:185804;11098:286183;6914:504',
                                        layerName: 'alert-icon',
                                        type: 'FRAME',
                                        parent: {
                                          id: 'I210:185804;11098:286183',
                                          layerName: '_Alert-Structure',
                                          type: 'INSTANCE',
                                          parent: {
                                            id: '210:185804',
                                            layerName: 'Alert',
                                            type: 'INSTANCE',
                                            parent: null,
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          ],
                          name: 'alert-octagon',
                        },
                      ],
                      name: 'alert-octagon',
                    },
                  ],
                },
                {
                  id: 'I210:185804;11098:286183;6914:505;98:48',
                  layerName: 'Color',
                  type: 'RECTANGLE',
                  parent: {
                    id: 'I210:185804;11098:286183;6914:505',
                    layerName: 'Size',
                    type: 'INSTANCE',
                    parent: {
                      id: 'I210:185804;11098:286183;6914:504',
                      layerName: 'alert-icon',
                      type: 'FRAME',
                      parent: {
                        id: 'I210:185804;11098:286183',
                        layerName: '_Alert-Structure',
                        type: 'INSTANCE',
                        parent: {
                          id: '210:185804',
                          layerName: 'Alert',
                          type: 'INSTANCE',
                          parent: null,
                        },
                      },
                    },
                  },
                },
              ],
              name: 'Size',
            },
          ],
          counterAxisAlignItems: 'MIN',
          primaryAxisAlignItems: 'MIN',
          paddingTop: 2,
          paddingRight: 0,
          paddingLeft: 0,
          paddingBottom: 0,
          layoutMode: 'HORIZONTAL',
          itemSpacing: 8,
        },
        {
          id: 'I210:185804;11098:286183;13564:75289',
          layerName: 'main',
          type: 'FRAME',
          parent: {
            id: 'I210:185804;11098:286183',
            layerName: '_Alert-Structure',
            type: 'INSTANCE',
            parent: {
              id: '210:185804',
              layerName: 'Alert',
              type: 'INSTANCE',
              parent: null,
            },
          },
          children: [
            {
              id: 'I210:185804;11098:286183;6914:506',
              layerName: 'alert-body',
              type: 'FRAME',
              parent: {
                id: 'I210:185804;11098:286183;13564:75289',
                layerName: 'main',
                type: 'FRAME',
                parent: {
                  id: 'I210:185804;11098:286183',
                  layerName: '_Alert-Structure',
                  type: 'INSTANCE',
                  parent: {
                    id: '210:185804',
                    layerName: 'Alert',
                    type: 'INSTANCE',
                    parent: null,
                  },
                },
              },
              children: [
                {
                  id: 'I210:185804;11098:286183;6914:507',
                  layerName: 'content',
                  type: 'FRAME',
                  parent: {
                    id: 'I210:185804;11098:286183;6914:506',
                    layerName: 'alert-body',
                    type: 'FRAME',
                    parent: {
                      id: 'I210:185804;11098:286183;13564:75289',
                      layerName: 'main',
                      type: 'FRAME',
                      parent: {
                        id: 'I210:185804;11098:286183',
                        layerName: '_Alert-Structure',
                        type: 'INSTANCE',
                        parent: {
                          id: '210:185804',
                          layerName: 'Alert',
                          type: 'INSTANCE',
                          parent: null,
                        },
                      },
                    },
                  },
                  children: [
                    {
                      id: 'I210:185804;11098:286183;6914:508',
                      layerName: 'title',
                      type: 'TEXT',
                      parent: {
                        id: 'I210:185804;11098:286183;6914:507',
                        layerName: 'content',
                        type: 'FRAME',
                        parent: {
                          id: 'I210:185804;11098:286183;6914:506',
                          layerName: 'alert-body',
                          type: 'FRAME',
                          parent: {
                            id: 'I210:185804;11098:286183;13564:75289',
                            layerName: 'main',
                            type: 'FRAME',
                            parent: {
                              id: 'I210:185804;11098:286183',
                              layerName: '_Alert-Structure',
                              type: 'INSTANCE',
                              parent: {
                                id: '210:185804',
                                layerName: 'Alert',
                                type: 'INSTANCE',
                                parent: null,
                              },
                            },
                          },
                        },
                      },
                      characters: 'I am the alert title',
                      textStyleId: 'S:677665330fe5d039031a4f09bf4b93b721e69fb4,12837:0',
                    },
                    {
                      id: 'I210:185804;11098:286183;14264:61201',
                      layerName: 'message-holder',
                      type: 'FRAME',
                      parent: {
                        id: 'I210:185804;11098:286183;6914:507',
                        layerName: 'content',
                        type: 'FRAME',
                        parent: {
                          id: 'I210:185804;11098:286183;6914:506',
                          layerName: 'alert-body',
                          type: 'FRAME',
                          parent: {
                            id: 'I210:185804;11098:286183;13564:75289',
                            layerName: 'main',
                            type: 'FRAME',
                            parent: {
                              id: 'I210:185804;11098:286183',
                              layerName: '_Alert-Structure',
                              type: 'INSTANCE',
                              parent: {
                                id: '210:185804',
                                layerName: 'Alert',
                                type: 'INSTANCE',
                                parent: null,
                              },
                            },
                          },
                        },
                      },
                      children: [
                        {
                          id: 'I210:185804;11098:286183;6914:509',
                          layerName: 'message',
                          type: 'TEXT',
                          parent: {
                            id: 'I210:185804;11098:286183;14264:61201',
                            layerName: 'message-holder',
                            type: 'FRAME',
                            parent: {
                              id: 'I210:185804;11098:286183;6914:507',
                              layerName: 'content',
                              type: 'FRAME',
                              parent: {
                                id: 'I210:185804;11098:286183;6914:506',
                                layerName: 'alert-body',
                                type: 'FRAME',
                                parent: {
                                  id: 'I210:185804;11098:286183;13564:75289',
                                  layerName: 'main',
                                  type: 'FRAME',
                                  parent: {
                                    id: 'I210:185804;11098:286183',
                                    layerName: '_Alert-Structure',
                                    type: 'INSTANCE',
                                    parent: {
                                      id: '210:185804',
                                      layerName: 'Alert',
                                      type: 'INSTANCE',
                                      parent: null,
                                    },
                                  },
                                },
                              },
                            },
                          },
                          characters:
                            'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.',
                          textStyleId: 'S:5eb1293d503fbc90da65c6fc60d2f5f93607b898,12837:6',
                        },
                      ],
                      counterAxisAlignItems: 'MIN',
                      primaryAxisAlignItems: 'MIN',
                      paddingTop: 2,
                      paddingRight: 0,
                      paddingLeft: 0,
                      paddingBottom: 0,
                      layoutMode: 'HORIZONTAL',
                      itemSpacing: 0,
                    },
                  ],
                  counterAxisAlignItems: 'MIN',
                  primaryAxisAlignItems: 'MIN',
                  paddingTop: 0,
                  paddingRight: 0,
                  paddingLeft: 0,
                  paddingBottom: 0,
                  layoutMode: 'VERTICAL',
                  itemSpacing: 2,
                },
                {
                  id: 'I210:185804;11098:286183;10554:85571',
                  layerName: 'actions',
                  type: 'FRAME',
                  parent: {
                    id: 'I210:185804;11098:286183;6914:506',
                    layerName: 'alert-body',
                    type: 'FRAME',
                    parent: {
                      id: 'I210:185804;11098:286183;13564:75289',
                      layerName: 'main',
                      type: 'FRAME',
                      parent: {
                        id: 'I210:185804;11098:286183',
                        layerName: '_Alert-Structure',
                        type: 'INSTANCE',
                        parent: {
                          id: '210:185804',
                          layerName: 'Alert',
                          type: 'INSTANCE',
                          parent: null,
                        },
                      },
                    },
                  },
                  children: [
                    {
                      id: 'I210:185804;11098:286183;10554:85572',
                      layerName: 'Primary Action',
                      type: 'INSTANCE',
                      parent: {
                        id: 'I210:185804;11098:286183;10554:85571',
                        layerName: 'actions',
                        type: 'FRAME',
                        parent: {
                          id: 'I210:185804;11098:286183;6914:506',
                          layerName: 'alert-body',
                          type: 'FRAME',
                          parent: {
                            id: 'I210:185804;11098:286183;13564:75289',
                            layerName: 'main',
                            type: 'FRAME',
                            parent: {
                              id: 'I210:185804;11098:286183',
                              layerName: '_Alert-Structure',
                              type: 'INSTANCE',
                              parent: {
                                id: '210:185804',
                                layerName: 'Alert',
                                type: 'INSTANCE',
                                parent: null,
                              },
                            },
                          },
                        },
                      },
                      componentProperties: {
                        type: { value: 'Primary', type: 'VARIANT' },
                        size: { value: 'Small', type: 'VARIANT' },
                        intent: { value: 'Negative', type: 'VARIANT' },
                        screenSize: { value: 'Desktop', type: 'VARIANT' },
                        contrast: { value: 'Low', type: 'VARIANT' },
                      },
                      children: [
                        {
                          id: 'I210:185804;11098:286183;10554:85572;12497:400294',
                          layerName: '_CButton',
                          type: 'INSTANCE',
                          parent: {
                            id: 'I210:185804;11098:286183;10554:85572',
                            layerName: 'Primary Action',
                            type: 'INSTANCE',
                            parent: {
                              id: 'I210:185804;11098:286183;10554:85571',
                              layerName: 'actions',
                              type: 'FRAME',
                              parent: {
                                id: 'I210:185804;11098:286183;6914:506',
                                layerName: 'alert-body',
                                type: 'FRAME',
                                parent: {
                                  id: 'I210:185804;11098:286183;13564:75289',
                                  layerName: 'main',
                                  type: 'FRAME',
                                  parent: {
                                    id: 'I210:185804;11098:286183',
                                    layerName: '_Alert-Structure',
                                    type: 'INSTANCE',
                                    parent: {
                                      id: '210:185804',
                                      layerName: 'Alert',
                                      type: 'INSTANCE',
                                      parent: null,
                                    },
                                  },
                                },
                              },
                            },
                          },
                          componentProperties: {
                            Intent: { value: 'Negative', type: 'VARIANT' },
                            Size: { value: 'Small', type: 'VARIANT' },
                            State: { value: 'Default', type: 'VARIANT' },
                            Container: {
                              value: 'Text (Only)',
                              type: 'VARIANT',
                            },
                            screenSize: { value: 'Desktop', type: 'VARIANT' },
                            Contrast: { value: 'Low', type: 'VARIANT' },
                          },
                          children: [
                            {
                              id: 'I210:185804;11098:286183;10554:85572;12497:400294;12487:320646',
                              layerName: 'ActionsBase',
                              type: 'INSTANCE',
                              parent: {
                                id: 'I210:185804;11098:286183;10554:85572;12497:400294',
                                layerName: '_CButton',
                                type: 'INSTANCE',
                                parent: {
                                  id: 'I210:185804;11098:286183;10554:85572',
                                  layerName: 'Primary Action',
                                  type: 'INSTANCE',
                                  parent: {
                                    id: 'I210:185804;11098:286183;10554:85571',
                                    layerName: 'actions',
                                    type: 'FRAME',
                                    parent: {
                                      id: 'I210:185804;11098:286183;6914:506',
                                      layerName: 'alert-body',
                                      type: 'FRAME',
                                      parent: {
                                        id: 'I210:185804;11098:286183;13564:75289',
                                        layerName: 'main',
                                        type: 'FRAME',
                                        parent: {
                                          id: 'I210:185804;11098:286183',
                                          layerName: '_Alert-Structure',
                                          type: 'INSTANCE',
                                          parent: {
                                            id: '210:185804',
                                            layerName: 'Alert',
                                            type: 'INSTANCE',
                                            parent: null,
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                              componentProperties: {
                                type: { value: 'Text (Only)', type: 'VARIANT' },
                                size: { value: 'Small', type: 'VARIANT' },
                                screenSize: { value: 'Large', type: 'VARIANT' },
                                padding: { value: 'True', type: 'VARIANT' },
                              },
                              children: [
                                {
                                  id:
                                    'I210:185804;11098:286183;10554:85572;12497:400294;12487:320646;615:281',
                                  layerName: 'Text',
                                  type: 'TEXT',
                                  parent: {
                                    id:
                                      'I210:185804;11098:286183;10554:85572;12497:400294;12487:320646',
                                    layerName: 'ActionsBase',
                                    type: 'INSTANCE',
                                    parent: {
                                      id: 'I210:185804;11098:286183;10554:85572;12497:400294',
                                      layerName: '_CButton',
                                      type: 'INSTANCE',
                                      parent: {
                                        id: 'I210:185804;11098:286183;10554:85572',
                                        layerName: 'Primary Action',
                                        type: 'INSTANCE',
                                        parent: {
                                          id: 'I210:185804;11098:286183;10554:85571',
                                          layerName: 'actions',
                                          type: 'FRAME',
                                          parent: {
                                            id: 'I210:185804;11098:286183;6914:506',
                                            layerName: 'alert-body',
                                            type: 'FRAME',
                                            parent: {
                                              id: 'I210:185804;11098:286183;13564:75289',
                                              layerName: 'main',
                                              type: 'FRAME',
                                              parent: {
                                                id: 'I210:185804;11098:286183',
                                                layerName: '_Alert-Structure',
                                                type: 'INSTANCE',
                                                parent: {
                                                  id: '210:185804',
                                                  layerName: 'Alert',
                                                  type: 'INSTANCE',
                                                  parent: null,
                                                },
                                              },
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                  characters: 'Primary',
                                  textStyleId: 'S:ab83a75a3c6fe6d18b1b48e90944599451ae79a6,13097:5',
                                },
                              ],
                              name: 'ActionsBase',
                            },
                          ],
                          name: '_CButton',
                        },
                      ],
                      name: '_Alert-Action',
                    },
                    {
                      id: 'I210:185804;11098:286183;10554:85573',
                      layerName: 'Link',
                      type: 'INSTANCE',
                      parent: {
                        id: 'I210:185804;11098:286183;10554:85571',
                        layerName: 'actions',
                        type: 'FRAME',
                        parent: {
                          id: 'I210:185804;11098:286183;6914:506',
                          layerName: 'alert-body',
                          type: 'FRAME',
                          parent: {
                            id: 'I210:185804;11098:286183;13564:75289',
                            layerName: 'main',
                            type: 'FRAME',
                            parent: {
                              id: 'I210:185804;11098:286183',
                              layerName: '_Alert-Structure',
                              type: 'INSTANCE',
                              parent: {
                                id: '210:185804',
                                layerName: 'Alert',
                                type: 'INSTANCE',
                                parent: null,
                              },
                            },
                          },
                        },
                      },
                      componentProperties: {
                        type: { value: 'Link', type: 'VARIANT' },
                        size: { value: 'Small', type: 'VARIANT' },
                        intent: { value: 'Negative', type: 'VARIANT' },
                        screenSize: { value: 'Desktop', type: 'VARIANT' },
                        contrast: { value: 'Low', type: 'VARIANT' },
                      },
                      children: [
                        {
                          id: 'I210:185804;11098:286183;10554:85573;12497:400594',
                          layerName: '_CLink',
                          type: 'INSTANCE',
                          parent: {
                            id: 'I210:185804;11098:286183;10554:85573',
                            layerName: 'Link',
                            type: 'INSTANCE',
                            parent: {
                              id: 'I210:185804;11098:286183;10554:85571',
                              layerName: 'actions',
                              type: 'FRAME',
                              parent: {
                                id: 'I210:185804;11098:286183;6914:506',
                                layerName: 'alert-body',
                                type: 'FRAME',
                                parent: {
                                  id: 'I210:185804;11098:286183;13564:75289',
                                  layerName: 'main',
                                  type: 'FRAME',
                                  parent: {
                                    id: 'I210:185804;11098:286183',
                                    layerName: '_Alert-Structure',
                                    type: 'INSTANCE',
                                    parent: {
                                      id: '210:185804',
                                      layerName: 'Alert',
                                      type: 'INSTANCE',
                                      parent: null,
                                    },
                                  },
                                },
                              },
                            },
                          },
                          componentProperties: {
                            Intent: { value: 'Negative', type: 'VARIANT' },
                            Size: { value: 'Small', type: 'VARIANT' },
                            State: { value: 'Default', type: 'VARIANT' },
                            Container: {
                              value: 'Text (Only)',
                              type: 'VARIANT',
                            },
                            screenSize: { value: 'Desktop', type: 'VARIANT' },
                            Contrast: { value: 'Low', type: 'VARIANT' },
                          },
                          children: [
                            {
                              id: 'I210:185804;11098:286183;10554:85573;12497:400594;12497:394718',
                              layerName: 'ActionsBase',
                              type: 'INSTANCE',
                              parent: {
                                id: 'I210:185804;11098:286183;10554:85573;12497:400594',
                                layerName: '_CLink',
                                type: 'INSTANCE',
                                parent: {
                                  id: 'I210:185804;11098:286183;10554:85573',
                                  layerName: 'Link',
                                  type: 'INSTANCE',
                                  parent: {
                                    id: 'I210:185804;11098:286183;10554:85571',
                                    layerName: 'actions',
                                    type: 'FRAME',
                                    parent: {
                                      id: 'I210:185804;11098:286183;6914:506',
                                      layerName: 'alert-body',
                                      type: 'FRAME',
                                      parent: {
                                        id: 'I210:185804;11098:286183;13564:75289',
                                        layerName: 'main',
                                        type: 'FRAME',
                                        parent: {
                                          id: 'I210:185804;11098:286183',
                                          layerName: '_Alert-Structure',
                                          type: 'INSTANCE',
                                          parent: {
                                            id: '210:185804',
                                            layerName: 'Alert',
                                            type: 'INSTANCE',
                                            parent: null,
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                              componentProperties: {
                                type: { value: 'Text (Only)', type: 'VARIANT' },
                                size: { value: 'Small', type: 'VARIANT' },
                                screenSize: { value: 'Large', type: 'VARIANT' },
                                padding: { value: 'False', type: 'VARIANT' },
                              },
                              children: [
                                {
                                  id:
                                    'I210:185804;11098:286183;10554:85573;12497:400594;12497:394718;13818:67099',
                                  layerName: 'Text',
                                  type: 'TEXT',
                                  parent: {
                                    id:
                                      'I210:185804;11098:286183;10554:85573;12497:400594;12497:394718',
                                    layerName: 'ActionsBase',
                                    type: 'INSTANCE',
                                    parent: {
                                      id: 'I210:185804;11098:286183;10554:85573;12497:400594',
                                      layerName: '_CLink',
                                      type: 'INSTANCE',
                                      parent: {
                                        id: 'I210:185804;11098:286183;10554:85573',
                                        layerName: 'Link',
                                        type: 'INSTANCE',
                                        parent: {
                                          id: 'I210:185804;11098:286183;10554:85571',
                                          layerName: 'actions',
                                          type: 'FRAME',
                                          parent: {
                                            id: 'I210:185804;11098:286183;6914:506',
                                            layerName: 'alert-body',
                                            type: 'FRAME',
                                            parent: {
                                              id: 'I210:185804;11098:286183;13564:75289',
                                              layerName: 'main',
                                              type: 'FRAME',
                                              parent: {
                                                id: 'I210:185804;11098:286183',
                                                layerName: '_Alert-Structure',
                                                type: 'INSTANCE',
                                                parent: {
                                                  id: '210:185804',
                                                  layerName: 'Alert',
                                                  type: 'INSTANCE',
                                                  parent: null,
                                                },
                                              },
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                  characters: 'Link',
                                  textStyleId: 'S:ab83a75a3c6fe6d18b1b48e90944599451ae79a6,13097:5',
                                },
                              ],
                              name: 'ActionsBase',
                            },
                          ],
                          name: '_CLink',
                        },
                      ],
                      name: '_Alert-Action',
                    },
                  ],
                  counterAxisAlignItems: 'CENTER',
                  primaryAxisAlignItems: 'MIN',
                  paddingTop: 0,
                  paddingRight: 0,
                  paddingLeft: 0,
                  paddingBottom: 0,
                  layoutMode: 'HORIZONTAL',
                  itemSpacing: 16,
                },
              ],
              counterAxisAlignItems: 'MIN',
              primaryAxisAlignItems: 'MIN',
              paddingTop: 0,
              paddingRight: 0,
              paddingLeft: 0,
              paddingBottom: 0,
              layoutMode: 'VERTICAL',
              itemSpacing: 12,
            },
          ],
          counterAxisAlignItems: 'MIN',
          primaryAxisAlignItems: 'MIN',
          paddingTop: 0,
          paddingRight: 0,
          paddingLeft: 0,
          paddingBottom: 0,
          layoutMode: 'HORIZONTAL',
          itemSpacing: 4,
        },
      ],
      name: '_Alert-Structure',
    },
  ],
  name: 'Alert',
  fills: [],
  fillStyleId: '',
  width: 0,
  height: 0,
};
