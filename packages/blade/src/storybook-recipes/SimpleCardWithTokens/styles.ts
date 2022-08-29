/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { Theme } from '~components/BladeProvider';

type WithTheme = {
  theme: Theme;
};

const StyledCard = ({ theme, isNative }: WithTheme & { isNative: boolean }) => `
  width: 368px;
  font-family: ${theme.typography.fonts.family.text};
  background-color: ${theme.colors.surface.background.level2.lowContrast};
  border-radius: ${theme.border.radius.medium}px;
  padding: ${theme.spacing[5]}px;
  display: flex;
  flex-direction: column;
  ${
    isNative
      ? `
        shadow-color: black;
        shadow-offset: ${theme.shadows.offsetX.level[1]}px ${theme.shadows.offsetY.level[1]}px;
        shadow-opacity: 1;
        shadow-radius: ${theme.shadows.blurRadius.level[1]}px;
        elevation: ${theme.shadows.androidElevation.level[4]};
      `
      : `box-shadow: ${theme.shadows.offsetX.level[1]}px ${theme.shadows.offsetY.level[1]}px ${theme.shadows.blurRadius.level[1]}px ${theme.shadows.color.level[1]}, ${theme.shadows.offsetX.level[1]}px ${theme.shadows.offsetY.level[1]}px ${theme.shadows.blurRadius.level[1]}px ${theme.shadows.color.level[1]};`
  }
`;

const LeadBold = ({ theme }: WithTheme) => `
  font-size: ${theme.typography.fonts.size[200]}px;
  font-weight: ${theme.typography.fonts.weight.bold};
  line-height: 24px;
  color: ${theme.colors.surface.text.subtle.lowContrast};
`;

const DisplayLarge = ({ theme }: WithTheme) => `
  font-family: ${theme.typography.fonts.family.text};
  margin-top: ${theme.spacing[1]}px;
  margin-bottom: ${theme.spacing[6]}px;
  font-size: ${theme.typography.fonts.size[600]}px;
  font-weight: ${theme.typography.fonts.weight.bold};
  line-height: 42px;
  color: ${theme.colors.surface.text.normal.lowContrast};
`;

const DisplayMedium = ({ theme }: WithTheme) => `
  margin-top: ${theme.spacing[1]}px;
  font-size: ${theme.typography.fonts.size[600]}px;
  font-weight: ${theme.typography.fonts.weight.bold};
  line-height: 38px;
  color: ${theme.colors.surface.text.subtle.lowContrast};
`;

const CaptionRegular = ({ theme }: WithTheme) => `
  margin-top: ${theme.spacing[1]}px;
  margin-right: ${theme.spacing[2]}px;
  font-size: ${theme.typography.fonts.size[75]}px;
  font-weight: ${theme.typography.fonts.weight.regular};
  line-height: 16px;
  color: ${theme.colors.surface.text.subtle.lowContrast};
`;

const CaptionBold = ({ theme }: WithTheme) => `
  margin-top: ${theme.spacing[1]}px;
  margin-right: ${theme.spacing[2]}px;
  font-size: ${theme.typography.fonts.size[75]}px;
  font-weight: ${theme.typography.fonts.weight.bold};
  line-height: 16px;
  color: ${theme.colors.surface.text.subtle.lowContrast};
`;

const AlertInformation = ({ theme }: WithTheme) => `
  margin-top: ${theme.spacing[5]}px;
  background-color: ${theme.colors.feedback.background.information.lowContrast};
  padding: ${theme.spacing[1]}px ${theme.spacing[2]}px;
  font-size: ${theme.typography.fonts.size[75]}px;
  font-weight: ${theme.typography.fonts.weight.regular};
  line-height: 16px;
  color: ${theme.colors.surface.text.subdued.lowContrast};
`;

const Divider = ({ theme }: WithTheme) => `
  margin-top:  ${theme.spacing[4]}px;
  margin-bottom:  ${theme.spacing[3]}px;
  border: 1px solid ${theme.colors.surface.border.subtle.lowContrast};
`;

const FlexRow = `
  display: flex;
  flex-direction: row;
`;

export {
  AlertInformation,
  CaptionBold,
  CaptionRegular,
  DisplayLarge,
  DisplayMedium,
  Divider,
  FlexRow,
  LeadBold,
  StyledCard,
};
