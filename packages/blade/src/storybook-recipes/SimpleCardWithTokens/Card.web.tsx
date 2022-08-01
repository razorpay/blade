/* eslint-disable babel/new-cap */
import React from 'react';
import styled from 'styled-components';
import * as styles from './styles';

const StyledCard = styled.div(({ theme }) => styles.StyledCard({ theme, isNative: false }));
const LeadBold = styled.span(styles.LeadBold);
const DisplayLarge = styled.span(styles.DisplayLarge);
const DisplayMedium = styled.span(styles.DisplayMedium);
const CaptionRegular = styled.span(styles.CaptionRegular);
const CaptionBold = styled.span(styles.CaptionBold);
const AlertInformation = styled.div(styles.AlertInformation);
const Divider = styled.div(styles.Divider);
const FlexRow = styled.div(() => styles.FlexRow);

const Card = (): React.ReactElement => {
  return (
    <React.Fragment>
      <DisplayLarge>Cash Advance </DisplayLarge>
      <StyledCard>
        <LeadBold>Total Repayable Amount</LeadBold>
        <DisplayMedium>₹16,666.67</DisplayMedium>
        <FlexRow>
          <CaptionRegular>Principal:</CaptionRegular>
          <CaptionBold>₹16,666.67</CaptionBold>
          <CaptionRegular>Interest:</CaptionRegular>
          <CaptionBold>₹450.67</CaptionBold>
        </FlexRow>
        <AlertInformation>
          The interest charged will be deposited back into your bank account within a day of
          repayment.
        </AlertInformation>
        <Divider />
        <CaptionRegular>
          This amount will be deducted in 3 instalments from your settlement balance between Feb
          18-20 on a daily basis.
        </CaptionRegular>
      </StyledCard>
    </React.Fragment>
  );
};

export default Card;
