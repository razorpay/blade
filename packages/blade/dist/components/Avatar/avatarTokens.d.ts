declare const avatarSizeTokens: {
    readonly xsmall: 20;
    readonly small: 28;
    readonly medium: 36;
    readonly large: 48;
    readonly xlarge: 56;
};
declare const avatarIconSizeTokens: {
    readonly xsmall: "small";
    readonly small: "medium";
    readonly medium: "medium";
    readonly large: "large";
    readonly xlarge: "xlarge";
};
declare const avatarTextSizeMapping: {
    readonly xsmall: "xsmall";
    readonly small: "xsmall";
    readonly medium: "small";
    readonly large: "medium";
    readonly xlarge: "medium";
};
declare const avatarColorTokens: {
    readonly text: {
        readonly primary: "interactive.text.primary.normal";
        readonly positive: "interactive.text.positive.normal";
        readonly negative: "interactive.text.negative.normal";
        readonly notice: "interactive.text.notice.normal";
        readonly information: "interactive.text.information.normal";
        readonly neutral: "interactive.text.neutral.normal";
    };
    readonly background: {
        readonly primary: "interactive.background.primary.faded";
        readonly positive: "interactive.background.positive.faded";
        readonly negative: "interactive.background.negative.faded";
        readonly notice: "interactive.background.notice.faded";
        readonly information: "interactive.background.information.faded";
        readonly neutral: "interactive.background.neutral.faded";
    };
};
declare const avatarBorderRadiusTokens: {
    readonly circle: "max";
    readonly square: "medium";
};
declare const avatarToBottomAddonSize: {
    readonly xsmall: "xsmall";
    readonly small: "xsmall";
    readonly medium: "small";
    readonly large: "medium";
    readonly xlarge: "large";
};
declare const avatarToIndicatorSize: {
    readonly xsmall: "small";
    readonly small: "small";
    readonly medium: "medium";
    readonly large: "medium";
    readonly xlarge: "large";
};
declare const avatarTopAddonOffsets: {
    readonly circle: {
        readonly xsmall: {
            readonly right: "0px";
            readonly top: "0px";
        };
        readonly small: {
            readonly right: "1px";
            readonly top: "1px";
        };
        readonly medium: {
            readonly right: "1px";
            readonly top: "2px";
        };
        readonly large: {
            readonly right: "4px";
            readonly top: "2px";
        };
        readonly xlarge: {
            readonly right: "4px";
            readonly top: "2px";
        };
    };
    readonly square: {
        readonly xsmall: {
            readonly right: "-2px";
            readonly top: "-2px";
        };
        readonly small: {
            readonly right: "-2px";
            readonly top: "-2px";
        };
        readonly medium: {
            readonly right: "-2px";
            readonly top: "-2px";
        };
        readonly large: {
            readonly right: "-3px";
            readonly top: "-3px";
        };
        readonly xlarge: {
            readonly right: "-4px";
            readonly top: "-4px";
        };
    };
};
export { avatarSizeTokens, avatarIconSizeTokens, avatarTextSizeMapping, avatarColorTokens, avatarBorderRadiusTokens, avatarToBottomAddonSize, avatarToIndicatorSize, avatarTopAddonOffsets, };
