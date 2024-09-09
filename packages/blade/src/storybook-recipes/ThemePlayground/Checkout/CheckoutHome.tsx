/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
import styled from 'styled-components';
import { Heading, Text, Box, Card, CardBody, ChevronRightIcon } from '../../../components';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import BladeQRCode from './blade-qr-code.png';
import { CheckoutShell } from './CheckoutShell';
import { useTheme } from '~components/BladeProvider';
import { makeMotionTime, makeSpace } from '~utils';

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
    border-color: ${({ theme }) => theme.colors.surface.icon.primary.normal};
    bottom: 1px;
    content: '';
    left: 1px;
    position: absolute;
    right: 1px;
    top: 1px;
  }
  &:after {
    background: ${({ theme }) => theme.colors.surface.background.gray.intense};
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
  borderBottom: `2px solid ${theme.colors.surface.border.gray.muted}`,
  transition: `background-color ${makeMotionTime(theme.motion.duration.gentle)} ${
    theme.motion.easing.emphasized
  }}`,
  padding: `${makeSpace(theme.spacing[4])} ${makeSpace(theme.spacing[4])}`,
  '&:hover': {
    backgroundColor: theme.colors.interactive.background.primary.faded,
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

const CheckoutHome = (): React.ReactElement => {
  const { theme } = useTheme();
  return (
    <CheckoutShell>
      <Box padding="spacing.7" paddingBottom="spacing.8" overflowY="scroll">
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
                <Text size="small">
                  QR Code is valid for
                  <br />
                  <Text size="small" color="feedback.text.negative.intense">
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
              <Box display="flex" flex={1} alignItems="center" justifyContent="flex-end">
                <ChevronRightIcon size="xlarge" color="surface.icon.primary.normal" />
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
              <Box display="flex" flex={1} alignItems="center" justifyContent="flex-end">
                <ChevronRightIcon size="xlarge" color="surface.icon.primary.normal" />
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
                    fill={theme.colors.surface.icon.primary.normal}
                    d="M2 7v13h18v-5H7V7H2zm0-2h5v10h15v5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"
                  />
                  <path
                    fill={theme.colors.surface.icon.primary.normal}
                    d="M10.004 13.003a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2h-2zM7 0h18a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 2v13h18V2H7zm-.282 5.005a1 1 0 1 1 0-2h19a1 1 0 0 1 0 2h-19z"
                  />
                </svg>
              </Box>
              <Text>Card</Text>
              <Box display="flex" flex={1} alignItems="center" justifyContent="flex-end">
                <ChevronRightIcon size="xlarge" color="surface.icon.primary.normal" />
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
                    fill={theme.colors.surface.icon.primary.normal}
                    d="m9.516 20.254 9.15-8.388-6.1-8.388-1.185 6.516 1.629 2.042-2.359 1.974-1.135 6.244zM12.809.412l8 11a1 1 0 0 1-.133 1.325l-12 11c-.707.648-1.831.027-1.66-.916l1.42-7.805 3.547-3.01-1.986-5.579 1.02-5.606c.157-.865 1.274-1.12 1.792-.41z"
                  />
                  <path
                    fill={theme.colors.surface.icon.primary.normal}
                    d="m5.566 3.479-3.05 16.775 9.147-8.388-6.097-8.387zM5.809.412l7.997 11a1 1 0 0 1-.133 1.325l-11.997 11c-.706.648-1.831.027-1.66-.916l4-22C4.174-.044 5.292-.299 5.81.412z"
                  />
                </svg>
              </Box>
              <Text>UPI / QR</Text>
              <Box display="flex" flex={1} alignItems="center" justifyContent="flex-end">
                <ChevronRightIcon size="xlarge" color="surface.icon.primary.normal" />
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
                    fill={theme.colors.surface.icon.primary.normal}
                    d="M4 15a1 1 0 0 1 2 0v5a1 1 0 0 1-2 0v-5zm6 0a1 1 0 0 1 2 0v5a1 1 0 0 1-2 0v-5zm6 0a1 1 0 0 1 2 0v5a1 1 0 0 1-2 0v-5zM1 25a1 1 0 0 1 0-2h20a1 1 0 0 1 0 2H1zm0-13c-.978 0-1.374-1.259-.573-1.82l10-7a1 1 0 0 1 1.146 0l1.426 1L13 9l1 3H1zm3.172-2h8.814l.017-3.378L11 5.221 4.172 10z"
                  />
                  <path
                    fill={theme.colors.surface.icon.primary.normal}
                    d="M20 16a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm0-2a6 6 0 1 0 0-12 6 6 0 0 0 0 12zm3.663-7H27v2h-3.338c-.162 2.156-.85 4.275-2.057 6.352l-1.21-.704c1.084-1.863 1.703-3.744 1.863-5.648H13V7h9.258c-.16-1.904-.78-3.785-1.863-5.648l1.21-.704C22.814 2.725 23.501 4.844 23.663 7zm-4.058 7.648-1.21.704C17 12.955 16.3 10.502 16.3 8c0-2.501.701-4.955 2.095-7.352l1.21.704C18.332 3.54 17.7 5.754 17.7 8c0 2.246.632 4.46 1.905 6.648z"
                  />
                </svg>
              </Box>
              <Text>Netbanking</Text>
              <Box display="flex" flex={1} alignItems="center" justifyContent="flex-end">
                <ChevronRightIcon size="xlarge" color="surface.icon.primary.normal" />
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
                    fill={theme.colors.surface.background.primary.intense}
                    d="M2 7v14h19v-5h2.011v-6H21V7H2zm0-2h19a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm15 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
                  />
                  <path
                    fill={theme.colors.surface.background.primary.intense}
                    d="M7.326 5 16 2.11V5h2V2.11c0-.643-.308-1.352-.83-1.728a2 2 0 0 0-1.802-.276L2 5h5.326zM15 12v4h8v-4h-8zm0-2h8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z"
                  />
                </svg>
              </Box>
              <Text>Wallet</Text>
              <Box display="flex" flex={1} alignItems="center" justifyContent="flex-end">
                <ChevronRightIcon size="xlarge" color="surface.icon.primary.normal" />
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
                    fill={theme.colors.surface.icon.primary.normal}
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0 19c0 6.075 4.925 11 11 11s11-4.925 11-11S17.075 8 11 8 0 12.925 0 19Zm20 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    fill={theme.colors.surface.icon.primary.normal}
                  />
                  <path
                    d="M20.625 19H1.375h19.25Z"
                    fill={theme.colors.surface.icon.primary.normal}
                  />
                  <path
                    d="M20.625 19H1.375"
                    stroke={theme.colors.surface.icon.primary.normal}
                    strokeWidth={2}
                  />
                  <path
                    d="M20.625 17.625v2.75H1.375v-2.75h19.25Z"
                    fill={theme.colors.surface.icon.primary.normal}
                  />
                  <path
                    d="m11.543 9.859 1.664-.968c1.916 3.296 2.88 6.67 2.88 10.109 0 3.44-.964 6.813-2.88 10.109l-1.664-.968c1.75-3.01 2.62-6.052 2.62-9.141 0-3.089-.87-6.131-2.62-9.141ZM10.457 28.141l-1.664.968c-1.916-3.296-2.88-6.67-2.88-10.109 0-3.44.964-6.813 2.88-10.109l1.664.968c-1.75 3.01-2.62 6.052-2.62 9.141 0 3.089.87 6.131 2.62 9.141Z"
                    fill={theme.colors.surface.icon.primary.normal}
                  />
                </svg>
              </Box>
              <Text>Internet Bank Transfer</Text>
              <Box display="flex" flex={1} alignItems="center" justifyContent="flex-end">
                <ChevronRightIcon size="xlarge" color="surface.icon.primary.normal" />
              </Box>
            </ClickableRow>
          </CardBody>
        </Card>
      </Box>
    </CheckoutShell>
  );
};

export { CheckoutHome };
