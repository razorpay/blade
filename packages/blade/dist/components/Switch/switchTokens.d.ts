declare const switchSizes: {
    readonly track: {
        readonly desktop: {
            readonly small: {
                readonly width: 28;
                readonly height: "spacing.5";
            };
            readonly medium: {
                readonly width: 36;
                readonly height: "spacing.6";
            };
        };
        readonly mobile: {
            readonly small: {
                readonly width: 36;
                readonly height: "spacing.6";
            };
            readonly medium: {
                readonly width: 44;
                readonly height: "spacing.7";
            };
        };
    };
    readonly thumb: {
        readonly desktop: {
            readonly small: {
                readonly width: "spacing.4";
                readonly height: "spacing.4";
            };
            readonly medium: {
                readonly width: "spacing.5";
                readonly height: "spacing.5";
            };
        };
        readonly mobile: {
            readonly small: {
                readonly width: "spacing.5";
                readonly height: "spacing.5";
            };
            readonly medium: {
                readonly width: "spacing.6";
                readonly height: "spacing.6";
            };
        };
    };
};
declare const switchColors: {
    readonly track: {
        readonly default: {
            readonly background: {
                readonly checked: "colors.interactive.background.primary.default";
                readonly unchecked: "colors.interactive.background.gray.default";
            };
        };
        readonly disabled: {
            readonly background: {
                readonly checked: "colors.interactive.background.primary.faded";
                readonly unchecked: "colors.interactive.background.gray.disabled";
            };
        };
    };
    readonly thumb: {
        readonly default: {
            readonly background: "colors.interactive.background.staticWhite.default";
        };
        readonly disabled: {
            readonly background: "colors.interactive.background.staticWhite.disabled";
        };
    };
    readonly thumbIcon: {
        readonly default: {
            readonly fill: "colors.interactive.icon.staticBlack.normal";
        };
        readonly disabled: {
            readonly fill: "colors.interactive.icon.staticBlack.disabled";
        };
    };
};
declare const switchMotion: {
    readonly easing: {
        readonly thumb: "motion.easing.standard";
        readonly thumbIcon: "motion.easing.standard";
        readonly track: "motion.easing.standard";
    };
    readonly duration: {
        readonly thumb: "motion.duration.quick";
        readonly thumbIcon: "motion.duration.quick";
        readonly track: "motion.duration.quick";
    };
};
declare const switchHoverTokens: {
    readonly default: {
        readonly background: {
            readonly checked: "colors.interactive.background.primary.highlighted";
            readonly unchecked: "colors.interactive.background.gray.highlighted";
        };
    };
};
export { switchColors, switchSizes, switchHoverTokens, switchMotion };
