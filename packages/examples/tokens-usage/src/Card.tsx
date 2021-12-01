import React from 'react';
import { useTheme, Theme } from '@razorpay/blade/components';
import styled, { createGlobalStyle } from 'styled-components';

const StyledCard = styled.div(
  ({ theme }: { theme: Theme }) => `
  width: 368px;
  background-color: ${theme.colors.surface.background.level2.lowContrast};
  border-radius: ${theme.border.radius.medium}px;
  box-shadow: ${theme.shadows.offsetX.level[1]}px ${theme.shadows.offsetY.level[1]}px ${theme.shadows.blurRadius.level[1]}px ${theme.shadows.color.level[1]}, ${theme.shadows.offsetX.level[1]}px ${theme.shadows.offsetY.level[1]}px ${theme.shadows.blurRadius.level[1]}px ${theme.shadows.color.level[1]};
  padding: ${theme.spacing[5]}px;
  display: flex;
  flex-direction: column;
`,
);

const LeadBold = styled.span(
  ({ theme }: { theme: Theme }) => `
    font-size: ${theme.typography.fonts.size[200]}px;
    font-weight: ${theme.typography.fonts.weight.bold};
    line-height: 24px;
    color: ${theme.colors.surface.text.subtle.lowContrast};
`,
);

const DisplayLarge = styled.div(
  ({ theme }: { theme: Theme }) => `
    margin-top: ${theme.spacing[1]}px;
    margin-bottom: ${theme.spacing[6]}px;
    font-size: ${theme.typography.fonts.size[600]}px;
    font-weight: ${theme.typography.fonts.weight.bold};
    line-height: 42px;
    color: ${theme.colors.surface.text.normal.lowContrast};
`,
);

const DisplayMedium = styled.span(
  ({ theme }: { theme: Theme }) => `
    margin-top: ${theme.spacing[1]}px;
    font-size: ${theme.typography.fonts.size[600]}px;
    font-weight: ${theme.typography.fonts.weight.bold};
    line-height: 38px;
    color: ${theme.colors.surface.text.subtle.lowContrast};
`,
);

const CaptionRegular = styled.span(
  ({ theme }: { theme: Theme }) => `
    margin-top: ${theme.spacing[1]}px;
    margin-right: ${theme.spacing[2]}px;
    font-size: ${theme.typography.fonts.size[75]}px;
    font-weight: ${theme.typography.fonts.weight.regular};
    line-height: 16px;
    color: ${theme.colors.surface.text.subtle.lowContrast};
`,
);

const CaptionBold = styled.span(
  ({ theme }: { theme: Theme }) => `
    margin-top: ${theme.spacing[1]}px;
    margin-right: ${theme.spacing[2]}px;
    font-size: ${theme.typography.fonts.size[75]}px;
    font-weight: ${theme.typography.fonts.weight.bold};
    line-height: 16px;
    color: ${theme.colors.surface.text.subtle.lowContrast};
`,
);

const AlertInformation = styled.div(
  ({ theme }: { theme: Theme }) => `
    margin-top: ${theme.spacing[5]}px;
    background-color: ${theme.colors.feedback.background.information.lowContrast};
    padding: ${theme.spacing[1]}px ${theme.spacing[2]}px;
    font-size: ${theme.typography.fonts.size[75]}px;
    font-weight: ${theme.typography.fonts.weight.regular};
    line-height: 16px;
    color: ${theme.colors.surface.text.subdued.lowContrast};
`,
);

const Divider = styled.div(
  ({ theme }: { theme: Theme }) => `
  margin-top:  ${theme.spacing[4]}px;
  margin-bottom:  ${theme.spacing[3]}px;
  border: 1px solid ${theme.colors.surface.border.subtle.lowContrast};
`,
);

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
`;

const Card = (): React.ReactElement => {
  const { theme } = useTheme();
  const GlobalStyle = createGlobalStyle`
    html {
      box-sizing: border-box;
    }
    body {
        margin: 16px;
        font-family: ${theme.typography.fonts.family.text};
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background-color: ${theme.colors.surface.background.level1.lowContrast};
      }
    `;
  return (
    <React.Fragment>
      <GlobalStyle />
      <DisplayLarge theme={theme}>Cash Advance </DisplayLarge>
      <StyledCard theme={theme}>
        <LeadBold theme={theme}>Total Repayable Amount</LeadBold>
        <DisplayMedium theme={theme}>₹16,666.67</DisplayMedium>
        <FlexRow>
          <CaptionRegular theme={theme}>Principal:</CaptionRegular>
          <CaptionBold theme={theme}>₹16,666.67</CaptionBold>
          <CaptionRegular theme={theme}>Interest:</CaptionRegular>
          <CaptionBold theme={theme}>₹450.67</CaptionBold>
        </FlexRow>
        <AlertInformation theme={theme}>
          The interest charged will be deposited back into your bank account within a day of
          repayment.
        </AlertInformation>
        <Divider theme={theme} />
        <CaptionRegular theme={theme}>
          This amount will be deducted in 3 instalments from your settlement balance between Feb
          18-20 on a daily basis.
        </CaptionRegular>
      </StyledCard>
    </React.Fragment>
  );
};

export default Card;
