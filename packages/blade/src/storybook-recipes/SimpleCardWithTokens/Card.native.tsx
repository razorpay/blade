/* eslint-disable babel/new-cap */
import React from 'react';
import styled from 'styled-components/native';
import * as styles from './styles';

const StyledCard = styled.View(({ theme }) => styles.StyledCard({ theme, isNative: true }));
const LeadBold = styled.Text(styles.LeadBold);
const DisplayLarge = styled.Text(styles.DisplayLarge);
const DisplayMedium = styled.Text(styles.DisplayMedium);
const CaptionRegular = styled.Text(styles.CaptionRegular);
const CaptionBold = styled.Text(styles.CaptionBold);
const AlertInformation = styled.Text(styles.AlertInformation);
const Divider = styled.View(styles.Divider);
const FlexRow = styled.View(() => styles.FlexRow);

const Card = (): React.ReactElement => {
  return (
    <React.Fragment>
      <DisplayLarge>{`Cash Advance `}</DisplayLarge>
      <StyledCard>
        <LeadBold>{`Total Repayable Amount`}</LeadBold>
        <DisplayMedium>{`₹16,666.67`}</DisplayMedium>
        <FlexRow>
          <CaptionRegular>{`Principal:`}</CaptionRegular>
          <CaptionBold>{`₹16,666.67`}</CaptionBold>
          <CaptionRegular>{`Interest:`}</CaptionRegular>
          <CaptionBold>{`₹450.67`}</CaptionBold>
        </FlexRow>
        <AlertInformation>
          {`The interest charged will be deposited back into your bank account within a day of repayment.`}
        </AlertInformation>
        <Divider />
        <CaptionRegular>
          {`This amount will be deducted in 3 instalments from your settlement balance between Feb 18-20 on a daily basis.`}
        </CaptionRegular>
      </StyledCard>
    </React.Fragment>
  );
};

export default Card;
