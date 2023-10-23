import styled from 'styled-components';
import BladeQRCode from './blade-qr-code.png';
import { useState } from 'react';
import { makeMotionTime, makeSpace } from '@razorpay/blade/utils';
import {
  ActionList,
  ActionListItem,
  ActionListItemIcon,
  Amount,
  BottomSheet,
  BottomSheetBody,
  BottomSheetHeader,
  Box,
  Button,
  Card,
  CardBody,
  ChevronDownIcon,
  ChevronRightIcon,
  CloseIcon,
  Heading,
  InfoIcon,
  Text,
  useTheme,
} from '@razorpay/blade/components';

const StyledHeader = styled.div(({ theme }) => ({
  boxShadow: '0 4px 8px  rgba(23,26,30,.15)', // not in box
  backgroundImage: 'linear-gradient(to bottom right,rgba(255,255,255,0.2),rgba(0,0,0,0.2))',
  height: '80px',
  backgroundColor: theme.colors.brand.primary[500],
  padding: makeSpace(theme.spacing[4]),
  borderTopLeftRadius: 'medium',
  borderTopRightRadius: 'medium',
  flexDirection: 'row',
  display: 'flex',
  gap: makeSpace(theme.spacing[4]),
  alignItems: 'center',
  zIndex: 2,
}));

const StyledFooter = styled.div(({ theme }) => ({
  boxShadow: `0 -2px 6px  rgba(23,26,30,.15)`, // not in box
  borderTop: `1px solid ${theme.colors.brand.gray[400].lowContrast}`,
  zIndex: 2,
  display: 'flex',
  padding: makeSpace(theme.spacing[4]),
  alignItems: 'center',
}));

const MerchantAvatar = styled.img(({ theme }) => ({
  maxHeight: '46px',
  maxWidth: '46px',
  borderRadius: theme.border.radius.small,
}));

const QRCodeImage = styled.img({
  width: '136px',
  zIndex: 1,
});

// can't do after & before on Box
const QRImageWrapper = styled.div`
  align-items: center;
  align-self: center;
  display: flex;
  flex: 0 0 140px;
  height: 140px;
  justify-content: center;
  overflow: hidden;
  position: relative;
  width: 140px;
  margin-right: ${({ theme }) => makeSpace(theme.spacing[6])};
  &:before {
    border-style: solid;
    border-width: 2px;
    border-color: ${({ theme }) => theme.colors.brand.primary[500]};
    bottom: 1px;
    content: '';
    left: 1px;
    position: absolute;
    right: 1px;
    top: 1px;
  }
  &:after {
    background: ${({ theme }) => theme.colors.surface.background.level2.lowContrast};
    content: '';
    height: 120%;
    left: -10%;
    position: absolute;
    top: -10%;
    transform: rotate(45deg);
    width: 120%;
  }
`;

const UPIRowImage = styled.img(() => ({
  height: '20px',
  width: '20px',
}));

const ClickableRow = styled.button(({ theme }) => ({
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  overflow: 'hidden',
  alignItems: 'center',
  display: 'flex',
  flex: 1,
  width: '100%',
  borderBottom: `2px solid ${theme.colors.surface.border.normal.lowContrast}`,
  transition: `background-color ${makeMotionTime(theme.motion.duration.gentle)} ${
    theme.motion.easing.standard.revealing
  }}`,
  padding: `${makeSpace(theme.spacing[4])} ${makeSpace(theme.spacing[4])}`,
  '&:hover': {
    backgroundColor: theme.colors.brand.primary[300],
  },
  '&:last-child': {
    borderBottom: 'none',
    borderBottomLeftRadius: theme.border.radius.medium,
    borderBottomRightRadius: theme.border.radius.medium,
  },
  '&:first-child': {
    borderTopLeftRadius: theme.border.radius.medium,
    borderTopRightRadius: theme.border.radius.medium,
  },
}));

const TrustedBusinessWrapper = styled.div(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  background: 'rgba(255,255,255,0.1 )', // not in box
  padding: `${makeSpace(theme.spacing[1])} ${makeSpace(theme.spacing[2])}`,
  cursor: 'pointer', // not in box
  borderRadius: theme.border.radius.small,
}));

const LanguageSelector = styled.div(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  background: 'rgba(255,255,255,0.1 )', // not in box
  padding: `${makeSpace(theme.spacing[1])} ${makeSpace(theme.spacing[2])}`,
  cursor: 'pointer', // not in box
  borderRadius: theme.border.radius.small,
  gap: makeSpace(theme.spacing[2]),
  marginTop: makeSpace(theme.spacing[3]),
}));

const Checkout = (): React.ReactElement => {
  const { theme } = useTheme();
  const [isLanguageSheetOpen, setIsLanguageSheetOpen] = useState(false);
  const hideLanguageSheet = (): void => setIsLanguageSheetOpen(false);
  return (
    <Box
      maxWidth="375px"
      height="640px"
      backgroundColor="surface.background.level2.lowContrast"
      borderWidth="thin"
      borderColor="surface.border.normal.lowContrast"
      borderRadius="medium"
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      <BottomSheet isOpen={isLanguageSheetOpen} onDismiss={() => setIsLanguageSheetOpen(false)}>
        <BottomSheetHeader title="Choose Language" />
        <BottomSheetBody>
          <ActionList>
            <ActionListItem onClick={hideLanguageSheet} title="English" value="English" />
            <ActionListItem onClick={hideLanguageSheet} title="Hindi" value="Hindi" />
            <ActionListItem onClick={hideLanguageSheet} title="Marathi" value="Marathi" />
            <ActionListItem onClick={hideLanguageSheet} title="Gujarati" value="Gujarati" />
            <ActionListItem onClick={hideLanguageSheet} title="Kannada" value="Kannada" />
          </ActionList>
        </BottomSheetBody>
      </BottomSheet>
      <StyledHeader>
        <MerchantAvatar src="https://i.imgur.com/buGhEkT.png" />
        <Box zIndex={1}>
          <Heading color="action.text.primary.default">Merchant Name</Heading>

          <TrustedBusinessWrapper>
            <img
              src="https://checkout-static-next.razorpay.com/build/assets/images/rtb-live.d7eecf4c.svg"
              height="16"
              width="16"
              alt="rtb-logo"
            />
            <Text
              marginLeft="spacing.2"
              marginRight="spacing.2"
              size="small"
              color="action.text.primary.default"
            >
              Razorpay trusted business
            </Text>
            <InfoIcon size="xsmall" color="action.icon.primary.default" />
          </TrustedBusinessWrapper>
        </Box>

        <Box display="flex" alignItems="flex-end" flexDirection="column" flex={1}>
          <CloseIcon size="medium" color="action.icon.primary.default" />
          <LanguageSelector onClick={() => setIsLanguageSheetOpen(true)}>
            <svg
              width="15px"
              height="15px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.3052 13.184L15.4963 18.9231H14.0391L16.5104 12H17.4377L17.3052 13.184ZM18.8081 18.9231L16.9946 13.184L16.8484 12H17.7848L20.2698 18.9231H18.8081ZM18.7258 16.3459V17.4633H15.213V16.3459H18.7258Z"
                fill="white"
              />
              <rect
                x={11.1162}
                y={9.42285}
                width={12.0769}
                height={12.0769}
                rx={1.5}
                stroke="white"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.67075 15.4609H6.07812V18.3486L7.34426 19.6148H10.232V18.0228H7.67075V15.4609Z"
                fill="white"
              />
              <mask
                id="path-5-outside-1_4902_36286"
                maskUnits="userSpaceOnUse"
                x={3}
                y={2}
                width={14}
                height={14}
                fill="black"
              >
                <rect fill="white" x={3} y={2} width={14} height={14} />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4 4C4 3.44771 4.44772 3 5 3H14.0769C14.6292 3 15.0769 3.44772 15.0769 4V9H12.5C12.277 9 12.0625 9.03649 11.8623 9.10383V6.64649H13.0002V5.42285H9.41587L10.1678 6.64649H10.6491V7.68522C10.6491 7.9644 10.5639 8.18737 10.3934 8.35415C10.2263 8.5173 9.99237 8.59887 9.69159 8.59887C9.44093 8.59887 9.01649 8.45385 8.41826 8.1638C8.98641 7.90639 9.27049 7.49307 9.27049 6.92385C9.27049 6.46702 9.09503 6.10265 8.74411 5.83073C8.3932 5.55881 7.90526 5.42285 7.28029 5.42285C6.74556 5.42285 6.34451 5.47542 6.07715 5.58056L6.65365 6.55948C7.18838 6.27668 7.62954 6.13528 7.97711 6.13528C8.16761 6.13528 8.31967 6.18604 8.4333 6.28756C8.54693 6.38907 8.60375 6.50872 8.60375 6.64649C8.60709 6.88578 8.44166 7.09606 8.10745 7.27734C7.77659 7.45862 7.32708 7.57102 6.75893 7.61452L7.51591 8.56624C7.60614 8.55174 7.69471 8.54449 7.7816 8.54449C8.08573 8.54086 8.33805 8.62788 8.53858 8.80553C8.7391 8.98319 8.83936 9.2116 8.83936 9.49077C8.83936 9.67568 8.75915 9.84064 8.59873 9.98567C8.43831 10.1307 8.24615 10.2032 8.02223 10.2032C7.68802 10.2032 7.38724 10.0437 7.11987 9.72462C6.85251 9.40194 6.67705 8.98137 6.5935 8.46291H6.13229C6.20916 9.36931 6.44645 10.089 6.84415 10.622C7.2452 11.1549 7.71643 11.4232 8.25784 11.4268C8.64552 11.4268 8.96803 11.2873 9.22537 11.0081C9.48605 10.7253 9.61639 10.3446 9.61639 9.86602C9.61639 9.77538 9.61138 9.68293 9.60135 9.58866C10.0258 9.58866 10.375 9.54334 10.6491 9.4527V10.2409C10.553 10.475 10.5 10.7313 10.5 11V14.0769H5C4.44771 14.0769 4 13.6292 4 13.0769V4Z"
                />
              </mask>
              <path
                d="M15.0769 9V10H16.0769V9H15.0769ZM11.8623 9.10383H10.8623V10.495L12.1809 10.0517L11.8623 9.10383ZM11.8623 6.64649V5.64649H10.8623V6.64649H11.8623ZM13.0002 6.64649V7.64649H14.0002V6.64649H13.0002ZM13.0002 5.42285H14.0002V4.42285H13.0002V5.42285ZM9.41587 5.42285V4.42285H7.6276L8.56388 5.94642L9.41587 5.42285ZM10.1678 6.64649L9.31585 7.17006L9.60863 7.64649H10.1678V6.64649ZM10.6491 6.64649H11.6491V5.64649H10.6491V6.64649ZM10.3934 8.35415L11.092 9.06966L11.0928 9.0689L10.3934 8.35415ZM8.41826 8.1638L8.00557 7.25293L6.06286 8.13314L7.98199 9.06362L8.41826 8.1638ZM8.74411 5.83073L9.35663 5.04027L9.35663 5.04027L8.74411 5.83073ZM6.07715 5.58056L5.71118 4.64994L4.62102 5.07865L5.21547 6.08803L6.07715 5.58056ZM6.65365 6.55948L5.79198 7.06694L6.27673 7.89005L7.12116 7.44347L6.65365 6.55948ZM8.4333 6.28756L7.76706 7.03329L7.76706 7.03329L8.4333 6.28756ZM8.60375 6.64649H7.60365L7.60384 6.66045L8.60375 6.64649ZM8.10745 7.27734L7.63065 6.39832L7.62695 6.40035L8.10745 7.27734ZM6.75893 7.61452L6.68258 6.61744L4.80263 6.7614L5.9763 8.23701L6.75893 7.61452ZM7.51591 8.56624L6.73327 9.18873L7.09726 9.64636L7.67459 9.55357L7.51591 8.56624ZM7.7816 8.54449V9.54456L7.79352 9.54442L7.7816 8.54449ZM8.53858 8.80553L9.20171 8.05703L9.20171 8.05703L8.53858 8.80553ZM8.59873 9.98567L7.92812 9.24386L7.92812 9.24386L8.59873 9.98567ZM7.11987 9.72462L6.34984 10.3627L6.35341 10.3669L7.11987 9.72462ZM6.5935 8.46291L7.58076 8.30381L7.44525 7.46291H6.5935V8.46291ZM6.13229 8.46291V7.46291H5.0439L5.13587 8.54742L6.13229 8.46291ZM6.84415 10.622L6.04269 11.22L6.04511 11.2232L6.84415 10.622ZM8.25784 11.4268L8.25115 12.4268H8.25784V11.4268ZM9.22537 11.0081L8.4901 10.3303L8.4901 10.3303L9.22537 11.0081ZM9.60135 9.58866V8.58866H8.48935L8.60696 9.69442L9.60135 9.58866ZM10.6491 9.4527H11.6491V8.06868L10.3351 8.50328L10.6491 9.4527ZM10.6491 10.2409L11.5742 10.6207L11.6491 10.4382V10.2409H10.6491ZM10.5 14.0769V15.0769H11.5V14.0769H10.5ZM5 2C3.89543 2 3 2.89543 3 4H5V4V2ZM14.0769 2H5V4H14.0769V2ZM16.0769 4C16.0769 2.89543 15.1815 2 14.0769 2V4H14.0769H16.0769ZM16.0769 9V4H14.0769V9H16.0769ZM12.5 10H15.0769V8H12.5V10ZM12.1809 10.0517C12.2798 10.0184 12.3867 10 12.5 10V8C12.1673 8 11.8453 8.05455 11.5436 8.15597L12.1809 10.0517ZM12.8623 9.10383V6.64649H10.8623V9.10383H12.8623ZM11.8623 7.64649H13.0002V5.64649H11.8623V7.64649ZM14.0002 6.64649V5.42285H12.0002V6.64649H14.0002ZM13.0002 4.42285H9.41587V6.42285H13.0002V4.42285ZM8.56388 5.94642L9.31585 7.17006L11.0198 6.12292L10.2678 4.89928L8.56388 5.94642ZM10.1678 7.64649H10.6491V5.64649H10.1678V7.64649ZM9.64909 6.64649V7.68522H11.6491V6.64649H9.64909ZM9.64909 7.68522C9.64909 7.7231 9.64341 7.72487 9.65107 7.70481C9.65481 7.69503 9.6607 7.68287 9.66912 7.67003C9.67755 7.65719 9.68641 7.64686 9.69404 7.63939L11.0928 9.0689C11.4883 8.68188 11.6491 8.18369 11.6491 7.68522H9.64909ZM9.69482 7.63863C9.70721 7.62654 9.72093 7.61598 9.73466 7.6076C9.74822 7.59932 9.75859 7.59512 9.76338 7.59345C9.77215 7.59039 9.75308 7.59887 9.69159 7.59887V9.59887C10.1751 9.59887 10.6887 9.46344 11.092 9.06966L9.69482 7.63863ZM9.69159 7.59887C9.73076 7.59887 9.68529 7.60419 9.50859 7.54382C9.3485 7.48912 9.13265 7.39883 8.85453 7.26399L7.98199 9.06362C8.3021 9.21882 8.59759 9.34607 8.86194 9.43639C9.10968 9.52104 9.40176 9.59887 9.69159 9.59887V7.59887ZM8.83096 9.07467C9.24081 8.88898 9.61389 8.6166 9.88155 8.22717C10.1532 7.83197 10.2705 7.38244 10.2705 6.92385H8.27049C8.27049 7.03448 8.24576 7.07622 8.23331 7.09433C8.21689 7.11822 8.16387 7.18121 8.00557 7.25293L8.83096 9.07467ZM10.2705 6.92385C10.2705 6.16829 9.96014 5.50793 9.35663 5.04027L8.1316 6.62119C8.22991 6.69737 8.27049 6.76576 8.27049 6.92385H10.2705ZM9.35663 5.04027C8.77144 4.58682 8.03861 4.42285 7.28029 4.42285V6.42285C7.7719 6.42285 8.01495 6.5308 8.1316 6.62119L9.35663 5.04027ZM7.28029 4.42285C6.70923 4.42285 6.15624 4.47492 5.71118 4.64994L6.44312 6.51119C6.53279 6.47593 6.78189 6.42285 7.28029 6.42285V4.42285ZM5.21547 6.08803L5.79198 7.06694L7.51533 6.05201L6.93882 5.0731L5.21547 6.08803ZM7.12116 7.44347C7.60403 7.1881 7.87199 7.13528 7.97711 7.13528V5.13528C7.38708 5.13528 6.77274 5.36526 6.18615 5.67549L7.12116 7.44347ZM7.97711 7.13528C7.98443 7.13528 7.9606 7.13632 7.91741 7.1219C7.87116 7.10646 7.81702 7.07792 7.76706 7.03329L9.09954 5.54182C8.76001 5.23848 8.34952 5.13528 7.97711 5.13528V7.13528ZM7.76706 7.03329C7.73936 7.00854 7.69449 6.95963 7.65781 6.88239C7.61999 6.80274 7.60375 6.71986 7.60375 6.64649H9.60375C9.60375 6.19189 9.40038 5.81059 9.09954 5.54182L7.76706 7.03329ZM7.60384 6.66045C7.603 6.60015 7.61327 6.53852 7.63388 6.48135C7.654 6.42554 7.67923 6.38699 7.69624 6.36537C7.72532 6.3284 7.7247 6.34732 7.63066 6.39833L8.58424 8.15636C9.03754 7.91048 9.61481 7.43182 9.60365 6.63253L7.60384 6.66045ZM7.62695 6.40035C7.4678 6.48755 7.17463 6.57976 6.68258 6.61744L6.83528 8.61161C7.47953 8.56227 8.08537 8.4297 8.58795 8.15434L7.62695 6.40035ZM5.9763 8.23701L6.73327 9.18873L8.29854 7.94376L7.54156 6.99204L5.9763 8.23701ZM7.67459 9.55357C7.71504 9.54707 7.75051 9.54449 7.7816 9.54449V7.54449C7.6389 7.54449 7.49724 7.55641 7.35722 7.57891L7.67459 9.55357ZM7.79352 9.54442C7.84647 9.54379 7.86946 9.5512 7.87293 9.5524C7.87504 9.55313 7.87496 9.55328 7.87388 9.55265C7.8728 9.55202 7.87322 9.55206 7.87544 9.55403L9.20171 8.05703C8.78988 7.69217 8.28618 7.5384 7.76968 7.54456L7.79352 9.54442ZM7.87544 9.55403C7.87668 9.55513 7.87277 9.55183 7.86661 9.54351C7.86031 9.53501 7.85385 9.52421 7.8485 9.51202C7.84318 9.4999 7.8406 9.49015 7.83952 9.48469C7.8385 9.47952 7.83936 9.48095 7.83936 9.49077H9.83936C9.83936 8.93908 9.6265 8.43338 9.20171 8.05703L7.87544 9.55403ZM7.83936 9.49077C7.83936 9.43299 7.85318 9.3708 7.87988 9.3159C7.90487 9.2645 7.92999 9.24217 7.92812 9.24386L9.26935 10.7275C9.60049 10.4281 9.83936 10.007 9.83936 9.49077H7.83936ZM7.92812 9.24386C7.93574 9.23697 7.95418 9.22343 7.98125 9.21321C8.00777 9.2032 8.02448 9.2032 8.02223 9.2032V11.2032C8.48429 11.2032 8.91806 11.045 9.26935 10.7275L7.92812 9.24386ZM8.02223 9.2032C8.0191 9.2032 8.01954 9.20294 8.02149 9.20343C8.02336 9.2039 8.02137 9.20375 8.01453 9.20012C8.00035 9.1926 7.9551 9.1644 7.88633 9.08233L6.35341 10.3669C6.75998 10.8521 7.32131 11.2032 8.02223 11.2032V9.2032ZM7.88989 9.0866C7.76184 8.93206 7.64303 8.69022 7.58076 8.30381L5.60623 8.62201C5.71107 9.27253 5.94317 9.87182 6.34985 10.3626L7.88989 9.0866ZM6.5935 7.46291H6.13229V9.46291H6.5935V7.46291ZM5.13587 8.54742C5.22291 9.57383 5.49942 10.492 6.0427 11.22L7.6456 10.0239C7.39347 9.68601 7.19541 9.1648 7.12872 8.37841L5.13587 8.54742ZM6.04511 11.2232C6.58534 11.9412 7.32547 12.4206 8.25115 12.4268L8.26454 10.4269C8.10739 10.4258 7.90506 10.3687 7.6432 10.0207L6.04511 11.2232ZM8.25784 12.4268C8.91818 12.4268 9.50949 12.1753 9.96064 11.6859L8.4901 10.3303C8.42657 10.3992 8.37286 10.4268 8.25784 10.4268V12.4268ZM9.96064 11.6859C10.4305 11.1761 10.6164 10.5316 10.6164 9.86602H8.61639C8.61639 10.1576 8.54158 10.2745 8.4901 10.3303L9.96064 11.6859ZM10.6164 9.86602C10.6164 9.73848 10.6093 9.6107 10.5957 9.4829L8.60696 9.69442C8.61342 9.75516 8.61639 9.81228 8.61639 9.86602H10.6164ZM9.60135 10.5887C10.0871 10.5887 10.5522 10.538 10.9631 10.4021L10.3351 8.50328C10.1979 8.54865 9.96444 8.58866 9.60135 8.58866V10.5887ZM9.64909 9.4527V10.2409H11.6491V9.4527H9.64909ZM11.5 11C11.5 10.8638 11.5267 10.7363 11.5742 10.6207L9.72401 9.86111C9.5793 10.2136 9.5 10.5988 9.5 11H11.5ZM11.5 14.0769V11H9.5V14.0769H11.5ZM5 15.0769H10.5V13.0769H5V15.0769ZM3 13.0769C3 14.1815 3.89543 15.0769 5 15.0769V13.0769H5H3ZM3 4V13.0769H5V4H3Z"
                fill="white"
                mask="url(#path-5-outside-1_4902_36286)"
              />
            </svg>
            <ChevronDownIcon size="xsmall" color="action.icon.primary.default" />
          </LanguageSelector>
        </Box>
      </StyledHeader>
      <Box padding="spacing.4" paddingBottom="spacing.8" overflowY="scroll">
        <Heading marginTop="spacing.3" marginBottom="spacing.3">
          Pay With UPI QR
        </Heading>
        <Card elevation="none" padding="spacing.5">
          <CardBody>
            <Box display="flex" flexDirection="row">
              <QRImageWrapper>
                <QRCodeImage src={BladeQRCode} />
              </QRImageWrapper>
              <Box flex={1} display="flex" flexDirection="column" justifyContent="center">
                <Text size="small">Scan the QR using any UPI app on your phone.</Text>
                <Box
                  paddingTop="spacing.3"
                  paddingBottom="spacing.5"
                  display="grid"
                  gridTemplateColumns="20px 20px 20px 20px"
                  columnGap="spacing.4"
                >
                  <UPIRowImage
                    src="https://cdn.razorpay.com/app/googlepay.svg"
                    alt="google_pay-app-logo"
                  />
                  <UPIRowImage
                    src="https://cdn.razorpay.com/app/phonepe.svg"
                    alt="phone_pe-app-logo"
                  />
                  <UPIRowImage src="https://cdn.razorpay.com/app/paytm.svg" alt="paytm-app-logo" />
                  <UPIRowImage src="https://cdn.razorpay.com/app/bhim.svg" alt="bhim-app-logo" />
                </Box>
                <Text type="subdued" size="small">
                  QR Code is valid for
                  <br />
                  <Text type="subdued" size="small" color="feedback.text.negative.lowContrast">
                    12 minutes
                  </Text>
                </Text>
              </Box>
            </Box>
          </CardBody>
        </Card>
        <Heading marginTop="spacing.5" marginBottom="spacing.3">
          Preferred Payment Methods
        </Heading>
        <Card padding="spacing.0" elevation="none">
          <CardBody>
            <ClickableRow>
              <Box paddingRight="spacing.5">
                <UPIRowImage
                  src="https://cdn.razorpay.com/app/googlepay.svg"
                  alt="googlepay-app-logo"
                />
              </Box>
              <Text>UPI - Google Pay</Text>
              <Box display="flex" flex={1} alignItems="center" justifyContent={'flex-end'}>
                <ChevronRightIcon size="xlarge" color="brand.primary.500" />
              </Box>
            </ClickableRow>
            <ClickableRow>
              <Box paddingRight="spacing.5">
                <UPIRowImage
                  src="https://cdn.razorpay.com/app/googlepay.svg"
                  alt="googlepay-app-logo"
                />
              </Box>
              <Text>UPI - Google Pay</Text>
              <Box display="flex" flex={1} alignItems="center" justifyContent={'flex-end'}>
                <ChevronRightIcon size="xlarge" color="brand.primary.500" />
              </Box>
            </ClickableRow>
          </CardBody>
        </Card>
        <Heading marginTop="spacing.5" marginBottom="spacing.3">
          Cards, UPI & More
        </Heading>
        <Card padding="spacing.0" elevation="none">
          <CardBody>
            <ClickableRow>
              <Box paddingRight="spacing.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 27 22"
                  height="24px"
                  width="24px"
                >
                  <path
                    fill={theme.colors.brand.primary[500]}
                    d="M2 7v13h18v-5H7V7H2zm0-2h5v10h15v5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"
                  />
                  <path
                    fill={theme.colors.brand.primary[800]}
                    d="M10.004 13.003a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2h-2zM7 0h18a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 2v13h18V2H7zm-.282 5.005a1 1 0 1 1 0-2h19a1 1 0 0 1 0 2h-19z"
                  />
                </svg>
              </Box>
              <Text>Card</Text>
              <Box display="flex" flex={1} alignItems="center" justifyContent={'flex-end'}>
                <ChevronRightIcon size="xlarge" color="brand.primary.500" />
              </Box>
            </ClickableRow>
            <ClickableRow>
              <Box paddingRight="spacing.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 21 24"
                  height="24px"
                  width="24px"
                >
                  <path
                    fill={theme.colors.brand.primary[500]}
                    d="m9.516 20.254 9.15-8.388-6.1-8.388-1.185 6.516 1.629 2.042-2.359 1.974-1.135 6.244zM12.809.412l8 11a1 1 0 0 1-.133 1.325l-12 11c-.707.648-1.831.027-1.66-.916l1.42-7.805 3.547-3.01-1.986-5.579 1.02-5.606c.157-.865 1.274-1.12 1.792-.41z"
                  />
                  <path
                    fill={theme.colors.brand.primary[800]}
                    d="m5.566 3.479-3.05 16.775 9.147-8.388-6.097-8.387zM5.809.412l7.997 11a1 1 0 0 1-.133 1.325l-11.997 11c-.706.648-1.831.027-1.66-.916l4-22C4.174-.044 5.292-.299 5.81.412z"
                  />
                </svg>
              </Box>
              <Text>UPI / QR</Text>
              <Box display="flex" flex={1} alignItems="center" justifyContent={'flex-end'}>
                <ChevronRightIcon size="xlarge" color="brand.primary.500" />
              </Box>
            </ClickableRow>
            <ClickableRow>
              <Box paddingRight="spacing.5">
                <svg
                  height="24px"
                  width="24px"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 28 25"
                >
                  <path
                    fill={theme.colors.brand.primary[500]}
                    d="M4 15a1 1 0 0 1 2 0v5a1 1 0 0 1-2 0v-5zm6 0a1 1 0 0 1 2 0v5a1 1 0 0 1-2 0v-5zm6 0a1 1 0 0 1 2 0v5a1 1 0 0 1-2 0v-5zM1 25a1 1 0 0 1 0-2h20a1 1 0 0 1 0 2H1zm0-13c-.978 0-1.374-1.259-.573-1.82l10-7a1 1 0 0 1 1.146 0l1.426 1L13 9l1 3H1zm3.172-2h8.814l.017-3.378L11 5.221 4.172 10z"
                  />
                  <path
                    fill={theme.colors.brand.primary[800]}
                    d="M20 16a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm0-2a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm3.663-7H27v2h-3.338c-.162 2.156-.85 4.275-2.057 6.352l-1.21-.704c1.084-1.863 1.703-3.744 1.863-5.648H13V7h9.258c-.16-1.904-.78-3.785-1.863-5.648l1.21-.704C22.814 2.725 23.501 4.844 23.663 7zm-4.058 7.648-1.21.704C17 12.955 16.3 10.502 16.3 8c0-2.501.701-4.955 2.095-7.352l1.21.704C18.332 3.54 17.7 5.754 17.7 8c0 2.246.632 4.46 1.905 6.648z"
                  />
                </svg>
              </Box>
              <Text>Netbanking</Text>
              <Box display="flex" flex={1} alignItems="center" justifyContent={'flex-end'}>
                <ChevronRightIcon size="xlarge" color="brand.primary.500" />
              </Box>
            </ClickableRow>
            <ClickableRow>
              <Box paddingRight="spacing.5">
                <svg
                  height="24px"
                  width="24px"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 25 23"
                >
                  <path
                    fill={theme.colors.brand.primary[500]}
                    d="M2 7v14h19v-5h2.011v-6H21V7H2zm0-2h19a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm15 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
                  />
                  <path
                    fill={theme.colors.brand.primary[800]}
                    d="M7.326 5 16 2.11V5h2V2.11c0-.643-.308-1.352-.83-1.728a2 2 0 0 0-1.802-.276L2 5h5.326zM15 12v4h8v-4h-8zm0-2h8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z"
                  />
                </svg>
              </Box>
              <Text>Wallet</Text>
              <Box display="flex" flex={1} alignItems="center" justifyContent={'flex-end'}>
                <ChevronRightIcon size="xlarge" color="brand.primary.500" />
              </Box>
            </ClickableRow>
            <ClickableRow>
              <Box paddingRight="spacing.5">
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.514 18v-1.5h8.015c.455 0 .824-.336.824-.75V2.25c0-.414-.369-.75-.824-.75h-9.058c-.455 0-.824.336-.824.75v8.25H16v-9c0-.828.737-1.5 1.647-1.5h10.706C29.263 0 30 .672 30 1.5v15c0 .828-.737 1.5-1.647 1.5h-8.84Zm.604-9c0-1.657 1.475-3 3.294-3 1.82 0 3.294 1.343 3.294 3s-1.475 3-3.294 3c-1.82 0-3.294-1.343-3.294-3Zm1.811 0c0 .746.664 1.35 1.483 1.35.818 0 1.482-.604 1.482-1.35 0-.746-.664-1.35-1.482-1.35-.819 0-1.483.604-1.483 1.35Zm3.403-6.303c-.182-.38.009-.822.426-.987.417-.166.902.008 1.084.388.166.349.475.63.859.78.417.164.61.606.429.986-.18.38-.665.555-1.083.39-.767-.3-1.382-.86-1.715-1.557Zm-.01 12.723c.334-.698.95-1.257 1.716-1.559.418-.164.902.011 1.083.391.18.38-.012.822-.43.986a1.59 1.59 0 0 0-.858.78c-.182.38-.667.554-1.084.389-.417-.166-.608-.607-.427-.987Zm-4.45-12.723c-.333.697-.948 1.256-1.715 1.558-.417.164-.902-.01-1.082-.391-.18-.38.011-.822.429-.986a1.59 1.59 0 0 0 .859-.78c.181-.38.666-.554 1.083-.388.417.165.608.607.427.987Z"
                    fill={theme.colors.brand.primary[500]}
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0 19c0 6.075 4.925 11 11 11s11-4.925 11-11S17.075 8 11 8 0 12.925 0 19Zm20 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    fill={theme.colors.brand.primary[800]}
                  />
                  <path d="M20.625 19H1.375h19.25Z" fill={theme.colors.brand.primary[800]} />
                  <path
                    d="M20.625 19H1.375"
                    stroke={theme.colors.brand.primary[500]}
                    strokeWidth={2}
                  />
                  <path
                    d="M20.625 17.625v2.75H1.375v-2.75h19.25Z"
                    fill={theme.colors.brand.primary[800]}
                  />
                  <path
                    d="m11.543 9.859 1.664-.968c1.916 3.296 2.88 6.67 2.88 10.109 0 3.44-.964 6.813-2.88 10.109l-1.664-.968c1.75-3.01 2.62-6.052 2.62-9.141 0-3.089-.87-6.131-2.62-9.141ZM10.457 28.141l-1.664.968c-1.916-3.296-2.88-6.67-2.88-10.109 0-3.44.964-6.813 2.88-10.109l1.664.968c-1.75 3.01-2.62 6.052-2.62 9.141 0 3.089.87 6.131 2.62 9.141Z"
                    fill={theme.colors.brand.primary[800]}
                  />
                </svg>
              </Box>
              <Text>Internet Bank Transfer</Text>
              <Box display="flex" flex={1} alignItems="center" justifyContent="flex-end">
                <ChevronRightIcon size="xlarge" color="brand.primary.500" />
              </Box>
            </ClickableRow>
          </CardBody>
        </Card>
      </Box>
      <StyledFooter>
        <Box flex={1} flexDirection="column">
          <Amount value={5500} />
          <Text size="small" type="subdued">
            View Details
          </Text>
        </Box>
        <Box flex={2}>
          <Button size="large" isFullWidth>
            Pay Now
          </Button>
        </Box>
      </StyledFooter>
    </Box>
  );
};

export { Checkout };
