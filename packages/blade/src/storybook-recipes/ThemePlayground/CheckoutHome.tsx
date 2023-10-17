import styled from 'styled-components';
import { Box, Card, CardBody, ChevronRightIcon } from '../../components';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import BladeQRCode from './blade-qr-code.png';
import { Heading, Text } from '~components/Typography';
import BaseBox from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { Amount } from '~components/Amount';
import { makeMotionTime, makeSpace, useTheme } from '~utils';

const StyledHeader = styled(BaseBox)({
  boxShadow: '0 4px 8px  rgba(23,26,30,.15)',
});

const StyledFooter = styled(BaseBox)(({ theme }) => ({
  boxShadow: `0 -2px 6px  rgba(23,26,30,.15)`,
  borderTop: `1px solid ${theme.colors.brand.gray[400].lowContrast}`,
  bottom: 0,
  left: 0,
  right: 0,
  position: 'absolute',
}));

const MerchantAvatar = styled.img(() => ({
  maxHeight: '46px',
  maxWidth: '46px',
}));

const QRCodeImage = styled.img(({ theme }) => ({
  maxHeight: '136px',
  maxWidth: '136px',
  border: `2px solid ${theme.colors.brand.primary[500]}`,
}));

const UPIRowImage = styled.img(() => ({
  height: '20px',
  width: '20px',
}));

const ClickableRow = styled.button(({ theme }) => ({
  border: 'none',
  background: 'none',
  cursor: 'pointer',
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
  },
}));

const Checkout = (): React.ReactElement => {
  const { theme } = useTheme();
  return (
    <Box maxWidth="375px">
      <Card surfaceLevel={2} elevation="lowRaised" padding="spacing.0" height="600px">
        <CardBody>
          <Box overflow="scroll">
            <Box>
              <StyledHeader
                backgroundImage="linear-gradient(to bottom right,rgba(255,255,255,0.2),rgba(0,0,0,0.2))"
                height="80px"
                width="100%"
                backgroundColor="brand.primary.500"
                padding="spacing.4"
                borderTopLeftRadius="medium"
                borderTopRightRadius="medium"
                flexDirection="row"
                display="flex"
                gap="spacing.4"
                alignItems="center"
              >
                <MerchantAvatar src="https://i.imgur.com/buGhEkT.png" />
                <Box>
                  <Heading color="action.text.primary.default">Merchant Name</Heading>
                  <Text size="small" color="action.text.primary.default">
                    Razorpay trusted business
                  </Text>
                </Box>
              </StyledHeader>
              <Box padding="spacing.4">
                <Heading marginTop="spacing.3" marginBottom="spacing.3">
                  Pay With UPI QR
                </Heading>
                <Card elevation="none" padding="spacing.5">
                  <CardBody>
                    <Box display="flex" flexDirection="row" justifyContent="space-between">
                      <Box flex={1} display="flex">
                        <QRCodeImage src={BladeQRCode} />
                      </Box>
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
                          <UPIRowImage
                            src="https://cdn.razorpay.com/app/paytm.svg"
                            alt="paytm-app-logo"
                          />
                          <UPIRowImage
                            src="https://cdn.razorpay.com/app/bhim.svg"
                            alt="bhim-app-logo"
                          />
                        </Box>
                        <Text type="subdued" size="small">
                          QR Code is valid for
                          <br /> 12 minutes
                        </Text>
                      </Box>
                    </Box>
                  </CardBody>
                </Card>
                <Heading marginTop="spacing.5" marginBottom="spacing.3">
                  Cards, UPI & More
                </Heading>
                <Card padding="spacing.0" elevation="none">
                  <CardBody>
                    <ClickableRow>
                      <Box paddingRight="spacing.3">
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
                      <Box paddingRight="spacing.2">
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
                  </CardBody>
                </Card>
              </Box>
            </Box>

            <StyledFooter
              display="flex"
              marginTop="spacing.10"
              padding="spacing.4"
              alignItems="center"
            >
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
        </CardBody>
      </Card>
    </Box>
  );
};

export { Checkout };
