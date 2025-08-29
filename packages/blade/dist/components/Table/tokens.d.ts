declare const firstColumnStickyZIndex = 2;
declare const refreshWrapperZIndex = 3;
declare const checkboxCellWidth: 44;
declare const tableBackgroundColor = "surface.background.gray.intense";
declare const tableHeader: {
    readonly paddingTop: "spacing.5";
    readonly paddingBottom: "spacing.5";
    readonly paddingLeft: "spacing.4";
    readonly paddingRight: "spacing.4";
    readonly backgroundColor: "interactive.background.gray.default";
    readonly borderBottomAndTopWidth: "thin";
    readonly borderBottomAndTopColor: "surface.border.gray.muted";
};
declare const tableFooter: {
    readonly paddingTop: "spacing.5";
    readonly paddingBottom: "spacing.5";
    readonly paddingLeft: "spacing.4";
    readonly paddingRight: "spacing.4";
    readonly borderBottomAndTopWidth: "thin";
    readonly borderBottomAndTopColor: "surface.border.gray.muted";
    readonly backgroundColor: "interactive.background.gray.default";
};
declare const tableRow: {
    readonly paddingLeft: {
        readonly compact: "spacing.4";
        readonly normal: "spacing.4";
        readonly comfortable: "spacing.4";
    };
    readonly paddingRight: {
        readonly compact: "spacing.4";
        readonly normal: "spacing.4";
        readonly comfortable: "spacing.4";
    };
    readonly minHeight: {
        readonly compact: "36";
        readonly normal: "48";
        readonly comfortable: "60";
    };
    readonly nonStripe: {
        readonly backgroundColor: "transparent";
        readonly backgroundColorHover: "interactive.background.gray.default";
        readonly backgroundColorFocus: "transparent";
        readonly backgroundColorActive: "interactive.background.gray.default";
        readonly backgroundColorSelected: "interactive.background.primary.faded";
        readonly backgroundColorSelectedHover: "interactive.background.primary.fadedHighlighted";
        readonly backgroundColorSelectedFocus: "interactive.background.primary.faded";
        readonly backgroundColorSelectedActive: "interactive.background.primary.fadedHighlighted";
    };
    readonly nonStripeWrapper: {
        readonly backgroundColor: "transparent";
        readonly backgroundColorHover: "transparent";
        readonly backgroundColorFocus: "transparent";
        readonly backgroundColorActive: "interactive.background.gray.default";
        readonly backgroundColorSelected: "transparent";
        readonly backgroundColorSelectedHover: "transparent";
        readonly backgroundColorSelectedFocus: "transparent";
        readonly backgroundColorSelectedActive: "transparent";
    };
    readonly stripe: {
        readonly backgroundColor: "transparent";
        readonly backgroundColorHover: "interactive.background.gray.default";
        readonly backgroundColorFocus: "transparent";
        readonly backgroundColorActive: "interactive.background.gray.default";
        readonly backgroundColorSelected: "interactive.background.primary.faded";
        readonly backgroundColorSelectedHover: "interactive.background.primary.fadedHighlighted";
        readonly backgroundColorSelectedFocus: "interactive.background.primary.faded";
        readonly backgroundColorSelectedActive: "interactive.background.primary.fadedHighlighted";
    };
    readonly stripeWrapper: {
        readonly backgroundColor: "interactive.background.gray.default";
        readonly backgroundColorHover: "interactive.background.gray.default";
        readonly backgroundColorFocus: "interactive.background.gray.default";
        readonly backgroundColorActive: "interactive.background.gray.default";
        readonly backgroundColorSelected: "interactive.background.primary.faded";
        readonly backgroundColorSelectedHover: "interactive.background.primary.faded";
        readonly backgroundColorSelectedFocus: "interactive.background.primary.faded";
        readonly backgroundColorSelectedActive: "interactive.background.primary.faded";
    };
    readonly borderBottomWidth: "thin";
    readonly borderColor: "surface.border.gray.muted";
    readonly backgroundColorMotionEasing: "easing.standard";
    readonly backgroundColorMotionDuration: "duration.xquick";
    readonly groupHeaderBackgroundColor: "surface.background.gray.moderate";
};
declare const tableToolbar: {
    readonly backgroundColor: "transparent";
    readonly backgroundColorSelected: "interactive.background.primary.faded";
    readonly backgroundColorMotionEasing: "easing.standard";
    readonly backgroundColorMotionDuration: "duration.xquick";
};
declare const tablePagination: {
    readonly padding: "spacing.4";
    readonly pageSelectionButton: {
        readonly backgroundColor: "transparent";
        readonly backgroundColorHover: "interactive.background.gray.default";
        readonly backgroundColorActive: "interactive.background.gray.highlighted";
        readonly backgroundColorSelected: "interactive.background.primary.faded";
        readonly backgroundColorSelectedHover: "interactive.background.primary.fadedHighlighted";
        readonly backgroundColorSelectedActive: "interactive.background.primary.fadedHighlighted";
        readonly padding: "spacing.2";
        readonly borderRadius: "small";
        readonly focusRingColor: "surface.border.primary.muted";
        readonly textColor: "surface.text.gray.subtle";
        readonly textColorSelected: "surface.text.primary.normal";
        readonly height: 32;
        readonly width: 32;
    };
    readonly defaultPageSize: 10;
};
declare const tableEditableCellRowDensityToInputSizeMap: {
    readonly compact: "medium";
    readonly normal: "large";
    readonly comfortable: "medium";
};
declare const validationStateToInputTrailingIconMap: {
    none: undefined;
    success: import('react').FunctionComponent<import('../Icons').IconProps>;
    error: import('react').FunctionComponent<import('../Icons').IconProps>;
};
declare const rowDensityToIsTableInputCellMapping: {
    comfortable: boolean;
    normal: boolean;
    compact: boolean;
};
declare const classes: {
    HOVER_ACTIONS: string;
    HOVER_ACTIONS_LAYER2: string;
    HOVER_ACTIONS_LAYER3: string;
    HAS_ROW_SPANNING: string;
};
export { tableHeader, tableFooter, tableRow, tableToolbar, tablePagination, refreshWrapperZIndex, tableBackgroundColor, firstColumnStickyZIndex, checkboxCellWidth, tableEditableCellRowDensityToInputSizeMap, validationStateToInputTrailingIconMap, rowDensityToIsTableInputCellMapping, classes, };
